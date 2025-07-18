# Generated by Django 5.2.4 on 2025-07-11 15:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Blog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("post_title", models.CharField(max_length=100)),
                ("post_body", models.TextField()),
                ("post_title_color", models.CharField(max_length=15)),
                ("post_img", models.ImageField(upload_to="blog_img/")),
                (
                    "post_catagory",
                    models.CharField(
                        choices=[
                            ("food", "Food"),
                            ("electronics", "Electronics"),
                            ("life_hacks", "Life Hacks"),
                            ("family", "Family"),
                            ("education", "Education"),
                            ("entertainment", "Entertainment"),
                            ("stories", "Stories"),
                            ("news", "News"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
