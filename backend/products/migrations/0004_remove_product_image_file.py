from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0003_add_product_image_file"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="image_file",
        ),
    ]
