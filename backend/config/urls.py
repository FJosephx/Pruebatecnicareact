from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from authentication.views import login_view, logout_view, me_view
from carts.views import cart_create, cart_delete, cart_update, carts_list
from products.views import products_create, products_delete, products_detail, products_list, products_update


urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/login", login_view),
    path("auth/logout", logout_view),
    path("auth/me", me_view),
    path("products", products_list),
    path("products/<int:product_id>", products_detail),
    path("products/create", products_create),
    path("products/update", products_update),
    path("products/delete", products_delete),
    path("carts", carts_list),
    path("cart", cart_create),
    path("cart/update", cart_update),
    path("cart/delete", cart_delete),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
