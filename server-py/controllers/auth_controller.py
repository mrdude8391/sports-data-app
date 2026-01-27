from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models import User
from schemas.auth_schemas import RegisterPayload, UserWithToken, LoginPayload
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv
import os

load_dotenv()

password_hash = PasswordHash.recommended()

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("JWT_SECRET"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

def register_user(user_data: RegisterPayload, db: Session) -> UserWithToken:
    """
    Create a new user row using provided information in the database
    
    :param user_data: Credentials provided to create new User
    :type user_data: RegisterPayload
    :param db: SQLAlchemy db Session
    :type db: Session
    :return: Returns UserWithToken object giving client a token to work with
    :rtype: UserWithToken
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    

    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    

    # Generate token
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    token = create_access_token({"id" : str(new_user.id)}, access_token_expires)

    
    return UserWithToken(
        id= new_user.id,
        username= new_user.username,
        email= new_user.email,
        created_at=new_user.created_at,
        token=token
    )

def login_user(login_payload: LoginPayload, db: Session) -> UserWithToken:
    print(login_payload.email)
    return UserWithToken(
        id="9c8f9ca4-5382-46e7-89ba-081a4939dd17",
        username="testy",
        email="test@gmail.com",
        created_at="2026-01-22 21:46:39.250996",
        token="tokey",
    )