def test_login_success(client, test_user):
    # Asume que el usuario ya existe
    response = client.post("/auth/login", data={
        "username": test_user["email"], 
        "password": test_user["password"]
    })
    # TDD Expectation: Success returns 200 and a token
    assert response.status_code == 200, "Should return 200 on successful login"
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_credentials(client, test_user):
    response = client.post("/auth/login", data={
        "username": test_user["email"], 
        "password": "wrongpassword"
    })
    # TDD Expectation: 401 Unauthorized
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_access_without_token(client):
    response = client.get("/users/me")
    # TDD Expectation: 401 Unauthorized when no token is provided
    assert response.status_code == 401
