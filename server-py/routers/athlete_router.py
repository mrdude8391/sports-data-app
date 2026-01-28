from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.athlete_schemas import AthleteCreate, AthleteResponse
from controllers.athlete_controller import create_athlete
from dependencies.auth import protect

router = APIRouter(dependencies=[Depends(protect)])

@router.post("/create", response_model=AthleteResponse)
def create(athlete_info: AthleteCreate, db: Session = Depends(get_db)):
    """Create a new athlete            
    """
    print(athlete_info)
    return create_athlete()

