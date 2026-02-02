import uuid
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base



class User(Base):
    __tablename__ = "users"
    
    # # Columns in databse
    # id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    # username = Column(String, nullable=False)
    # email = Column(String, unique=True, nullable=False, index=True)
    # password = Column(String, nullable=False)
    # created_at = Column(DateTime(timezone=True), server_default=func.now())
    # updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Columns in databse
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4 )
    username: Mapped[str]= mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    password: Mapped[str]= mapped_column(nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

    # Relationships for ORM
    # The relationship is only able to be seen when developing with the ORM, it doesn't do anything on the database side. That is handeld by the ForeignKey.
    athletes = relationship("Athlete", back_populates="user")
    # ORM will allow you to access related objects as if they were standard Python attributes