from django.db import models
from datetime import datetime
from django.utils import timezone

class Player(models.Model):
    login = models.CharField("login", max_length=50,unique=True)
    is_connected = models.BooleanField("is_connected",default=False)
    score = models.IntegerField("score",default= 0)
    channel_id = models.CharField("socket",null=True, max_length=255)
    side = models.IntegerField("score",default= 0)
    imageURL = models.CharField("imageURL", max_length=500, default="None")


class InGame(models.Model):
    player1 = models.CharField("login", max_length=50,unique=True)
    player2 = models.CharField("login", max_length=50,unique=True)
    created_at = models.DateTimeField("create_date", default=timezone.now)
    round = models.IntegerField("score",default= 1)
    game_started = models.BooleanField("score",default= False)

class PonGames(models.Model):
    player1 = models.CharField("login", max_length=50,unique=True)
    player2 = models.CharField("login", max_length=50,unique=True)
    created_at = models.DateTimeField("create_date", default=timezone.now)
    game_started = models.BooleanField("score",default= False)
    goals =  models.CharField("login", max_length=50,unique=True)