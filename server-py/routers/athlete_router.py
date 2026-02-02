from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.athlete_schemas import AthleteCreate, AthleteResponse
from controllers.athlete_controller import create_athlete, get_athletes
from dependencies.auth import get_current_user
from models import User

router = APIRouter()

@router.post("/create", response_model=AthleteResponse)
def create(athlete_info: AthleteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new athlete            
    """
    print(athlete_info)
    return create_athlete(athlete_info, db, current_user)

@router.get("/", response_model=List[AthleteResponse])
def get(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all athletes"""
    
    return get_athletes(db, current_user)