from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID



class Stat(Base):
    __tablename__ = "stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    athlete_id = Column(UUID(as_uuid=True), ForeignKey("athletes.id"), nullable=False, index=True)
    
    # Attack stats
    attack_kills = Column(Integer, default=0)
    attack_errors = Column(Integer, default=0)
    attack_total = Column(Integer, default=0)
    attack_percentage = Column(Float, default=0.0)
    
    # Setting stats
    setting_assists = Column(Integer, default=0)
    setting_errors = Column(Integer, default=0)
    setting_attempts = Column(Integer, default=0)
    
    # Serving stats
    serving_rating = Column(Float, default=0.0)
    serving_rating_total = Column(Float, default=0.0)
    serving_aces = Column(Integer, default=0)
    serving_errors = Column(Integer, default=0)
    serving_attempts = Column(Integer, default=0)
    serving_percentage = Column(Float, default=0.0)
    
    # Receiving stats
    receiving_rating = Column(Float, default=0.0)
    receiving_rating_total = Column(Float, default=0.0)
    receiving_errors = Column(Integer, default=0)
    receiving_attempts = Column(Integer, default=0)
    
    # Defense stats
    defense_digs = Column(Integer, default=0)
    defense_rating = Column(Float, default=0.0)
    defense_rating_total = Column(Float, default=0.0)
    defense_errors = Column(Integer, default=0)
    defense_attempts = Column(Integer, default=0)
    
    # Blocking stats
    blocking_total = Column(Integer, default=0)
    blocking_kills = Column(Integer, default=0)
    blocking_solos = Column(Integer, default=0)
    blocking_good_touches = Column(Integer, default=0)
    blocking_attempts = Column(Integer, default=0)
    blocking_errors = Column(Integer, default=0)
    
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    athlete = relationship("Athlete", back_populates="stats")
    
    # Index for efficient querying
    __table_args__ = (
        Index('idx_athlete_recorded_at', 'athlete_id', 'recorded_at'),
    )