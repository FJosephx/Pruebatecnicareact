from django.contrib import admin
from django.urls import path

from carts.views import cart_create, cart_delete, cart_update, carts_list
from products.views import products_create, products_list, products_update


urlpatterns = [
    path("admin/", admin.site.urls),
    path("products", products_list),
    path("products/create", products_create),
    path("products/update", products_update),
    path("carts", carts_list),
    path("cart", cart_create),
    path("cart/update", cart_update),
    path("cart/delete", cart_delete),
]
