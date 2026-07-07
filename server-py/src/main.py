from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, init_db

from .exception_handlers import register_exception_handlers

from .api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: engine already created globally
    # uncomment and run below to create tables
    await init_db()
    yield
    # Shutdown: dispose engine to close pool connections
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "https://sports-data-app-py.vercel.app",
    "https://sports-data-app.vercel.app",
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


app.include_router(api_router)
