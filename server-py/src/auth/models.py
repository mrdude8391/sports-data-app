from typing import List
import uuid
import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.database import Base
from sqlalchemy import types


class User(Base):
    __tablename__ = "users"

    # Columns in databse
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )

    # Relationships for ORM
    # The relationship is only able to be seen when developing with the ORM, it doesn't do anything on the database side. That is handeld by the ForeignKey.
    athletes: Mapped[List["Athlete"]] = relationship(back_populates="user", cascade="all, delete-orphan") # type: ignore
    # ORM will allow you to access related objects as if they were standard Python attributes
