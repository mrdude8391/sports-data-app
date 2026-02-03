from typing import List
from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession 
from schemas.athlete_schemas import AthleteCreate, AthleteResponse, AthleteWithStats, StatCreate, StatCreateBatch, StatResponse, StatUpdate
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
        # Add doesnt occur in the db only commit so we await the below operations
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
    """Deletes an athlete"""
    try:
        print("\nLog:\tdelete_athlete() => Delete athlete with ID provided from path parameter")
        # Delete the object
        result = await db.execute(delete(Athlete).where(
            Athlete.id == id, 
            Athlete.user_id == current_user.id
            ))
        # Commit to database
        await db.commit()
        # Observe the result
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Not found")
            
        return {"message": "Successfully deleted athlete"}
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Delete Athlete Failed")
 
async def create_stat(athlete_id:UUID, stat_data: StatCreate, db: AsyncSession, current_user: User) -> StatResponse:
    """Create a new stat entry for an athlete"""
    try:
        print("\nLog:\tcreate_stat() => Create new Stat for athlete ID provided from path parameter, and stat body passed in request body.")
        # Verify athlete exists and belongs to user
        result = await db.execute(select(Athlete).filter(
            Athlete.id == athlete_id,
            Athlete.user_id == current_user.id
        ))
        athlete_exists = result.scalar_one_or_none()
    
        if not athlete_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Athlete not found"
            )
        print("recorded at", stat_data.recordedAt)
        # Create stat entry
        new_stat = Stat(
            user_id=current_user.id,
            athlete_id=athlete_id,
            # Attack stats
            attack_kills=stat_data.attack.kills if stat_data.attack else 0,
            attack_errors=stat_data.attack.errors if stat_data.attack else 0,
            attack_total=stat_data.attack.total if stat_data.attack else 0,
            attack_percentage=stat_data.attack.percentage if stat_data.attack else 0.0,
            # Setting stats
            setting_assists=stat_data.setting.assists if stat_data.setting else 0,
            setting_errors=stat_data.setting.errors if stat_data.setting else 0,
            setting_attempts=stat_data.setting.attempts if stat_data.setting else 0,
            # Serving stats
            serving_rating=stat_data.serving.rating if stat_data.serving else 0.0,
            serving_rating_total=stat_data.serving.ratingTotal if stat_data.serving else 0.0,
            serving_aces=stat_data.serving.aces if stat_data.serving else 0,
            serving_errors=stat_data.serving.errors if stat_data.serving else 0,
            serving_attempts=stat_data.serving.attempts if stat_data.serving else 0,
            serving_percentage=stat_data.serving.percentage if stat_data.serving else 0.0,
            # Receiving stats
            receiving_rating=stat_data.receiving.rating if stat_data.receiving else 0.0,
            receiving_rating_total=stat_data.receiving.ratingTotal if stat_data.receiving else 0.0,
            receiving_errors=stat_data.receiving.errors if stat_data.receiving else 0,
            receiving_attempts=stat_data.receiving.attempts if stat_data.receiving else 0,
            # Defense stats
            defense_digs=stat_data.defense.digs if stat_data.defense else 0,
            defense_rating=stat_data.defense.rating if stat_data.defense else 0.0,
            defense_rating_total=stat_data.defense.ratingTotal if stat_data.defense else 0.0,
            defense_errors=stat_data.defense.errors if stat_data.defense else 0,
            defense_attempts=stat_data.defense.attempts if stat_data.defense else 0,
            # Blocking stats
            blocking_total=stat_data.blocking.total if stat_data.blocking else 0,
            blocking_kills=stat_data.blocking.kills if stat_data.blocking else 0,
            blocking_solos=stat_data.blocking.solos if stat_data.blocking else 0,
            blocking_good_touches=stat_data.blocking.goodTouches if stat_data.blocking else 0,
            blocking_attempts=stat_data.blocking.attempts if stat_data.blocking else 0,
            blocking_errors=stat_data.blocking.errors if stat_data.blocking else 0,
            # Recorded at
            recorded_at=stat_data.recordedAt if stat_data.recordedAt else None
        )

        # insert new stat
        db.add(new_stat)
        await db.commit()
        await db.refresh(new_stat)

        return _convert_stat_to_response(new_stat)
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to create stat")

