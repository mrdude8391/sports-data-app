from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import EmailStr
from models import User


class UserRepository:

    async def get_by_email(db: AsyncSession, email: EmailStr) -> User | None:
        results = await db.execute(select(User).filter(User.email == email))
        return results.scalars().first()

    async def create_user(db: AsyncSession, new_user: User) -> User:
        async with db.begin():
            # Insert new User into database
            db.add(new_user)
        # await db.commit()
        # await db.refresh(new_user)

        #     with db.begin():
        # # Insert new User into database
        # db.add(new_user)
