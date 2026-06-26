from operator import add
import pytest
from fastapi.testclient import TestClient
from src.main import app


def test_add():
    assert add(2, 3) == 5


client = TestClient(app)

@pytest.fixture(scope='session')
def test_login():
    response = client.post(
        "/auth/login", json={"email": "jrcheehu@gmail.com", "password": "123"}
    )

    assert response.status_code == 200
    assert response.json()["email"] == "jrcheehu@gmail.com"


def test_get_athletes():
    response = client.get(
        "/athlete/",
    )
    assert response.status_code == 200
    assert response = 
