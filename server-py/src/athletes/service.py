from typing import List
from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import (
    AthleteCreate,
    AthleteResponse,
)
from .models import Athlete
from src.auth.models import User
from src.stats.models import Stat
from uuid import UUID
from src.athletes import repository as athlete_repo


async def create_athlete(
    athlete_info: AthleteCreate, db: AsyncSession, current_user: User
) -> AthleteResponse:
    """Create a new athlete in the database"""
    # Create new athlete object
    new_athlete = Athlete(
        user_id=current_user.id,
        name=athlete_info.name,
        age=athlete_info.age,
        height=athlete_info.height,
    )
    athlete = await athlete_repo.create_new_athlete(new_athlete, db)

    return AthleteResponse.model_validate(athlete)


async def get_athletes(db: AsyncSession, current_user: User) -> List[AthleteResponse]:
    """Returns all athletes of current user ID"""
    athletes = await athlete_repo.get_athletes_by_user_id(current_user.id, db)
    # Validate and return the response
    return [AthleteResponse.model_validate(athlete) for athlete in athletes]


async def delete_athlete(athlete_id: UUID, db: AsyncSession, current_user: User):
    """Delete an athlete by athleteId"""
    rows_deleted = await athlete_repo.delete_athlete_by_id(
        athlete_id, current_user.id, db
    )
    if rows_deleted == 0:
        raise HTTPException(status_code=404, detail="Not found")
