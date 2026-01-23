from sqlalchemy.orm import Session
from models import User
from schemas.auth_schemas import RegisterPayload, UserWithToken, LoginPayload

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
    hashed_password = user_data.password + "hashed"
    

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
    token = "booger"
    
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