# Generated by Django 3.1 on 2024-06-04 12:37

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('online', '0003_player_side'),
    ]

    operations = [
        migrations.CreateModel(
            name='PonGames',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1', models.CharField(max_length=50, unique=True, verbose_name='login')),
                ('player2', models.CharField(max_length=50, unique=True, verbose_name='login')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='create_date')),
                ('game_started', models.BooleanField(default=False, verbose_name='score')),
                ('goals', models.CharField(max_length=50, unique=True, verbose_name='login')),
            ],
        ),
    ]