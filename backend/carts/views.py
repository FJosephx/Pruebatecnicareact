import json

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from products.models import Product

from .models import Cart, CartItem


@csrf_exempt
def cart_create(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    items = payload.get("items")
    if not isinstance(items, list) or not items:
        return JsonResponse({"detail": "Items are required"}, status=400)

    normalized = []
    for item in items:
        if not isinstance(item, dict):
            return JsonResponse({"detail": "Invalid item format"}, status=400)

        product_id = item.get("product_id")
        quantity = item.get("quantity")

        if not product_id:
            return JsonResponse({"detail": "Product id is required"}, status=400)

        try:
            quantity_value = int(quantity)
        except (TypeError, ValueError):
            return JsonResponse({"detail": "Quantity must be a number"}, status=400)

        if quantity_value <= 0:
            return JsonResponse({"detail": "Quantity must be greater than 0"}, status=400)

        normalized.append((product_id, quantity_value))

    product_ids = [product_id for product_id, _qty in normalized]
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}

    if len(products) != len(product_ids):
        return JsonResponse({"detail": "One or more products not found"}, status=404)

    with transaction.atomic():
        cart = Cart.objects.create()
        CartItem.objects.bulk_create(
            [
                CartItem(cart=cart, product=products[product_id], quantity=quantity)
                for product_id, quantity in normalized
            ]
        )

    return JsonResponse(
        {
            "id": cart.id,
            "items": [
                {"product_id": product_id, "quantity": quantity}
                for product_id, quantity in normalized
            ],
        },
        status=201,
    )
