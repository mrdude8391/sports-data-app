from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session 
from schemas.athlete_schemas import AthleteCreate, AthleteResponse
from models import Athlete, User

def create_athlete(athlete_info: AthleteCreate, db: Session, current_user: User) -> AthleteResponse:
    """Create a new athlete in the database

    Returns an athlete object
    """
    try:
        # Check database for existing athlete name
        existing_user = db.query(Athlete).filter(Athlete.name == athlete_info.name).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Athlete name already exists")
        
        # Create new athlete object
        new_athlete = Athlete(
            user_id=current_user.id,
            name=athlete_info.name,
            age=athlete_info.age,
            height=athlete_info.height
        )
        
        # Insert new athlete
        db.add(new_athlete)
        db.commit()
        db.refresh(new_athlete)

        return AthleteResponse.model_validate(new_athlete)
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Create Athlete Failed")
    
def get_athletes(db: Session, current_user: User) -> List[AthleteResponse]:
    """
    Returns all athletes of current user ID
    """
    try:
        # Check database for existing athlete name
        athletes = db.query(Athlete).filter(Athlete.user_id == current_user.id).all()
        
        return [AthleteResponse.model_validate(athlete) for athlete in athletes]
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Create Athlete Failed")