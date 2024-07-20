# Create your views here.
from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
import json
from .models import Player, InGame
from django.core.serializers import serialize
from .online import *
from django.views.decorators.csrf import csrf_exempt
from .is_auth import is_auth

import os

def in_games_list(request):
    var = InGame.objects.all()
    return HttpResponse(serialize('json', var), content_type='application/json')


def in_games_clear(request):
    var = InGame.objects.all()
    count = len(var)
    var.delete()
    return HttpResponse(f"{count} deleated from queue table")


def players_list(request):
    var = Player.objects.all()
    return HttpResponse(serialize('json', var), content_type='application/json')


def players_clear(request):
    var = Player.objects.all()
    count = len(var)
    var.delete()
    return HttpResponse(f"{count} deleated from queue table")

