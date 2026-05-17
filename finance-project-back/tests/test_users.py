import uuid

def test_user_signup(client):
    new_user = {"email": f"new_{uuid.uuid4()}@example.com", "password": "pw", "name": "New"}
    response = client.post("/users/signup", json=new_user)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == new_user["email"]
    assert "password" not in data
    assert "id" in data

def test_read_own_profile(client, auth_headers, test_user):
    response = client.get("/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert "password_hash" not in data

def test_update_user_name(client, auth_headers):
    response = client.put("/users/me", json={"name": "Updated Name"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"

def test_logical_delete_user(client, auth_headers):
    response = client.delete("/users/me", headers=auth_headers)
    assert response.status_code == 200
    # Verificamos que ya no puede acceder
    response2 = client.get("/users/me", headers=auth_headers)
    assert response2.status_code == 404
