from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 
from schemas.athlete_schemas import AthleteCreate, AthleteResponse, AthleteWithStats, StatCreate, StatResponse
from models import Athlete, User, Stat
from uuid import UUID


async def create_athlete(athlete_info: AthleteCreate, db: AsyncSession, current_user: User) -> AthleteResponse:
    """Create a new athlete in the database"""
    try:
        print("\nLog:\tcreate_athlete() => Create new athlete")
        # Check database for existing athlete name
        results = await db.execute(select(Athlete).filter(Athlete.name == athlete_info.name))
        existing_user = results.scalars().first()
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
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Failed to create new athlete")
    
async def get_athletes(db: AsyncSession, current_user: User) -> List[AthleteResponse]:
    """Returns all athletes of current user ID"""
    try:
        print("\nLog:\tget_athletes() => Get all athletes with user ID foreign key")
        # Retreive all athletes whos user_id foreign key === the user id of the requester
        results = await db.execute(select(Athlete).filter(Athlete.user_id == current_user.id))
        athletes = results.scalars().all()
        # Validate and return the response
        return [AthleteResponse.model_validate(athlete) for athlete in athletes]
    except ValueError:
        raise HTTPException(status_code=500, detail=f"Get all athletes Failed")

async def delete_athlete(id:UUID, db: AsyncSession, current_user: User):
    try:
        print("\nLog:\tdelete_athlete() => Delete athlete with ID provided from path parameter")
        # Retrieve the object
        result = await db.execute(select(Athlete).where(Athlete.id == id))
        athlete_to_delete = result.scalar_one_or_none()

        if athlete_to_delete:
            await db.delete(athlete_to_delete)
            await db.commit()
        
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Delete Athlete Failed")
 
async def create_stat(id:UUID, stat: StatCreate, db: AsyncSession, current_user: User):
    try:
        print("\nLog:\tcreate_stat() => Create new Stat for athlete ID provided from path parameter, and stat body passed in request body.")

    except ValueError as err:
        raise HTTPException(status_code=500, detail="Failed to create new stat")

async def get_stats(id:UUID, db: AsyncSession, current_user: User) -> AthleteWithStats:
    try:
        print("\nLog:\tGet_stats() => Get all stats of Athlete Id")
        # Retrieve the Athlete
        result = await db.execute(select(Athlete).where(Athlete.id == id))
        athlete = result.scalar_one_or_none()

        # Retrieve the Stats
        result = await db.execute(select(Stat).where(Stat.athlete_id == id))
        stats = result.all()

        return {"athlete" : athlete ,
                "stats": stats}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to get all stats")
