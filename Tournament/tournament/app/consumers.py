from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from random import randint
from time import sleep
# local import
from .views import play_tournament
from .models import tournament
from .matches import matche, matche_simulation
from .enums import Tourn_status

class WSConsumer(WebsocketConsumer):
    def connect(self):
        try:
            trn = tournament.objects.latest("id")
        except:
            print('connection Faild!!!!!!', flush=True)
            return
        self.room_group_name = f'trnGroup_{trn.pk}'
        
        user = self.scope.get("user", None)
        # if user:
        #     print('user_name: ', user.username)
        # else:
        #     print("no user")
        print("user {} added to group: {}".format(user.username,
            self.room_group_name), flush=True)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()

    def receive(self, text_data):
        user = self.scope.get("user", None)
        print('consumer {} receive'.format(user.username), flush=True)
        data = json.loads(text_data)
        if data['type'] == 'play_matche':
            trn = matche_simulation(user)
            refresh = 'true'
            if trn.status == Tourn_status.EN.value:
                refresh = 'false'
            self.send_matche_start(trn, refresh)

    def disconnect(self, close_code):
        print("DISCONNECT", flush=True)
        user = self.scope.get("user", None)
        print("user {} rmoved from group: {}".format(user.username,
            self.room_group_name), flush=True)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

    def update_tournament(self, event):
        print('send_tournament_update called!!!')
        players = event['tourn_players']
        unknown = event['unknown']
        trn_name = event['trn_name']

        # Send updated player data to WebSocket
        # user = self.scope.get("user", None)
        # if user:
        #     print('username: ', user.username)
        # else:
        #     print("no user")
        self.send(text_data=json.dumps({
            'type': 'tourn',
            'players': players,
            'unknown': unknown,
            'trn_name': trn_name,
        }))

    def start_matche(self, event):
        trn_id = event['trn_id']
        refresh = event['refresh']
        trn = tournament.objects.get(id=trn_id)
        self.send_matche_start(trn, refresh)
    
    def send_matche_start(self, trn: tournament, refresh):
        user = self.scope.get("user", None)
        m_res = 'win'
        print('send start_matche to user: {}'.format(user.username,
                    ), flush=True)
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


        self.send(text_data=json.dumps({
            'type': 'matche',
            'm_res': m_res,
            'refresh': refresh,
            'matches': trn_matches,
        }))

        