import pytest
from httpx import AsyncClient

from tests.conftest import auth_header, create_test_user, login_user
from src.athletes.schemas import AthleteListResponse

# @pytest.mark.anyio
# async def test_create_athlete_succeess(client:AsyncClient):
#     user = await create_test_user(client)
#     token = await login_user(client)
#     headers = auth_header(token)

#     response = await client.post(
#         "/athlete"
#     )


@pytest.mark.anyio
async def test_get_athletes(client: AsyncClient):

    register_user = await create_test_user(client)
    user = await login_user(client)
    token = user["token"]
    headers = auth_header(token)

    response = await client.get("/athlete/", headers=headers)
    assert response.status_code == 200
    data: AthleteListResponse = response.json()
    print(data)
    assert data["athleteList"] == []
