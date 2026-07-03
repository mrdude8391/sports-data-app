import uuid
from pydantic import BaseModel, EmailStr, ConfigDict


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class RegisterPayload(UserBase):
    password: str


class UserResponse(UserBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class UserWithToken(UserResponse):
    token: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str
