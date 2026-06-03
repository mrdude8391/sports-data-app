from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.athlete_schemas import (
    AthleteCreate,
    AthleteResponse,
)
from controllers.athlete_controller import (
    create_athlete,
    get_athletes,
    delete_athlete,
)
from dependencies.auth import get_current_user
from models import User, Stat
from uuid import UUID

# Athlete Router
# Prefix prefix="/athlete"
router = APIRouter(prefix="/athlete", tags=["Athletes"])


# Athlete Routes
@router.post("/create", response_model=AthleteResponse)
async def create_new_athlete(
    athlete_info: AthleteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new athlete"""
    return await create_athlete(athlete_info, db, current_user)


@router.get("/", response_model=List[AthleteResponse])
async def get_all_athletes(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all athletes"""
    return await get_athletes(db, current_user)


@router.delete("/{id}")
async def delete_one_athlete(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete athlete of id provided in path parameter"""
    return await delete_athlete(id, db, current_user)


###############################################################################################
