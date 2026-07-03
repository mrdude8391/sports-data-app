import datetime

from sqlalchemy import DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid
from sqlalchemy import types
from src.athletes.schemas import StatCreate


class Stat(Base):
    __tablename__ = "stats"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    athlete_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("athletes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
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

    def __init__(
        self, athlete_id: uuid.UUID, user_id: uuid.UUID, stat_data: StatCreate, **kw
    ):
        self.athlete_id = athlete_id
        self.user_id = user_id
        # Attack stats
        self.attack_kills = stat_data.attack.kills if stat_data.attack else 0
        self.attack_errors = stat_data.attack.errors if stat_data.attack else 0
        self.attack_total = stat_data.attack.total if stat_data.attack else 0
        self.attack_percentage = (
            stat_data.attack.percentage if stat_data.attack else 0.0
        )

        # Setting stats
        self.setting_assists = stat_data.setting.assists if stat_data.setting else 0
        self.setting_errors = stat_data.setting.errors if stat_data.setting else 0
        self.setting_attempts = stat_data.setting.attempts if stat_data.setting else 0

        # Serving stats
        self.serving_rating = stat_data.serving.rating if stat_data.serving else 0.0
        self.serving_rating_total = (
            stat_data.serving.ratingTotal if stat_data.serving else 0.0
        )

        self.serving_aces = stat_data.serving.aces if stat_data.serving else 0
        self.serving_errors = stat_data.serving.errors if stat_data.serving else 0
        self.serving_attempts = stat_data.serving.attempts if stat_data.serving else 0

        self.serving_percentage = (
            stat_data.serving.percentage if stat_data.serving else 0.0
        )

        # Receiving stats
        self.receiving_rating = (
            stat_data.receiving.rating if stat_data.receiving else 0.0
        )

        self.receiving_rating_total = (
            stat_data.receiving.ratingTotal if stat_data.receiving else 0.0
        )

        self.receiving_errors = stat_data.receiving.errors if stat_data.receiving else 0

        self.receiving_attempts = (
            stat_data.receiving.attempts if stat_data.receiving else 0
        )

        # Defense stats
        self.defense_digs = stat_data.defense.digs if stat_data.defense else 0
        self.defense_rating = stat_data.defense.rating if stat_data.defense else 0.0
        self.defense_rating_total = (
            stat_data.defense.ratingTotal if stat_data.defense else 0.0
        )

        self.defense_errors = stat_data.defense.errors if stat_data.defense else 0
        self.defense_attempts = stat_data.defense.attempts if stat_data.defense else 0

        # Blocking stats
        self.blocking_total = stat_data.blocking.total if stat_data.blocking else 0
        self.blocking_kills = stat_data.blocking.kills if stat_data.blocking else 0
        self.blocking_solos = stat_data.blocking.solos if stat_data.blocking else 0
        self.blocking_good_touches = (
            stat_data.blocking.goodTouches if stat_data.blocking else 0
        )

        self.blocking_attempts = (
            stat_data.blocking.attempts if stat_data.blocking else 0
        )
        self.blocking_errors = stat_data.blocking.errors if stat_data.blocking else 0
        # Recorded at
        self.recorded_at = stat_data.recordedAt if stat_data.recordedAt else None
        super().__init__(**kw)

    # Relationships
    user: Mapped["User"] = relationship()  # type: ignore
    athlete: Mapped["Athlete"] = relationship(back_populates="stats")  # type: ignore

    # Index for efficient querying
    __table_args__ = (Index("idx_user_id_athlete_id", "user_id", "athlete_id"),)
