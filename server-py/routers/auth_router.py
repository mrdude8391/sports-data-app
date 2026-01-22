from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth_schemas import LoginPayload, Register, RegisterResponse, UserWithToken
from controllers.auth_controller import register_user

router = APIRouter()

@router.post("/register", response_model=UserWithToken)
def register(user_data: Register, db: Session = Depends(get_db)):
    """Register a new user"""
    return register_user(user_data, db)

