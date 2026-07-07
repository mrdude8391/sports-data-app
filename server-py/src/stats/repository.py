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


async def get_all_stats_by_athlete_id(
    athlete_id: UUID, current_user_id: UUID, db: AsyncSession
) -> List[Stat]:
    # Retrieve the Stats
    result = await db.execute(
        select(Stat)
        .filter(Stat.user_id == current_user_id, Stat.athlete_id == athlete_id)
        .order_by(Stat.recorded_at)
    )
    return result.scalars().all()


async def get_stat_by_id(stat_id: UUID, current_user_id: UUID, db: AsyncSession):
    # Get stat and make sure it exists
    result = await db.execute(
        select(Stat).where(Stat.id == stat_id, Stat.user_id == current_user_id)
    )
    return result.scalar_one_or_none()


async def delete_stat_by_id(
    stat_id: UUID, current_user_id: UUID, db: AsyncSession
) -> int:
    # Delete
    result = await db.execute(
        delete(Stat).where(Stat.id == stat_id, Stat.user_id == current_user_id)
    )
    return result.rowcount


async def insert_list_of_stats(stat_objects: List[Stat], db: AsyncSession):
    db.add_all(stat_objects)
    await db.flush()
    ### cant refresh a list
    # await db.refresh(stat_objects)
    # return stat_objects
