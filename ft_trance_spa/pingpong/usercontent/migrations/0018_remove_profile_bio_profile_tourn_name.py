# Generated by Django 5.0.4 on 2024-10-29 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usercontent', '0017_remove_notification_notification_count_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='bio',
        ),
        migrations.AddField(
            model_name='profile',
            name='tourn_name',
            field=models.CharField(default='', max_length=100, unique=True),
        ),
    ]