async def get_stats(athlete_id:UUID, db: AsyncSession, current_user: User) -> AthleteWithStats:
    try:
        print("\nLog:\tGet_stats() => Get all stats of Athlete Id")
        # Retrieve the Athlete
        result = await db.execute(select(Athlete).filter(Athlete.id == athlete_id))
        athlete = result.scalar_one_or_none()

        # Retrieve the Stats
        result = await db.execute(select(Stat).filter(
            Stat.user_id == current_user.id,
            Stat.athlete_id == athlete_id
        ))
        stats = result.scalars().all()

        # Convert to response format
        athlete_response = AthleteResponse.model_validate(athlete)
        stats_response = [_convert_stat_to_response(stat) for stat in stats]
    
        return AthleteWithStats(athlete=athlete_response, stats=stats_response)
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to get all stats")

async def create_stats_batch(stats_data: List[StatCreateBatch],  db: AsyncSession, current_user: User) -> dict:
    """Create multiple stat entries at once"""
    try:
        print("\nLog:\tcreate_stats_batch() => Create multiple stats at once")

        stat_objects = []

        for stat_data in stats_data:
            # Verify athlete exists and belongs to user
            result = await db.execute(select(Athlete).filter(
                Athlete.id == stat_data.athleteId,
                Athlete.user_id == current_user.id
            ))
            athlete_exists = result.scalar_one_or_none()

            if not athlete_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Athlete with id {stat_data.athleteId} not found"
                )

            new_stat = Stat(
                user_id=current_user.id,
                athlete_id=stat_data.athleteId,
                # Attack stats
                attack_kills=stat_data.attack.kills if stat_data.attack else 0,
                attack_errors=stat_data.attack.errors if stat_data.attack else 0,
                attack_total=stat_data.attack.total if stat_data.attack else 0,
                attack_percentage=stat_data.attack.percentage if stat_data.attack else 0.0,
                # Setting stats
                setting_assists=stat_data.setting.assists if stat_data.setting else 0,
                setting_errors=stat_data.setting.errors if stat_data.setting else 0,
                setting_attempts=stat_data.setting.attempts if stat_data.setting else 0,
                # Serving stats
                serving_rating=stat_data.serving.rating if stat_data.serving else 0.0,
                serving_rating_total=stat_data.serving.ratingTotal if stat_data.serving else 0.0,
                serving_aces=stat_data.serving.aces if stat_data.serving else 0,
                serving_errors=stat_data.serving.errors if stat_data.serving else 0,
                serving_attempts=stat_data.serving.attempts if stat_data.serving else 0,
                serving_percentage=stat_data.serving.percentage if stat_data.serving else 0.0,
                # Receiving stats
                receiving_rating=stat_data.receiving.rating if stat_data.receiving else 0.0,
                receiving_rating_total=stat_data.receiving.ratingTotal if stat_data.receiving else 0.0,
                receiving_errors=stat_data.receiving.errors if stat_data.receiving else 0,
                receiving_attempts=stat_data.receiving.attempts if stat_data.receiving else 0,
                # Defense stats
                defense_digs=stat_data.defense.digs if stat_data.defense else 0,
                defense_rating=stat_data.defense.rating if stat_data.defense else 0.0,
                defense_rating_total=stat_data.defense.ratingTotal if stat_data.defense else 0.0,
                defense_errors=stat_data.defense.errors if stat_data.defense else 0,
                defense_attempts=stat_data.defense.attempts if stat_data.defense else 0,
                # Blocking stats
                blocking_total=stat_data.blocking.total if stat_data.blocking else 0,
                blocking_kills=stat_data.blocking.kills if stat_data.blocking else 0,
                blocking_solos=stat_data.blocking.solos if stat_data.blocking else 0,
                blocking_good_touches=stat_data.blocking.goodTouches if stat_data.blocking else 0,
                blocking_attempts=stat_data.blocking.attempts if stat_data.blocking else 0,
                blocking_errors=stat_data.blocking.errors if stat_data.blocking else 0,
                # Recorded at
                recorded_at=stat_data.recordedAt if stat_data.recordedAt else None
            )
            stat_objects.append(new_stat)

        db.add_all(stat_objects)
        await db.commit()

        return {"message": "Successfully added batch"}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to Create batch stats")


async def delete_stat(stat_id: int, db: AsyncSession, current_user: User) -> dict:
    """Delete a stat entry"""
    try:
        print("\nLog:\tcreate_stats_batch() => Create multiple stats at once")
        # Delete
        result = await db.execute(delete(Stat).where(
            Stat.id == stat_id,
            Stat.user_id == current_user.id
        ))
        await db.commit()

        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stat not found"
            )
        
        return {"message": "Stat deleted successfully"}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to delete stat")


