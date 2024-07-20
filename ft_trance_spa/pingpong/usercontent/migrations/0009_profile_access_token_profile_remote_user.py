# Generated by Django 5.0.4 on 2024-05-26 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usercontent', '0008_notification_is_read_notification_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='access_token',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='remote_user',
            field=models.BooleanField(default=False),
        ),
    ]
