from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 
from schemas.athlete_schemas import AthleteCreate, AthleteResponse
from models import Athlete, User

async def create_athlete(athlete_info: AthleteCreate, db: AsyncSession, current_user: User) -> AthleteResponse:
    """Create a new athlete in the database

    Returns an athlete object
    """
    try:
        # Check database for existing athlete name
        existing_user = await db.query(Athlete).filter(Athlete.name == athlete_info.name).first()
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
        # Add doesnt occur in the db only commit
        await db.commit()
        await db.refresh(new_athlete)

        return AthleteResponse.model_validate(new_athlete)
    except Exception as err:
        raise HTTPException(status_code=500, detail="Failed to create new athlete")
    
async def get_athletes(db: AsyncSession, current_user: User) -> List[AthleteResponse]:
    """
    Returns all athletes of current user ID
    """
    try:
        # Retreive all athletes whos user_id foreign key === the user id of the requester
        results = await db.execute(select(Athlete).filter(Athlete.user_id == current_user.id))
        athletes = results.scalars().all()
        print(athletes)
        # Validate and return the response
        return [AthleteResponse.model_validate(athlete) for athlete in athletes]
    except Exception:
        raise HTTPException(status_code=500, detail=f"Get all athletes Failed")

async def delete_athlete(id, db: AsyncSession, current_user: User):
    try:
        print("delete Athlete")
    except Exception as err:
        raise HTTPException(status_code=500, detail="Create Athlete Failed")
 