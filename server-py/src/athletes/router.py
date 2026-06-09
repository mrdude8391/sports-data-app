from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from .schemas import (
    AthleteCreate,
    AthleteResponse,
)
from src.athletes import service as athlete_service
from src.auth.dependencies import get_current_user
from src.auth.models import User
from uuid import UUID
from src.database import DbSession

# Athlete Router
# Prefix prefix="/athlete"
router = APIRouter(prefix="/athlete", tags=["Athletes"])


# Athlete Routes
@router.post("/create", response_model=AthleteResponse)
async def create_new_athlete(
    athlete_info: AthleteCreate,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Create a new athlete"""
    return await athlete_service.create_athlete(athlete_info, db, current_user)


@router.get("/", response_model=List[AthleteResponse])
async def get_all_athletes(
    db: DbSession, current_user: User = Depends(get_current_user)
):
    """Get all athletes"""
    return await athlete_service.get_athletes(db, current_user)


@router.delete("/{id}")
async def delete_one_athlete(
    id: UUID,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    """Delete athlete of id provided in path parameter"""
    return await athlete_service.delete_athlete(id, db, current_user)
