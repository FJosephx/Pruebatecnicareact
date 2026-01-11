from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0002_add_product_image_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="image_file",
            field=models.ImageField(blank=True, null=True, upload_to="products"),
        ),
    ]
