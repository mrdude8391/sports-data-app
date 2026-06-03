from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.athlete_schemas import (
    AthleteWithStats,
    StatCreate,
    StatCreateBatch,
)
from controllers.stat_controller import (
    create_stats_batch,
    delete_stat,
    edit_stat,
    get_stats,
    create_stat,
)
from dependencies.auth import get_current_user
from models import User, Stat
from uuid import UUID

# Stat Router
# Prefix prefix="/stat"
router = APIRouter(prefix="/stats", tags=["Stats"])


# Athlete Stat Routes
@router.post("/{athlete_id}")
async def create_new_stat(
    athlete_id: UUID,
    stat_data: StatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create new stat for athlete"""
    return await create_stat(athlete_id, stat_data, db, current_user)


@router.get("/{athlete_id}", response_model=AthleteWithStats)
async def get_athlete_stats(
    athlete_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all athlete's stats"""
    return await get_stats(athlete_id, db, current_user)


@router.delete("/{stat_id}")
async def delete_one_stat(
    stat_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete one stat"""
    return await delete_stat(stat_id, db, current_user)


@router.patch("/{stat_id}")
async def edit_one_stat(
    stat_id: UUID,
    stat_data: StatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Edit one stat"""
    return await edit_stat(stat_id, stat_data, db, current_user)


@router.post("/")
async def create_many_stats(
    stats_data: List[StatCreateBatch],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create stat row for multiple athletes"""
    return await create_stats_batch(stats_data, db, current_user)
