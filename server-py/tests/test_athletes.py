import asyncio
from datetime import datetime, timedelta, timezone
import time

import pytest
from httpx import AsyncClient

from tests.conftest import auth_header, create_test_user, login_user
from src.athletes.schemas import AthleteListResponse, AthleteResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.athletes.models import Athlete


@pytest.mark.anyio
async def test_get_athletes_empty(client: AsyncClient):

    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    response = await client.get("/athlete/", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert data["athleteList"] == []
    assert data["nextCursor"] == None

    response = await client.get("/athlete/?limit=2", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert data["athleteList"] == []
    assert data["nextCursor"] == None

    response = await client.get("/athlete/?limit=2&cursor=", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert data["athleteList"] == []
    assert data["nextCursor"] == None


@pytest.mark.anyio
async def test_create_athlete_unauthorized(client: AsyncClient):
    response = await client.post(
        "/athlete/create", json={"name": "dummy", "age": 4, "height": "123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.anyio
async def test_create_athlete_succeess(client: AsyncClient):
    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    response = await client.post(
        "/athlete/create",
        json={"name": "zaku", "age": 3, "height": 300},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "zaku"
    assert data["age"] == 3
    assert data["height"] == 300
    assert data["createdAt"]
    assert isinstance(AthleteResponse(**data), AthleteResponse)


@pytest.mark.anyio
async def test_get_athletes(client: AsyncClient):
    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    for i in range(5):
        response = await client.post(
            "/athlete/create",
            json={"name": f"Zaku{i}", "age": 3, "height": 300},
            headers=headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == f"Zaku{i}"

    response = await client.get("/athlete/", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 5
    assert data["nextCursor"] == None


@pytest.mark.anyio
async def test_get_athletes_with_pagination_same_date(client: AsyncClient):

    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    for i in range(5):
        response = await client.post(
            "/athlete/create",
            json={"name": f"Zaku{i}", "age": 3, "height": 300},
            headers=headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == f"Zaku{i}"

    response = await client.get("/athlete/?limit=5", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 5
    assert data["nextCursor"] == None

    response = await client.get("/athlete/?limit=2", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 2
    assert data["nextCursor"]
    page1 = data["athleteList"]
    cursor = data["nextCursor"]

    response = await client.get(f"/athlete/?limit=2&cursor={cursor}", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 2
    assert data["nextCursor"]
    page2 = data["athleteList"]
    assert page1 != page2
    cursor = data["nextCursor"]

    response = await client.get(f"/athlete/?limit=2&cursor={cursor}", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 1
    assert data["nextCursor"] == None
    page3 = data["athleteList"]
    assert page1 != page2 != page3


@pytest.mark.anyio
async def test_get_athletes_with_pagination(
    client: AsyncClient, db_session: AsyncSession
):
    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    for i in range(5):
        now_time = (
            datetime.now(timezone.utc) - timedelta(hours=1) + timedelta(minutes=i)
        )
        new_athlete = Athlete(
            user_id=user["id"], name=f"Zaku{i}", age=3, height=300, created_at=now_time
        )
        db_session.add(new_athlete)
        await db_session.flush()
        await db_session.refresh(new_athlete)

    response = await client.get("/athlete/", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 5
    assert data["nextCursor"] == None

    response = await client.get("/athlete/?limit=5", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 5
    assert data["athleteList"][0]["name"] == "Zaku4"
    assert data["athleteList"][4]["name"] == "Zaku0"
    assert data["nextCursor"] == None

    response = await client.get("/athlete/?limit=2", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 2
    assert data["nextCursor"]
    page1 = data["athleteList"]
    cursor = data["nextCursor"]

    response = await client.get(f"/athlete/?limit=2&cursor={cursor}", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 2
    assert data["nextCursor"]
    page2 = data["athleteList"]
    assert page1 != page2
    cursor = data["nextCursor"]

    response = await client.get(f"/athlete/?limit=2&cursor={cursor}", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    assert len(data["athleteList"]) == 1
    assert data["nextCursor"] == None
    page3 = data["athleteList"]
    assert page1 != page2 != page3
