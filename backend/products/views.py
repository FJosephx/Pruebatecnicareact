import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Product


def _serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "price": float(product.price),
        "image_url": product.image_url,
    }


def _ensure_staff(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Not authorized"}, status=403)
    return None




def products_list(_request):
    products = [_serialize_product(product) for product in Product.objects.all()]
    return JsonResponse(products, safe=False)


def products_detail(request, product_id: int):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    product = Product.objects.filter(id=product_id).first()
    if not product:
        return JsonResponse({"detail": "Product not found"}, status=404)

    return JsonResponse(_serialize_product(product))


@csrf_exempt
def products_create(request):
    forbidden = _ensure_staff(request)
    if forbidden:
        return forbidden

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    name = str(payload.get("name", "")).strip()
    price = payload.get("price")
    image_url = str(payload.get("image_url", "")).strip()

    if not name:
        return JsonResponse({"detail": "Name is required"}, status=400)

    try:
        price_value = Decimal(str(price))
    except (InvalidOperation, TypeError):
        return JsonResponse({"detail": "Price must be a number"}, status=400)

    if price_value <= 0:
        return JsonResponse({"detail": "Price must be greater than 0"}, status=400)

    product = Product.objects.create(name=name, price=price_value, image_url=image_url)
    return JsonResponse(_serialize_product(product), status=201)


@csrf_exempt
def products_update(request):
    forbidden = _ensure_staff(request)
    if forbidden:
        return forbidden

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    product_id = payload.get("id")
    if not product_id:
        return JsonResponse({"detail": "Product id is required"}, status=400)

    product = Product.objects.filter(id=product_id).first()
    if not product:
        return JsonResponse({"detail": "Product not found"}, status=404)

    if "name" in payload:
        name = str(payload.get("name", "")).strip()
        if not name:
            return JsonResponse({"detail": "Name is required"}, status=400)
        product.name = name

    if "price" in payload:
        try:
            price_value = Decimal(str(payload.get("price")))
        except (InvalidOperation, TypeError):
            return JsonResponse({"detail": "Price must be a number"}, status=400)

        if price_value <= 0:
            return JsonResponse({"detail": "Price must be greater than 0"}, status=400)
        product.price = price_value

    if "image_url" in payload:
        product.image_url = str(payload.get("image_url", "")).strip()

    product.save()
    return JsonResponse(_serialize_product(product))


@csrf_exempt
def products_delete(request):
    forbidden = _ensure_staff(request)
    if forbidden:
        return forbidden

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    product_id = payload.get("id")
    if not product_id:
        return JsonResponse({"detail": "Product id is required"}, status=400)

    deleted, _ = Product.objects.filter(id=product_id).delete()
    if not deleted:
        return JsonResponse({"detail": "Product not found"}, status=404)

    return JsonResponse({"detail": "Product deleted"})
