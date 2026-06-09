from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import EmailStr
from .models import User


async def get_by_email(email: EmailStr, db: AsyncSession) -> User | None:
    results = await db.execute(select(User).where(User.email == email))
    return results.scalar_one_or_none()


async def create_user(new_user: User, db: AsyncSession) -> User:
    async with db.begin():
        # Insert new User into database
        db.add(new_user)
    # await db.commit()
    # await db.refresh(new_user)
    #     with db.begin():
    # # Insert new User into database
    # db.add(new_user)
