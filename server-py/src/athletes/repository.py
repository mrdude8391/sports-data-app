from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from ..athletes.models import Athlete


async def create_new_athlete(new_athlete: Athlete, db: AsyncSession) -> Athlete:
    db.add(new_athlete)
    await db.flush()
    await db.refresh(new_athlete)
    return new_athlete


async def get_athletes_by_user_id(userId: UUID, db: AsyncSession) -> List[Athlete]:
    results = await db.execute(select(Athlete).where(Athlete.user_id == userId))
    return results.scalars().all()


async def get_valid_athlete_by_id(
    athlete_id: UUID, user_id: UUID, db: AsyncSession
) -> Athlete:
    # Verify Athlete belongs to current user
    result = await db.execute(
        select(Athlete).where(Athlete.id == athlete_id, Athlete.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def delete_athlete_by_id(
    athlete_id: UUID, user_id: UUID, db: AsyncSession
) -> int:
    """
    Delete athlete by athleteId and userId.
    Orphaned stats rows are deleted by database configured by foreign key constraints in orm model.

    Returns number of rows deleted
    """
    # Delete the object
    result = await db.execute(
        delete(Athlete).where(Athlete.id == athlete_id, Athlete.user_id == user_id)
    )
    return result.rowcount
