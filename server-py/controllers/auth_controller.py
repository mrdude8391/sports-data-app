from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from schemas.auth_schemas import RegisterPayload, UserWithToken, LoginPayload
from pwdlib import PasswordHash
import jwt
from dotenv import load_dotenv
import os
import logging
from repositories.user_repository import UserRepository
from exceptions.errors import DuplicateUserError, InvalidCredentialsError
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

load_dotenv()

password_hash = PasswordHash.recommended()
TOKEN_EXPIRE_TIME = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def verify_password(plain_password, hashed_password):
    """
    Verifies if provided password matches a given hash.
    """
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hashes a password using the current hash"""
    return password_hash.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Returns an encoded JWT

    data: Requires a dict / object{}
    expires_delta: a timedelta object
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_TIME)
        # expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_TIME)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, os.getenv("JWT_SECRET"), algorithm=os.getenv("ALGORITHM")
    )
    return encoded_jwt


async def register_user(user_data: RegisterPayload, db: AsyncSession) -> UserWithToken:
    """
    Create a new user row using provided information in the database
    """
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
    )

    try:
        await UserRepository.create_user(db, new_user)
    except IntegrityError:
        raise DuplicateUserError

    # Generate token
    access_token_expires = timedelta(hours=TOKEN_EXPIRE_TIME)
    token = create_access_token({"id": str(new_user.id)}, access_token_expires)

    return UserWithToken(
        id=new_user.id, username=new_user.username, email=new_user.email, token=token
    )


async def login_user(login_payload: LoginPayload, db: AsyncSession) -> UserWithToken:
    """
    Login user using provided login credentials

    Returns User info with token
    """
    logger.info("Login attempt for email=%s", login_payload.email)
    existing_user = await UserRepository.get_by_email(db, login_payload.email)
    if not existing_user:
        raise InvalidCredentialsError
    # Match the provided password with hashed password
    is_match = verify_password(login_payload.password, existing_user.password)
    if not is_match:
        raise InvalidCredentialsError
    # Generate token
    access_token_expires = timedelta(hours=TOKEN_EXPIRE_TIME)
    token = create_access_token({"id": str(existing_user.id)}, access_token_expires)
    return UserWithToken(
        id=existing_user.id,
        username=existing_user.username,
        email=existing_user.email,
        token=token,
    )
