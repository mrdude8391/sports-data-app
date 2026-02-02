from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_db
from sqlalchemy.orm import Session
from models import User
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Retrieves HTTP header.authorization using FastAPIs security dependency

    Returns the current user object after verifying existence in db
    """
    # Retreive token from credentials dependency
    token = credentials.credentials
    
    print("get current user")
    try:
        # Decode the JWT into the payload structures
        # {"id" : str(existing_user.id)}
        print("start payload")
        payload = jwt.decode(
            token,
            key=os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )
        

        # Extract ID from the payload
        user_id = payload.get("id")
        if not user_id:
            
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")

        # Verify User existence
        user: User =  db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User id not found")

        # Return User object
        return user
    except ValueError:
        print("Payload error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server Error",
        )
    except jwt.ExpiredSignatureError:
        print("expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired",
        )
    
    