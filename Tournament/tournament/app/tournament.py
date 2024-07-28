from .models import tournament
from .matches import create_matches, player, send_match_start
from .enums import Tourn_status, Round
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def tourn_subscribing(request, data, trn_size):
    subs, tourn = get_or_create_tourn(data, trn_size)
    if subs:
        t_players = tourn.trn_players.count()
        if t_players == trn_size:
            return tourn
    else:
        plyr = get_or_create_player(data, tourn)
        plyr.save()
        t_players = tourn.trn_players.count()
        if t_players == trn_size:
            tourn.status = Tourn_status.ST.value
            tourn.save()
            create_matches(tourn)
            send_match_start(tourn, 'true')
            return tourn
        else:
            send_tournament_update(tourn, 'tourn_subscribing')
    return None



def get_or_create_player(data, trn):
    user_id = data['user']['id']
    user_name = data['user']['username']
    # print('$$$$$$$$$$$ username: ', user_name, flush=True)
    plyr, created = player.objects.get_or_create(profile_id=user_id, tournament=trn)
    if created:
        plyr.img_url = data['avatar']
        plyr.name = f'player_{user_name}'
        plyr.username = user_name
        plyr.save()
    else:
        plyr.img_url = data['avatar']
        plyr.username = user_name
    return plyr

def get_or_create_tourn(data, trn_size):
    user_id = data['user']['id']
    t_count = tournament.objects.filter(size=trn_size).count()
    if t_count == 0:
        trn = tournament.objects.create(name=f"tourn_{user_id}", size=trn_size)
        return False, trn
    tourn = tournament.objects.filter(size=trn_size).latest("id")
    plyr = is_user_subscribe(user_id)
    if plyr:
        return True, tourn
    if tourn.status == Tourn_status.ST.value:
        tourn_name = f"tourn_{user_id}"
        new_tourn = tournament.objects.create(name=tourn_name, size=trn_size)
        if trn_size == 8:
            new_tourn.round = Round.QU.value
        elif trn_size == 4:
            new_tourn.round = Round.HF.value
        return False, new_tourn
    return False, tourn
    
def is_user_subscribe(user_id):
    try:
        tourn = tournament.objects.filter(size=4).latest("id")
        plyr = player.objects.get(tournament=tourn, profile_id=user_id)
        return plyr
    except:
        pass
    try:
        tourn = tournament.objects.filter(size=8).latest("id")
        plyr = player.objects.get(tournament=tourn, profile_id=user_id)
        return plyr
    except:
        pass
    return None


def send_tournament_update(tourn: tournament, prev_f):
    channel_layer = get_channel_layer()
    room_group_name = f'trnGroup_{tourn.pk}'
    players = tourn.trn_players.all()

    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            'type': 'update_tournament',
            'start_status': tourn.status,
            'tourn_players': [
                {'image_url': player.img_url, 'username': player.username}
                for player in players
            ],
            'unknown': tourn.size - tourn.trn_players.count(),
            'trn_name': tourn.name,
        }
    )
    print('tourn_up send to group: {} {}'.format(room_group_name, prev_f),
        flush=True)
    


