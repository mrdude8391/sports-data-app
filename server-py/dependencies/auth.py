from fastapi import Request, HTTPException, Depends, APIRouter
from fastapi.security import HTTPBearer

security = HTTPBearer()

def protect(request: Request):
    token = request.headers.authorization
    print(request)
    return token