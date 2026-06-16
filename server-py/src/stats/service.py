from typing import List
from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.athletes.schemas import (
    AthleteResponse,
    AthleteWithStats,
    StatCreate,
    StatCreateBatch,
    StatResponse,
    StatUpdate,
)
from src.auth.models import User
from src.athletes.models import Athlete
from src.stats.models import Stat
from src.stats import repository as stats_repo
from uuid import UUID
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


async def create_stat(
    athlete_id: UUID, stat_data: StatCreate, db: AsyncSession, current_user: User
) -> StatResponse:
    """Create a new stat entry for an athlete"""
    athlete = await stats_repo.get_valid_athlete_by_id(athlete_id, current_user.id, db)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete doesn't belong to user")
    # Create stat entry
    new_stat = Stat(
        athlete_id=athlete_id,
        user_id=current_user.id,
        stat_data=stat_data,
    )
    stat = await stats_repo.create_new_stat(new_stat, db)
    return StatResponse.model_validate(_convert_stat_to_response(stat))


async def get_athlete_with_stats(
    athlete_id: UUID, db: AsyncSession, current_user: User
) -> AthleteWithStats:
    logger.info("Get_stats() => Get all stats of Athlete Id")
    # Retrieve the Athlete
    athlete = stats_repo.get_valid_athlete_by_id(athlete_id, current_user.id, db)

    # Retrieve the Stats
    result = await db.execute(
        select(Stat)
        .filter(Stat.user_id == current_user.id, Stat.athlete_id == athlete_id)
        .order_by(Stat.recorded_at)
    )
    stats = result.scalars().all()
    # Convert to response format
    athlete_response = AthleteResponse.model_validate(athlete)
    stats_response = [_convert_stat_to_response(stat) for stat in stats]
    return AthleteWithStats(athlete=athlete_response, stats=stats_response)


async def create_stats_batch(
    stats_data: List[StatCreateBatch], db: AsyncSession, current_user: User
) -> dict:
    """Create multiple stat entries at once"""
    try:
        logger.info("create_stats_batch() => Create multiple stats at once")

        stat_objects = []

        for stat_data in stats_data:
            # Verify athlete exists and belongs to user
            result = await db.execute(
                select(Athlete).filter(
                    Athlete.id == stat_data.athleteId,
                    Athlete.user_id == current_user.id,
                )
            )
            athlete_exists = result.scalar_one_or_none()

            if not athlete_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Athlete with id {stat_data.athleteId} not found",
                )

            new_stat = Stat(
                athlete_id=stat_data.athleteId,
                user_id=current_user.id,
                stat_data=stat_data,
            )
            stat_objects.append(new_stat)

        db.add_all(stat_objects)
        await db.flush()

        return {"message": "Successfully added batch"}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to Create batch stats")


async def delete_stat(stat_id: int, db: AsyncSession, current_user: User) -> dict:
    """Delete a stat entry"""
    try:
        logger.info(f"\tdelete_stat() => delete stat by id")
        # Delete
        rows_deleted = await stats_repo.delete_stat_by_id(stat_id, current_user.id, db)

        if rows_deleted == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Stat not found"
            )

        return {"message": "Stat deleted successfully"}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to delete stat")


async def edit_stat(
    stat_id: int,
    stat_data: StatUpdate,
    db: AsyncSession,
    current_user: User,
) -> dict:
    """Update a stat entry"""
    try:
        print("\nLog:\tcreate_stats_batch() => Create multiple stats at once")
        # Get stat and make sure it exists
        result = await db.execute(
            select(Stat).where(Stat.id == stat_id, Stat.user_id == current_user.id)
        )
        stat = result.scalar_one_or_none()

        if not stat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Stat not found"
            )

        # Update labels if provided
        if stat_data.attack:
            stat.attack_kills = stat_data.attack.kills
            stat.attack_errors = stat_data.attack.errors
            stat.attack_total = stat_data.attack.total
            stat.attack_percentage = stat_data.attack.percentage

        if stat_data.setting:
            stat.setting_assists = stat_data.setting.assists
            stat.setting_errors = stat_data.setting.errors
            stat.setting_attempts = stat_data.setting.attempts

        if stat_data.serving:
            stat.serving_rating = stat_data.serving.rating
            stat.serving_rating_total = stat_data.serving.ratingTotal
            stat.serving_aces = stat_data.serving.aces
            stat.serving_errors = stat_data.serving.errors
            stat.serving_attempts = stat_data.serving.attempts
            stat.serving_percentage = stat_data.serving.percentage

        if stat_data.receiving:
            stat.receiving_rating = stat_data.receiving.rating
            stat.receiving_rating_total = stat_data.receiving.ratingTotal
            stat.receiving_errors = stat_data.receiving.errors
            stat.receiving_attempts = stat_data.receiving.attempts

        if stat_data.defense:
            stat.defense_digs = stat_data.defense.digs
            stat.defense_rating = stat_data.defense.rating
            stat.defense_rating_total = stat_data.defense.ratingTotal
            stat.defense_errors = stat_data.defense.errors
            stat.defense_attempts = stat_data.defense.attempts

        if stat_data.blocking:
            stat.blocking_total = stat_data.blocking.total
            stat.blocking_kills = stat_data.blocking.kills
            stat.blocking_solos = stat_data.blocking.solos
            stat.blocking_good_touches = stat_data.blocking.goodTouches
            stat.blocking_attempts = stat_data.blocking.attempts
            stat.blocking_errors = stat_data.blocking.errors

        if stat_data.recordedAt:
            stat.recorded_at = stat_data.recordedAt

        await db.commit()
        await db.refresh(stat)

    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to edit stat")


def _convert_stat_to_response(stat: Stat) -> StatResponse:
    """Helper function to convert Stat model to StatResponse schema"""
    from src.athletes.schemas import (
        AttackStats,
        SettingStats,
        ServingStats,
        ReceivingStats,
        DefenseStats,
        BlockingStats,
    )

    return StatResponse(
        id=stat.id,
        user_id=stat.user_id,
        athlete_id=stat.athlete_id,
        attack=AttackStats(
            kills=stat.attack_kills,
            errors=stat.attack_errors,
            total=stat.attack_total,
            percentage=stat.attack_percentage,
        ),
        setting=SettingStats(
            assists=stat.setting_assists,
            errors=stat.setting_errors,
            attempts=stat.setting_attempts,
        ),
        serving=ServingStats(
            rating=stat.serving_rating,
            ratingTotal=stat.serving_rating_total,
            aces=stat.serving_aces,
            errors=stat.serving_errors,
            attempts=stat.serving_attempts,
            percentage=stat.serving_percentage,
        ),
        receiving=ReceivingStats(
            rating=stat.receiving_rating,
            ratingTotal=stat.receiving_rating_total,
            errors=stat.receiving_errors,
            attempts=stat.receiving_attempts,
        ),
        defense=DefenseStats(
            digs=stat.defense_digs,
            rating=stat.defense_rating,
            ratingTotal=stat.defense_rating_total,
            errors=stat.defense_errors,
            attempts=stat.defense_attempts,
        ),
        blocking=BlockingStats(
            total=stat.blocking_total,
            kills=stat.blocking_kills,
            solos=stat.blocking_solos,
            goodTouches=stat.blocking_good_touches,
            attempts=stat.blocking_attempts,
            errors=stat.blocking_errors,
        ),
        recorded_at=stat.recorded_at,
        created_at=stat.created_at,
        updated_at=stat.updated_at,
    )
