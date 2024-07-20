from django.db import models
from .enums import Round, Tourn_status, M_status
from django.dispatch import receiver
from django.utils import timezone


class tournament(models.Model):
    name = models.CharField(default="four players", max_length=50)
    status = models.CharField(choices=Tourn_status.choices(), max_length=50,
        default=Tourn_status.PN.value)
    round = models.CharField(choices=Round.choices, max_length=50,
        default=Round.HF.value)
    create_date = models.DateTimeField(default=timezone.now)
    size = models.IntegerField(default=4)
    def __str__(self):
        return self.name

class player(models.Model):
    name = models.CharField(max_length=100, default='player_x')
    username = models.CharField(max_length=100, null=True)
    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE,
        related_name="trn_players")
    profile_id = models.IntegerField(default=0)
    img_url = models.URLField(null=True)
    won = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class matche(models.Model):
    tourn = models.ForeignKey(tournament, on_delete=models.CASCADE,
        related_name="matches")
    round = models.CharField(max_length=50, default=Round.HF.value,
        choices=Round.choices())
    player1 = models.OneToOneField(player, related_name="matche_p1",
        on_delete=models.CASCADE, null=True)
    player2 = models.OneToOneField(player, related_name="matche_p2",
        on_delete=models.CASCADE, null=True)
    winner = models.OneToOneField(player, related_name="m_win",
        on_delete=models.CASCADE, null=True)
    status = models.CharField(max_length=50, default=M_status.UNP.value,
        choices=M_status.choices())
    
    