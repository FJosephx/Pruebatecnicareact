from django.contrib import admin
from django.urls import path

from products.views import products_create, products_list, products_update


urlpatterns = [
    path("admin/", admin.site.urls),
    path("products", products_list),
    path("products/create", products_create),
    path("products/update", products_update),
]
