# Generated by Django 5.0.6 on 2024-10-19 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_message_receiver_id_alter_message_sender_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='msg_text',
            field=models.CharField(max_length=10000),
        ),
    ]
