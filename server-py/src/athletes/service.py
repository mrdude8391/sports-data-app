import base64
from datetime import datetime, timezone
from typing import Annotated, List, Optional
from fastapi import HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import (
    AthleteCreate,
    AthleteResponse,
    AthleteListResponse,
    AthleteListResponseCursor,
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


async def get_athletes(
    db: AsyncSession,
    current_user: User,
    limit: int,
    cursor: Optional[str],
) -> AthleteListResponse:
    """Returns all athletes of current user ID"""
    athletes = await athlete_repo.get_athletes_by_user_id(
        current_user.id, db, limit, decode_cursor(cursor) if cursor else cursor
    )
    # Validate
    # athlete_List = [AthleteResponse.model_validate(athlete) for athlete in athletes]
    has_next_page = len(athletes) > limit
    athletes = athletes[:limit]
    next_cursor = None
    if has_next_page:
        last_athlete = athletes[-1]
        next_cursor = encode_cursor(last_athlete.created_at, last_athlete.id)
    response = AthleteListResponse(athlete_list=athletes, next_cursor=next_cursor)
    return AthleteListResponse.model_validate(response)


async def delete_athlete(athlete_id: UUID, db: AsyncSession, current_user: User):
    """Delete an athlete by athleteId"""
    rows_deleted = await athlete_repo.delete_athlete_by_id(
        athlete_id, current_user.id, db
    )
    if rows_deleted == 0:
        raise HTTPException(status_code=404, detail="Not found")


def encode_cursor(
    created_at: datetime,
    athlete_id: UUID,
) -> str:
    cursor_string = base64.urlsafe_b64encode(
        ",".join([created_at.isoformat(), str(athlete_id)]).encode()
    ).decode()
    return cursor_string


def decode_cursor(cursor_string: str) -> AthleteListResponseCursor:
    raw = base64.urlsafe_b64decode(cursor_string.encode()).decode()
    cursor_items = raw.split(",")
    created_at: datetime = datetime.fromisoformat(cursor_items[0])
    id: UUID = UUID(cursor_items[1])
    cursor = AthleteListResponseCursor(created_at=created_at, id=id)
    return AthleteListResponseCursor.model_validate(cursor)
