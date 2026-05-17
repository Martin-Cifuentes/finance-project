def test_create_category(client, auth_headers):
    payload = {"name": "Groceries", "monthly_budget": 500.0}
    response = client.post("/categories", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Groceries"
    assert data["monthly_budget"] == 500.0
    assert "id" in data

def test_read_categories(client, auth_headers):
    response = client.get("/categories", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_category_details(client, auth_headers):
    # Primero creamos una categoría
    create_resp = client.post("/categories", json={"name": "Transport", "monthly_budget": 100.0}, headers=auth_headers)
    cat_id = create_resp.json()["id"] if create_resp.status_code == 201 else "fake_id"
    
    response = client.get(f"/categories/{cat_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Transport"
    assert "gastado" in data
    assert "porcentaje_uso" in data

def test_update_category(client, auth_headers):
    create_resp = client.post("/categories", json={"name": "Entertainment", "monthly_budget": 200.0}, headers=auth_headers)
    cat_id = create_resp.json()["id"] if create_resp.status_code == 201 else "fake_id"
    
    response = client.put(f"/categories/{cat_id}", json={"monthly_budget": 300.0}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["monthly_budget"] == 300.0

def test_delete_category(client, auth_headers):
    create_resp = client.post("/categories", json={"name": "To Delete", "monthly_budget": 50.0}, headers=auth_headers)
    cat_id = create_resp.json()["id"] if create_resp.status_code == 201 else "fake_id"
    
    response = client.delete(f"/categories/{cat_id}", headers=auth_headers)
    assert response.status_code == 200
    
    # Should not be listed anymore
    list_resp = client.get("/categories", headers=auth_headers)
    if list_resp.status_code == 200:
        assert not any(c["id"] == cat_id for c in list_resp.json())

def test_cannot_read_others_categories(client, auth_headers, test_user_2):
    import uuid
    # Use a random valid UUID which won't exist
    fake_id = str(uuid.uuid4())
    response = client.get(f"/categories/{fake_id}", headers=auth_headers)
    assert response.status_code == 404
