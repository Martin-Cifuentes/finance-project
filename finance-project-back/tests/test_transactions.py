def test_create_transaction(client, auth_headers):
    # Crear categoría real para que no falle el foreign key
    cat_resp = client.post("/categories", json={"name": "Income", "monthly_budget": 0}, headers=auth_headers)
    cat_id = cat_resp.json()["id"]

    payload = {
        "type": "ingreso",
        "value": 1500.0,
        "description": "Salary",
        "date": "2023-10-01T10:00:00Z",
        "category_id": cat_id
    }
    response = client.post("/transactions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "ingreso"
    assert data["value"] == 1500.0
    assert "id" in data

def test_read_transactions_with_filters(client, auth_headers):
    response = client.get("/transactions?type=ingreso", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Todos deben ser ingresos
    for t in data:
        assert t["type"] == "ingreso"

def test_update_transaction(client, auth_headers):
    # Create first
    create_resp = client.post("/transactions", json={
        "type": "egreso",
        "value": 50.0,
        "description": "Lunch"
    }, headers=auth_headers)
    t_id = create_resp.json()["id"] if create_resp.status_code == 201 else "fake_id"
    
    # Update
    response = client.put(f"/transactions/{t_id}", json={"value": 60.0}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["value"] == 60.0

def test_delete_transaction(client, auth_headers):
    create_resp = client.post("/transactions", json={
        "type": "egreso",
        "value": 10.0,
        "description": "Snack"
    }, headers=auth_headers)
    t_id = create_resp.json()["id"] if create_resp.status_code == 201 else "fake_id"
    
    response = client.delete(f"/transactions/{t_id}", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify logical delete
    get_resp = client.get(f"/transactions/{t_id}", headers=auth_headers)
    assert get_resp.status_code == 404
