import datetime

from sqlalchemy import DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid
from sqlalchemy import types


class Stat(Base):
    __tablename__ = "stats"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    athlete_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("athletes.id"), nullable=False, index=True
    )
    # Attack stats
    attack_kills: Mapped[int] = mapped_column(default=0)
    attack_errors: Mapped[int] = mapped_column(default=0)
    attack_total: Mapped[int] = mapped_column(default=0)
    attack_percentage: Mapped[float] = mapped_column(default=0.0)

    # Setting stats
    setting_assists: Mapped[int] = mapped_column(default=0)
    setting_errors: Mapped[int] = mapped_column(default=0)
    setting_attempts: Mapped[int] = mapped_column(default=0)

    # Serving stats
    serving_rating: Mapped[float] = mapped_column(default=0.0)
    serving_rating_total: Mapped[float] = mapped_column(default=0.0)
    serving_aces: Mapped[int] = mapped_column(default=0)
    serving_errors: Mapped[int] = mapped_column(default=0)
    serving_attempts: Mapped[int] = mapped_column(default=0)
    serving_percentage: Mapped[float] = mapped_column(default=0.0)

    # Receiving stats
    receiving_rating: Mapped[float] = mapped_column(default=0.0)
    receiving_rating_total: Mapped[float] = mapped_column(default=0.0)
    receiving_errors: Mapped[int] = mapped_column(default=0)
    receiving_attempts: Mapped[int] = mapped_column(default=0)

    # Defense stats
    defense_digs: Mapped[int] = mapped_column(default=0)
    defense_rating: Mapped[float] = mapped_column(default=0.0)
    defense_rating_total: Mapped[float] = mapped_column(default=0.0)
    defense_errors: Mapped[int] = mapped_column(default=0)
    defense_attempts: Mapped[int] = mapped_column(default=0)

    # Blocking stats
    blocking_total: Mapped[int] = mapped_column(default=0)
    blocking_kills: Mapped[int] = mapped_column(default=0)
    blocking_solos: Mapped[int] = mapped_column(default=0)
    blocking_good_touches: Mapped[int] = mapped_column(default=0)
    blocking_attempts: Mapped[int] = mapped_column(default=0)
    blocking_errors: Mapped[int] = mapped_column(default=0)

    recorded_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship()  # type: ignore
    athlete: Mapped["Athlete"] = relationship(back_populates="stats")  # type: ignore

    # Index for efficient querying
    __table_args__ = (Index("idx_user_id_athlete_id", "user_id", "athlete_id"),)
