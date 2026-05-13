from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import EmailStr
from models import User

class UserRepository:

        async def get_by_email(db: AsyncSession, email: EmailStr) -> User | None:
                results = await db.execute(select(User).filter(User.email == email))
                return results.scalars().first()