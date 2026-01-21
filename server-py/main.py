from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated
from db import SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

def get_db():
    """
    Dependency that provides a database session per request.
    """
    db = SessionLocal()
    print("Connected db")
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

origins = [
    "http://localhost:5173",
]

## CORS prevents client at a different origin from calling anything at the API url. localhost:5173 != localhost:8000 or in this case with uvicorn http://127.0.0.1:8000/
# we need to specify specific origin URL that is allowed to call from the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    print("Server Started")
    return {"API is running..."}

@app.get("/test")
def test():
    return {"Test Response"}

