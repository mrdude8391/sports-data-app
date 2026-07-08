from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, or_, and_, select
from ..athletes.models import Athlete
from .schemas import (
    AthleteListResponseCursor,
)


async def create_new_athlete(new_athlete: Athlete, db: AsyncSession) -> Athlete:
    db.add(new_athlete)
    await db.flush()
    await db.refresh(new_athlete)
    return new_athlete


async def get_athletes_by_user_id(
    userId: UUID,
    db: AsyncSession,
    limit: int,
    cursor: Optional[AthleteListResponseCursor],
) -> List[Athlete]:

    if not cursor:
        print("blank cursor")
        results = await db.execute(
            select(Athlete)
            .where(Athlete.user_id == userId)
            .order_by(
                Athlete.created_at.desc(),
                Athlete.id.desc(),
            )
            .limit(limit + 1)
        )
        return results.scalars().all()
    else:
        print("Given cursor: ", cursor)
        print("cursor date: ", cursor.created_at)
        results = await db.execute(
            select(Athlete)
            .where(
                Athlete.user_id == userId,
                or_(
                    Athlete.created_at < cursor.created_at,
                    and_(
                        Athlete.created_at == cursor.created_at,
                        Athlete.id < cursor.id,
                    ),
                ),
            )
            .order_by(
                Athlete.created_at.desc(),
                Athlete.id.desc(),
            )
            .limit(limit + 1)
        )
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