async def edit_stat(stat_id: int, stat_data: StatUpdate, db: AsyncSession, current_user: User,) -> dict:
    """Update a stat entry"""
    try:
        print("\nLog:\tcreate_stats_batch() => Create multiple stats at once")
        # Get stat and make sure it exists
        result = await db.execute(select(Stat).where(
            Stat.id == stat_id,
            Stat.user_id == current_user.id
        ))
        stat = result.scalar_one_or_none()

        if not stat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stat not found"
            )

        # Update fields if provided
        if stat_data.attack:
            stat.attack_kills = stat_data.attack.kills
            stat.attack_errors = stat_data.attack.errors
            stat.attack_total = stat_data.attack.total
            stat.attack_percentage = stat_data.attack.percentage

        if stat_data.setting:
            stat.setting_assists = stat_data.setting.assists
            stat.setting_errors = stat_data.setting.errors
            stat.setting_attempts = stat_data.setting.attempts

        if stat_data.serving:
            stat.serving_rating = stat_data.serving.rating
            stat.serving_rating_total = stat_data.serving.ratingTotal
            stat.serving_aces = stat_data.serving.aces
            stat.serving_errors = stat_data.serving.errors
            stat.serving_attempts = stat_data.serving.attempts
            stat.serving_percentage = stat_data.serving.percentage

        if stat_data.receiving:
            stat.receiving_rating = stat_data.receiving.rating
            stat.receiving_rating_total = stat_data.receiving.ratingTotal
            stat.receiving_errors = stat_data.receiving.errors
            stat.receiving_attempts = stat_data.receiving.attempts

        if stat_data.defense:
            stat.defense_digs = stat_data.defense.digs
            stat.defense_rating = stat_data.defense.rating
            stat.defense_rating_total = stat_data.defense.ratingTotal
            stat.defense_errors = stat_data.defense.errors
            stat.defense_attempts = stat_data.defense.attempts

        if stat_data.blocking:
            stat.blocking_total = stat_data.blocking.total
            stat.blocking_kills = stat_data.blocking.kills
            stat.blocking_solos = stat_data.blocking.solos
            stat.blocking_good_touches = stat_data.blocking.goodTouches
            stat.blocking_attempts = stat_data.blocking.attempts
            stat.blocking_errors = stat_data.blocking.errors

        if stat_data.recordedAt:
            stat.recorded_at = stat_data.recordedAt

        await db.commit()
        await db.refresh(stat)

        return {"message": "Successfully edited stat"}
    except ValueError as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to edit stat")
 


def _convert_stat_to_response(stat: Stat) -> StatResponse:
    """Helper function to convert Stat model to StatResponse schema"""
    from schemas.athlete_schemas import (
        AttackStats, SettingStats, ServingStats, 
        ReceivingStats, DefenseStats, BlockingStats
    )
    
    return StatResponse(
        id=stat.id,
        user_id=stat.user_id,
        athlete_id=stat.athlete_id,
        attack=AttackStats(
            kills=stat.attack_kills,
            errors=stat.attack_errors,
            total=stat.attack_total,
            percentage=stat.attack_percentage
        ),
        setting=SettingStats(
            assists=stat.setting_assists,
            errors=stat.setting_errors,
            attempts=stat.setting_attempts
        ),
        serving=ServingStats(
            rating=stat.serving_rating,
            ratingTotal=stat.serving_rating_total,
            aces=stat.serving_aces,
            errors=stat.serving_errors,
            attempts=stat.serving_attempts,
            percentage=stat.serving_percentage
        ),
        receiving=ReceivingStats(
            rating=stat.receiving_rating,
            ratingTotal=stat.receiving_rating_total,
            errors=stat.receiving_errors,
            attempts=stat.receiving_attempts
        ),
        defense=DefenseStats(
            digs=stat.defense_digs,
            rating=stat.defense_rating,
            ratingTotal=stat.defense_rating_total,
            errors=stat.defense_errors,
            attempts=stat.defense_attempts
        ),
        blocking=BlockingStats(
            total=stat.blocking_total,
            kills=stat.blocking_kills,
            solos=stat.blocking_solos,
            goodTouches=stat.blocking_good_touches,
            attempts=stat.blocking_attempts,
            errors=stat.blocking_errors
        ),
        recorded_at=stat.recorded_at,
        created_at=stat.created_at,
        updated_at=stat.updated_at
    )