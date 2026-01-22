from sqlalchemy.orm import Session
from models import User
from schemas.auth_schemas import Register, UserWithToken

def register_user(user_data: Register, db: Session) -> UserWithToken:
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