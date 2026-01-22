from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginPayload(BaseModel):
    email: EmailStr
    password:str

class Register(BaseModel):
    username: str
    email: EmailStr
    password:str

class RegisterResponse(BaseModel):
    username: str
    email: EmailStr
    token:str

class UserWithToken(UserResponse):
    token: str

