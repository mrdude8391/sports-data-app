from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth.schemas import LoginPayload, RegisterPayload, UserWithToken
from src.auth import controller as auth_controller

# Auth Router
# Prefix prefix="/auth"
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserWithToken)
async def register(user_data: RegisterPayload, db: Session = Depends(get_db)):
    """Register a new user

    Returns a UserWithToken Schema. Allowing client to store token
    """
    return await auth_controller.register_user(user_data, db)


@router.post("/login", response_model=UserWithToken)
async def login(login_payload: LoginPayload, db: Session = Depends(get_db)):
    """Login with provided credentials

    Returns a UserWithToken Schema. Allowing client to store token
    """
    return await auth_controller.login_user(login_payload, db)
