from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.athletes.schemas import (
    AthleteWithStats,
    StatCreate,
    StatCreateBatch,
)
from src.stats import service as stats_service
from src.auth.dependencies import get_current_user
from src.auth.models import User
from uuid import UUID
from src.database import DbSession

# Stat Router
# Prefix prefix="/stat"
router = APIRouter(prefix="/stats", tags=["Stats"])


# Athlete Stat Routes
@router.post("/{athlete_id}")
async def create_new_stat(
    athlete_id: UUID,
    stat_data: StatCreate,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Create new stat for athlete"""
    return await stats_service.create_stat(athlete_id, stat_data, db, current_user)


@router.get("/{athlete_id}", response_model=AthleteWithStats)
async def get_athlete_stats(
    athlete_id: UUID,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Get all athlete's stats"""
    return await stats_service.get_stats(athlete_id, db, current_user)


@router.delete("/{stat_id}")
async def delete_one_stat(
    stat_id: UUID,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Delete one stat"""
    return await stats_service.delete_stat(stat_id, db, current_user)


@router.patch("/{stat_id}")
async def edit_one_stat(
    stat_id: UUID,
    stat_data: StatCreate,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Edit one stat"""
    return await stats_service.edit_stat(stat_id, stat_data, db, current_user)


@router.post("/")
async def create_many_stats(
    stats_data: List[StatCreateBatch],
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Create stat row for multiple athletes"""
    return await stats_service.create_stats_batch(stats_data, db, current_user)
