from fastapi import Request, HTTPException, Depends, APIRouter
from fastapi.security import HTTPBearer

security = HTTPBearer()

def protect(request: Request):
    print(request.headers.get("authorization"))
    return request.headers