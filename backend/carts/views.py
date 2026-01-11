import json
from datetime import datetime

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from products.models import Product

from .models import Cart, CartItem


def _serialize_cart(cart: Cart) -> dict:
    items = [
        {
            "product_id": item.product_id,
            "product_name": item.product.name,
            "price": float(item.product.price),
            "quantity": item.quantity,
        }
        for item in cart.items.all()
    ]
    total = sum(item["price"] * item["quantity"] for item in items)
    return {"id": cart.id, "created_at": cart.created_at.isoformat(), "items": items, "total": total}


def _parse_items(payload):
    items = payload.get("items")
    if not isinstance(items, list) or not items:
        return None, JsonResponse({"detail": "Items are required"}, status=400)

    normalized = []
    for item in items:
        if not isinstance(item, dict):
            return None, JsonResponse({"detail": "Invalid item format"}, status=400)

        product_id = item.get("product_id")
        quantity = item.get("quantity")

        if not product_id:
            return None, JsonResponse({"detail": "Product id is required"}, status=400)

        try:
            quantity_value = int(quantity)
        except (TypeError, ValueError):
            return None, JsonResponse({"detail": "Quantity must be a number"}, status=400)

        if quantity_value <= 0:
            return None, JsonResponse({"detail": "Quantity must be greater than 0"}, status=400)

        normalized.append((product_id, quantity_value))

    product_ids = [product_id for product_id, _qty in normalized]
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}

    if len(products) != len(product_ids):
        return None, JsonResponse({"detail": "One or more products not found"}, status=404)

    return (normalized, products), None


def carts_list(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    product_id = request.GET.get("product_id")
    from_date = request.GET.get("from")
    to_date = request.GET.get("to")

    if page < 1 or page_size < 1:
        return JsonResponse({"detail": "Invalid pagination values"}, status=400)

    queryset = Cart.objects.all().prefetch_related("items__product").order_by("-created_at")

    if product_id:
        queryset = queryset.filter(items__product_id=product_id).distinct()

    if from_date:
        try:
            queryset = queryset.filter(created_at__gte=datetime.fromisoformat(from_date))
        except ValueError:
            return JsonResponse({"detail": "Invalid from date"}, status=400)

    if to_date:
        try:
            queryset = queryset.filter(created_at__lte=datetime.fromisoformat(to_date))
        except ValueError:
            return JsonResponse({"detail": "Invalid to date"}, status=400)

    total = queryset.count()
    offset = (page - 1) * page_size
    carts = queryset[offset : offset + page_size]

    return JsonResponse(
        {
            "page": page,
            "page_size": page_size,
            "total": total,
            "results": [_serialize_cart(cart) for cart in carts],
        }
    )


@csrf_exempt
def cart_create(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    parsed, error = _parse_items(payload)
    if error:
        return error

    normalized, products = parsed

    with transaction.atomic():
        cart = Cart.objects.create()
        CartItem.objects.bulk_create(
            [
                CartItem(cart=cart, product=products[product_id], quantity=quantity)
                for product_id, quantity in normalized
            ]
        )

    return JsonResponse(_serialize_cart(cart), status=201)


@csrf_exempt
def cart_update(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    cart_id = payload.get("id")
    if not cart_id:
        return JsonResponse({"detail": "Cart id is required"}, status=400)

    cart = Cart.objects.filter(id=cart_id).first()
    if not cart:
        return JsonResponse({"detail": "Cart not found"}, status=404)

    parsed, error = _parse_items(payload)
    if error:
        return error

    normalized, products = parsed

    with transaction.atomic():
        CartItem.objects.filter(cart=cart).delete()
        CartItem.objects.bulk_create(
            [
                CartItem(cart=cart, product=products[product_id], quantity=quantity)
                for product_id, quantity in normalized
            ]
        )

    cart.refresh_from_db()
    return JsonResponse(_serialize_cart(cart))


@csrf_exempt
def cart_delete(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    cart_id = payload.get("id")
    if not cart_id:
        return JsonResponse({"detail": "Cart id is required"}, status=400)

    deleted, _ = Cart.objects.filter(id=cart_id).delete()
    if not deleted:
        return JsonResponse({"detail": "Cart not found"}, status=404)

    return JsonResponse({"detail": "Cart deleted"})
