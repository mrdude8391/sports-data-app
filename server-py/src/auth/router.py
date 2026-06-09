from fastapi import APIRouter
from src.database import DbSession
from src.auth.schemas import LoginPayload, RegisterPayload, UserWithToken
from src.auth import service as auth_service

# Auth Router
# Prefix prefix="/auth"
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserWithToken)
async def register(user_data: RegisterPayload, db: DbSession):
    """Register a new user

    Returns a UserWithToken Schema. Allowing client to store token
    """
    return await auth_service.register_user(user_data, db)


@router.post("/login", response_model=UserWithToken)
async def login(login_payload: LoginPayload, db: DbSession):
    """Login with provided credentials

    Returns a UserWithToken Schema. Allowing client to store token
    """
    return await auth_service.login_user(login_payload, db)
