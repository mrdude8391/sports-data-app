from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, init_db
from routers import auth_router, athlete_router
from exceptions.exception_handlers import register_exception_handlers
import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: engine already created globally

    await init_db()
    yield
    # Shutdown: dispose engine to close pool connections
    await engine.dispose()


app = FastAPI(lifespan=lifespan)


origins = [
    "http://localhost:5173",
    "https://sports-data-app-py.vercel.app",
    "https://sports-data-app-py.vercel.app",
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

register_exception_handlers(app)


@app.get("/")
def root():
    print("Server Started")
    return {"message": "Fast API is running..."}


@app.get("/test")
def test():
    # raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")
    print("Test called")
    return {"Test Response Local"}


# Include Routers
app.include_router(auth_router.router)
app.include_router(athlete_router.router)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app="main:app", host="0.0.0.0", port=os.getenv("SERVER_PORT"), reload=True)
