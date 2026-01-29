import uuid
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Athlete Schemas
class AthleteBase(BaseModel):
    name: str
    age: int = Field(gt=0, description="Age must be greater than 0")
    height: int = Field(gt=0, description="Height must be greater than 0")


class AthleteCreate(AthleteBase):
    pass


class AthleteResponse(AthleteBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Nested stat structures
class AttackStats(BaseModel):
    kills: int = 0
    errors: int = 0
    total: int = 0
    percentage: float = 0.0


class SettingStats(BaseModel):
    assists: int = 0
    errors: int = 0
    attempts: int = 0


class ServingStats(BaseModel):
    rating: float = 0.0
    ratingTotal: float = 0.0
    aces: int = 0
    errors: int = 0
    attempts: int = 0
    percentage: float = 0.0


class ReceivingStats(BaseModel):
    rating: float = 0.0
    ratingTotal: float = 0.0
    errors: int = 0
    attempts: int = 0


class DefenseStats(BaseModel):
    digs: int = 0
    rating: float = 0.0
    ratingTotal: float = 0.0
    errors: int = 0
    attempts: int = 0


class BlockingStats(BaseModel):
    total: int = 0
    kills: int = 0
    solos: int = 0
    goodTouches: int = 0
    attempts: int = 0
    errors: int = 0


# Stat Schemas
class StatBase(BaseModel):
    attack: Optional[AttackStats] = AttackStats()
    setting: Optional[SettingStats] = SettingStats()
    serving: Optional[ServingStats] = ServingStats()
    receiving: Optional[ReceivingStats] = ReceivingStats()
    defense: Optional[DefenseStats] = DefenseStats()
    blocking: Optional[BlockingStats] = BlockingStats()
    recordedAt: Optional[datetime] = None


class StatCreate(StatBase):
    pass


class StatCreateBatch(BaseModel):
    athleteId: uuid.UUID
    attack: Optional[AttackStats] = AttackStats()
    setting: Optional[SettingStats] = SettingStats()
    serving: Optional[ServingStats] = ServingStats()
    receiving: Optional[ReceivingStats] = ReceivingStats()
    defense: Optional[DefenseStats] = DefenseStats()
    blocking: Optional[BlockingStats] = BlockingStats()
    recordedAt: Optional[datetime] = None


class StatResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    athlete_id: uuid.UUID
    attack: AttackStats
    setting: SettingStats
    serving: ServingStats
    receiving: ReceivingStats
    defense: DefenseStats
    blocking: BlockingStats
    recorded_at: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class StatUpdate(BaseModel):
    attack: Optional[AttackStats] = None
    setting: Optional[SettingStats] = None
    serving: Optional[ServingStats] = None
    receiving: Optional[ReceivingStats] = None
    defense: Optional[DefenseStats] = None
    blocking: Optional[BlockingStats] = None
    recordedAt: Optional[datetime] = None


class AthleteWithStats(BaseModel):
    athlete: AthleteResponse
    stats: List[StatResponse]
    
    class Config:
        from_attributes = True