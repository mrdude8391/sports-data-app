from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.athlete_schemas import AthleteCreate, AthleteResponse, AthleteWithStats, StatCreate, StatCreateBatch
from controllers.athlete_controller import create_stats_batch, delete_stat, edit_stat, get_stats, create_athlete, get_athletes, delete_athlete, create_stat
from dependencies.auth import get_current_user
from models import User, Stat
from uuid import UUID


# Athlete Router
# Prefix prefix="/athlete"
router = APIRouter()


# Athlete Routes
@router.post("/create", response_model=AthleteResponse)
async def create_new_athlete(athlete_info: AthleteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new athlete"""
    return await create_athlete(athlete_info, db, current_user)

@router.get("/", response_model=List[AthleteResponse])
async def get_all_athletes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all athletes"""
    return await get_athletes(db, current_user)

@router.delete("/{id}")
async def delete_one_athlete(id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete athlete of id provided in path parameter"""
    return await delete_athlete(id, db, current_user)

###############################################################################################

# Athlete Stat Routes
@router.post("/{athlete_id}/stats")
async def create_new_stat(athlete_id: UUID, stat_data: StatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create new stat for athlete"""
    return await create_stat(athlete_id, stat_data, db, current_user)

@router.get("/{athlete_id}/stats", response_model=AthleteWithStats)
async def get_athlete_stats(athlete_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all athlete's stats"""
    return await get_stats(athlete_id, db, current_user)

@router.delete("/{stat_id}/stats")
async def delete_one_stat(stat_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete one stat"""
    return await delete_stat(stat_id, db, current_user)

@router.patch("/{stat_id}/stats")
async def edit_one_stat(stat_id: UUID, stat_data: StatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Edit one stat"""
    return await edit_stat(stat_id, stat_data, db, current_user)

@router.post("/stats")
async def create_many_stats(stats_data: List[StatCreateBatch], db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create stat row for multiple athletes"""
    return await create_stats_batch(stats_data, db, current_user)
