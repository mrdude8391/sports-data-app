from fastapi import APIRouter

from src.auth import router as auth_router
from src.athletes import router as athlete_router
from src.stats import router as stat_router

api_router = APIRouter()
# Include Routers
api_router.include_router(auth_router.router)
api_router.include_router(athlete_router.router)
api_router.include_router(stat_router.router)
