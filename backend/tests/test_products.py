import json

import pytest

from products.models import Product


@pytest.mark.django_db
def test_products_list(client):
    Product.objects.create(name="Remera", price=1000)
    Product.objects.create(name="Zapatillas", price=2000)

    response = client.get("/products")

    assert response.status_code == 200
    payload = json.loads(response.content.decode("utf-8"))
    assert len(payload) == 2
    assert payload[0]["name"] in {"Remera", "Zapatillas"}
