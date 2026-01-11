import json

import pytest

from carts.models import Cart
from products.models import Product


@pytest.mark.django_db
def test_cart_create(client):
    product = Product.objects.create(name="Remera", price=1500)

    response = client.post(
        "/cart",
        data=json.dumps({"items": [{"product_id": product.id, "quantity": 2}]}),
        content_type="application/json",
    )

    assert response.status_code == 201
    payload = json.loads(response.content.decode("utf-8"))
    assert payload["id"]
    assert payload["items"][0]["product_id"] == product.id
    assert Cart.objects.count() == 1
