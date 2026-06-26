import pytest

from src.database import Base, get_db
from src.main import app

pytest_plugins = ["anyio"]
