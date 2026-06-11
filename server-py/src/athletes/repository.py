from typing import List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..athletes.models import Athlete


async def get_athletes_by_user_id(userId: uuid.UUID, db: AsyncSession) -> List[Athlete]:
    results = await db.execute(select(Athlete).where(Athlete.user_id == userId))
    return results.scalars().all()


async def create_new_athlete(new_athlete: Athlete, db: AsyncSession) -> Athlete:
    db.add(new_athlete)
    await db.flush()
    await db.refresh(new_athlete)
    return new_athlete
