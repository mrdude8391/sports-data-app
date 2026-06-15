import logging
from typing import Annotated
from fastapi import Depends
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    async_session,
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from sqlalchemy.orm import DeclarativeBase

from dotenv import load_dotenv

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# Load environment variables from .env
load_dotenv()
import os

DATABASE_URL = os.getenv("SUPABASE_URI")

# Create the SQLAlchemy engine
engine = create_async_engine(
    DATABASE_URL,
    poolclass=NullPool,  # 🔴 Required for pgBouncer transaction pooling
    connect_args={
        "statement_cache_size": 0,
    },
)
# If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
# engine = create_engine(DATABASE_URL, poolclass=NullPool)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Recommended for async ORM usage to prevent implicit I/O
)


# Create Base class for models
class Base(AsyncAttrs, DeclarativeBase):
    pass


async def init_db():
    """
    Sync and Create database tables
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """
    Dependency that provides a database session per request.
    """
    logger.info("\tget_db() => SqlAlchemy db Session Dependency")
    async with async_session() as session:
        async with session.begin():
            yield session
            ## verbose version of what it already does under the hood
            # try:
            #     yield session
            # except Exception:
            #     await session.rollback()
            #     raise
            # finally:
            #     await session.close()


DbSession = Annotated[AsyncSession, Depends(get_db)]
