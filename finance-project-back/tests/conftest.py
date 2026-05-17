import pytest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from main import app
import uuid

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="session")
def test_user():
    return {
        "email": f"test_{uuid.uuid4()}@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

@pytest.fixture(scope="session")
def test_user_2():
    return {
        "email": f"other_{uuid.uuid4()}@example.com",
        "password": "securepassword456",
        "name": "Other User"
    }

@pytest.fixture(scope="session", autouse=True)
def setup_users(client, test_user, test_user_2):
    client.post("/users/signup", json=test_user)
    client.post("/users/signup", json=test_user_2)

@pytest.fixture
def auth_headers(client, test_user):
    response = client.post("/auth/login", data={"username": test_user["email"], "password": test_user["password"]})
    if response.status_code == 200:
        token = response.json().get("access_token", "fake_token")
        return {"Authorization": f"Bearer {token}"}
    return {"Authorization": "Bearer fake_token_for_tdd"}

