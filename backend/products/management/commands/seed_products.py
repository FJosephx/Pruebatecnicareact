from django.core.management.base import BaseCommand

from products.models import Product


class Command(BaseCommand):
    help = "Carga productos de ejemplo con imagenes."

    def handle(self, *args, **options):
        samples = [
            {
                "name": "Remera basica",
                "price": 7990,
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Zapatillas urbanas",
                "price": 42990,
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Mochila compacta",
                "price": 18990,
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Gorra street",
                "price": 6990,
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Campera liviana",
                "price": 55990,
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            },
        ]

        created = 0
        for sample in samples:
            product, was_created = Product.objects.get_or_create(
                name=sample["name"],
                defaults={
                    "price": sample["price"],
                    "image_url": sample["image_url"],
                },
            )
            if was_created:
                created += 1
            else:
                product.price = sample["price"]
                product.image_url = sample["image_url"]
                product.save()

        self.stdout.write(self.style.SUCCESS(f"Productos cargados/actualizados: {created}"))
