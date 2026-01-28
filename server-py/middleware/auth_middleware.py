import jwt
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.middlware("http")
async def protect():
    try:
        return
    except:
        return