from typing import Annotated
from fastapi import Depends
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase
# from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# # Fetch variables
# USER = os.getenv("user")
# PASSWORD = os.getenv("password")
# HOST = os.getenv("host")
# PORT = os.getenv("port")
# DBNAME = os.getenv("dbname")

# # Construct the SQLAlchemy connection string
# DATABASE_URL = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
DATABASE_URL = os.getenv("SUPABASE_URI")

# Create the SQLAlchemy engine
engine = create_async_engine(DATABASE_URL,  
                            poolclass=NullPool, # 🔴 Required for pgBouncer transaction pooling
                            connect_args={
                                "statement_cache_size": 0,
                            },
)
# If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
# engine = create_engine(DATABASE_URL, poolclass=NullPool)

SessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False, # Recommended for async ORM usage to prevent implicit I/O
    autoflush=False
)

# Create Base class for models
class Base(DeclarativeBase):
    pass

async def get_db():
    """
    Dependency that provides a database session per request.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    db = SessionLocal()
    print("\nLog:\tget_db() => SqlAlchemy db Session Dependency")
    try:
        yield db
    finally:
       await db.close()
