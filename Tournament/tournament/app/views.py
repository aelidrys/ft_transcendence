from django.shortcuts import render
from django.http import HttpResponse
from .models import tournament
from .matches import matche
from .tournament import tourn_subscribing, is_user_subscribe
from django.core.serializers import serialize
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def is_intorn(request):
    print('***********ENTER************', flush=True)
    if request.method == 'POST':
        data = request.data
        user_id = data['user']['id']
        plyr = is_user_subscribe(user_id)
        if plyr:
            trn_size = plyr.tournament.size
            response = {
                'intourn': 'yes',
                'trn_size': trn_size,
            }
        else:
            response = {
                'intourn': 'no',
                'trn_size': 0,
            }
        return HttpResponse(json.dumps(response),
            content_type='application/json')
    return (HttpResponse("la"))

@api_view(['POST'])
@permission_classes([AllowAny])
def play_tournament(request):
    if request.method == 'POST':
        data = request.data
        trn_size = int(request.GET.get('trn_size'))
        trn = tourn_subscribing(request, data, trn_size)
        if trn:
            response = generate_matche_response(trn)
            return HttpResponse(json.dumps(response),
                content_type='application/json')

        trn = tournament.objects.filter(size=trn_size).latest('id')
        players = generate_tourn_response(trn)
        return HttpResponse(json.dumps(players),
            content_type='application/json')

def generate_tourn_response(trn: tournament):
    data = trn.trn_players.all()
    playerslist = []
    for player in data:
        playerslist.append({
            'image_url': player.img_url,
            'username': player.username,
        })
    
    resp_data = {
        'type': 'tourn',
        'created': 'true',
        'players': playerslist,
        'unknown': trn.size - len(playerslist),
        'trn_name': trn.name,
    }
    return resp_data


def generate_matche_response(trn: tournament):
    matches = matche.objects.filter(tourn=trn, round=trn.round)
    trn_matches = []
    for m in matches:
        trn_matches.append({
            'p1_img':m.player1.img_url,
            'p1_name':m.player1.name,
            'p1_pr_id':m.player1.profile_id,
            'p2_img':m.player2.img_url,
            'p2_name':m.player2.name,
            'p2_pr_id':m.player2.profile_id,
        })
    resp_data = {
        'type': 'matche',
        'm_res': 'win',
        'refresh': 'false',
        'matches': trn_matches,
        'trn_name': trn.name,
    }
    return resp_data


def tourn_info(request):
    if request.method == 'GET':
        trn_size = int(request.GET.get('trn_size'))
        try:
            trn = tournament.objects.filter(size=trn_size).latest('id')
            players = generate_tourn_response(trn)
            return HttpResponse(json.dumps(players),
                content_type='application/json')
        except:
            pass
    return HttpResponse(json.dumps({'type':'tourn', 'created': 'false'}),
        content_type='application/json')
