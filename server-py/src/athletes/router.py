from datetime import datetime
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends
from fastapi import Query
from sqlalchemy.orm import Session
from src.database import get_db
from .schemas import AthleteCreate, AthleteResponse, AthleteListResponse
from src.athletes import service as athlete_service
from src.auth.dependencies import ValidUser
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
    current_user: ValidUser,
):
    """Create a new athlete"""
    return await athlete_service.create_athlete(athlete_info, db, current_user)


@router.get("/", response_model=AthleteListResponse)
async def get_all_athletes(
    db: DbSession,
    current_user: ValidUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    cursor: Annotated[str | None, Query()] = None,
):
    """Get all athletes"""
    return await athlete_service.get_athletes(db, current_user, limit, cursor)


@router.delete("/{id}")
async def delete_one_athlete(
    id: UUID,
    db: DbSession,
    current_user: ValidUser,
):
    """Delete athlete of id provided in path parameter"""
    return await athlete_service.delete_athlete(id, db, current_user)
