from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class RegisterPayload(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserWithToken(UserResponse):
    token: str

class LoginPayload(BaseModel):
    email: EmailStr
    password:str