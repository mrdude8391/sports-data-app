from typing import List
from sqlalchemy import DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from sqlalchemy.orm import relationship, Mapped, mapped_column
import uuid
import datetime


class Athlete(Base):
    __tablename__ = "athletes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    height: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="athletes")  # type: ignore
    stats: Mapped[List["Stat"]] = relationship(back_populates="athlete", cascade="all, delete-orphan", passive_deletes=True)  # type: ignore

    # Compound unique index: prevents duplicate athlete names per user
    __table_args__ = (Index("idx_user_athlete_name", "user_id", "name", unique=True),)

    # UniqueConstraint(user_id, name, name="uq_userid_athletename")
