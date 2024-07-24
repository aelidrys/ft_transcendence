from channels.layers import get_channel_layer
from django.dispatch import receiver
from .models import tournament, matche, player
from .enums import Round, M_status, Tourn_status
from django.shortcuts import render
from asgiref.sync import async_to_sync
from django.utils import timezone
from django.http import JsonResponse




def start_matche(request, tourn):
    matches = tourn.matches.all()

    context = {'matches':matches}
    return render(request, 'tournament/matche.html', context) 

def create_matches(tourn: tournament):
    print('create_matches', flush=True)
    players = tourn.trn_players.all()
    won_players = [plyr for plyr in players if plyr.won] 
    if len(won_players) == 1:
        tourn.status = Tourn_status.EN.value
        tourn.save()
        return
    p1 = None
    p2 = None
    i = 1
    for p in won_players:
        if i % 2 == 1:
            p1 = p
        else:
            p2 = p
            create_matche(p1, p2, tourn)
        i += 1


def create_matche(p1, p2, trn):
    mtch = matche.objects.create(tourn=trn)
    mtch.player1 = p1
    mtch.player2 = p2
    mtch.round = trn.round
    mtch.status = M_status.UNP.value
    mtch.save()


def send_match_start(trn: tournament, refresh):
    channel_layer = get_channel_layer()
    group_name = f'trnGroup_{trn.pk}'
    trn_name = trn.name

    print('send_match_start to : ', group_name, flush=True)
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "start_matche",
            'refresh': refresh,
            "trn_id": trn.pk,
            'trn_name': trn_name,
        }
    )


def matche_simulation(user):
    trn = tournament.objects.latest('id')
    print('matche simulation Round: ', trn.round, flush=True)
    matches = trn.matches.all()
    i = 1
    for matche in matches:
        if i % 2:
            matche.player2.won = False
            matche.player2.save()
            matche.winner = matche.player1
            matche.status = M_status.PLY.value
            matche.save()
        else:
            matche.player1.won = False
            matche.player1.save()
            matche.winner = matche.player2
            matche.status = M_status.PLY.value
            matche.save()
        i += 1
    return new_round(trn)


def update_round(trn : tournament):
    if trn.round == Round.QU.value:
        trn.round = Round.HF.value
        trn.save()
    if trn.round == Round.HF.value:
        trn.round = Round.FN.value
        trn.save()



def new_round(trn):

    update_round(trn)
    create_matches(trn)
    matches = matche.objects.filter(status=M_status.UNP.value)
    for m in matches:
        print('plyer1_name', m.player1.profile.user.username, flush=True)
    return trn


