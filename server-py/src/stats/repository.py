from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from ..stats.models import Stat
from ..athletes.models import Athlete


async def create_new_stat(new_stat: Stat, db: AsyncSession) -> Stat:
    db.add(new_stat)
    await db.flush()
    await db.refresh(new_stat)
    return new_stat


async def get_valid_athlete_by_id(
    athlete_id: UUID, user_id: UUID, db: AsyncSession
) -> Athlete:
    # Verify Athlete belongs to current user
    result = await db.execute(
        select(Athlete).where(Athlete.id == athlete_id, Athlete.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def delete_stat_by_id(stat_id: UUID, current_user_id: UUID, db: AsyncSession):
    # Delete
    result = await db.execute(
        delete(Stat).where(Stat.id == stat_id, Stat.user_id == current_user_id)
    )
    return result.rowcount
