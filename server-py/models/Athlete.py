from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Athlete(Base):
    __tablename__ = "athletes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    stats = relationship("Stat", back_populates="athlete", cascade="all, delete-orphan")
    
    # Compound unique index: prevents duplicate athlete names per user
    __table_args__ = (
        Index('idx_user_athlete_name', 'user_id', 'name', unique=True),
    ) 