def test_balance_calculation(client, auth_headers):
    response = client.get("/transactions/balance", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "balance" in data
    assert isinstance(data["balance"], (int, float))

def test_budget_alert_80_percent(client, auth_headers):
    cat_resp = client.post("/categories", json={"name": "Cat80", "monthly_budget": 100}, headers=auth_headers)
    cat_id = cat_resp.json()["id"]
    
    payload = {
        "type": "egreso",
        "value": 85.0, # Supera el 80%
        "description": "Expensive purchase",
        "category_id": cat_id
    }
    response = client.post("/transactions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert "meta" in data
    assert "alerta" in data["meta"]
    assert data["meta"]["alerta"] == "80_percent_exceeded"

def test_budget_alert_100_percent(client, auth_headers):
    cat_resp = client.post("/categories", json={"name": "Cat100", "monthly_budget": 100}, headers=auth_headers)
    cat_id = cat_resp.json()["id"]
    
    payload = {
        "type": "egreso",
        "value": 105.0, # Supera el 100%
        "description": "Very expensive purchase",
        "category_id": cat_id
    }
    response = client.post("/transactions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert "meta" in data
    assert "alerta" in data["meta"]
    assert data["meta"]["alerta"] == "100_percent_exceeded"
