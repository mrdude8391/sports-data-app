import pytest
import os

os.environ["DATABASE_URL"] = (
    "postgresql+asyncpg://testuser:testpass@localhost/sports-test"
)
from collections.abc import AsyncGenerator
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    async_session,
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)

from httpx import AsyncClient, ASGITransport

pytest_plugins = ["anyio"]


from src.database import Base, get_db
from src.main import app
from src.auth.schemas import UserWithToken


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="session")
def test_engine():
    engine = create_async_engine(os.environ["DATABASE_URL"], poolclass=NullPool)
    return engine


@pytest.fixture(scope="session")
async def setup_database(test_engine):
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await test_engine.dispose()


@pytest.fixture()
async def db_session(test_engine, setup_database) -> AsyncGenerator[AsyncSession]:
    conn = await test_engine.connect()
    trans = await conn.begin()
    test_async_session = async_sessionmaker(
        bind=conn,
        class_=AsyncSession,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    async with test_async_session() as session:
        async with session.begin():
            try:
                yield session
            finally:
                await session.close()
                await trans.rollback()
                await conn.close()


@pytest.fixture
async def client(
    db_session: AsyncSession,
) -> AsyncGenerator[AsyncClient]:

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


async def create_test_user(
    client: AsyncClient,
    username: str = "testuser",
    email: str = "test@example.com",
    password: str = "testpassword123",
) -> UserWithToken:
    response = await client.post(
        "/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()


async def login_user(
    client: AsyncClient,
    email: str = "test@example.com",
    password: str = "testpassword123",
) -> UserWithToken:
    response = await client.post(
        "/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    return response.json()


def auth_header(token: str):
    return {"Authorization": f"Bearer {token}"}
