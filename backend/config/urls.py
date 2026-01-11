from django.contrib import admin
from django.http import JsonResponse
from django.urls import path


def products_list(_request):
    return JsonResponse(
        [
            {"id": 1, "name": "Remera basica", "price": 7990},
            {"id": 2, "name": "Zapatillas urbanas", "price": 42990},
            {"id": 3, "name": "Mochila compacta", "price": 18990},
        ],
        safe=False,
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("products", products_list),
]
