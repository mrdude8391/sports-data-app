from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
import jwt
from dotenv import load_dotenv
import os
from src.auth.models import User

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


def create_access_token_for_user(user: User):
    payload = {"id": str(user.id)}
    return create_access_token(payload)
