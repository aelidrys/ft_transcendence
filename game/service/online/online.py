import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import requests
import asyncio
import time
from .match_making_api import get_cmd
from .consts import gameContants as consts
import math
from .player import Player_movment
from .ball import Ball_movment
from .models import *
from asgiref.sync import sync_to_async

task_list = {}
obj_list = {}


async def runtask(id):
    task_list[id] = asyncio.create_task(obj_list[id].loop())

def add_to_task_list(id, p1, p2):
    obj_list[id] = game(id, p1, p2)
    print(f"size --- {len(obj_list)}")


async def connect(game_id, channel_name, side):
    if not game_id in obj_list:
        ValueError("no game for you")
    
    await obj_list[game_id].connect(channel_name, side)
    print (f'con task_list {len(task_list)}')
    return obj_list[game_id].group


class game():
    def __init__(self, id, profile1, profile2):
        self.id = id
        self.group = f"group_for_game_{id}"
        self.pid1 = None
        self.pid2 = None
        self.move_allowed = False
        self.p1mv = Player_movment(
            consts['p1StartingPositionX'],
            consts['p1StartingPositionY'],
            consts["p1StartingPositionX"] + consts['playerW'],
        )
        self.p2mv = Player_movment(
            consts['p2StartingPositionX'],
            consts['p2StartingPositionY'],
            consts["p2StartingPositionX"] - (consts['playerW'] + consts['ballSize']),
        )
        self.ball = Ball_movment()
        self.cl = get_channel_layer()

        self.p1gols = 0
        self.p2gols = 0
        self.profile1 = profile1
        self.profile2 = profile2
        
    async def echo_group(self, task):
        msg = json.dumps(task)
        await self.cl.group_send(self.group, {"type": "chat_message","message": msg})


    async def send_message_by_id(self, task, pid):
        msg = json.dumps(task)
        await self.cl.group_send(self.group, {
            "type": "private_message",
            "id" : pid,
            "message": msg,
        })

    def read_command(self, cmd):
        if cmd['player'] == self.pid1:
            self.p1mv.update_stat(cmd['cmd'], cmd)
        elif cmd['player'] == self.pid2:
            self.p2mv.update_stat(cmd['cmd'], cmd)

    async def connect(self, channel_name, side):
        if side == 1:
            self.pid1 = channel_name
        elif side == 2:
            self.pid2 = channel_name
        await self.cl.group_add(self.group, channel_name)
        await self.identify_players(side)
        await self.update_score()
        if self.move_allowed == True:
            print("allowed on connect")
            await self.activat_movment(self.move_allowed)

    async def loop(self):
        pass
        # i = 0
        # while (True):
        #     print(f"ruuninggggg {i}")
        #     i += 1
        #     await asyncio.sleep(5)
        #     cmd = get_cmd('msg',{"text":f'in_game {i}'})
        #     await self.echo_group(cmd)
        # await self.cl.group_send(self.group, {"type": "save_group_name","message": self.group})
        # await self.identify_players()
        await self.move_objs()
        await self.round_start()
        while(True):
            # cmd = get_cmd('msg',{"text":f'----\nP1 => w = {self.p1mv.movingUP} | s = {self.p1mv.movingDowm}\n P2 => w = {self.p2mv.movingUP} | s = {self.p2mv.movingDowm} \n----'})
            # await self.echo_group(cmd)
            self.p1mv.applay()
            self.p2mv.applay()
            winer = self.ball.applay(self.p1mv, self.p2mv)
            if winer != 0:
                await self.activat_movment(False)
                await self.round_end(winer)
                if self.p1gols == 5 or self.p2gols == 5:
                    stat1 = True if self.p1gols == 5 else False
                    stat2 = True if self.p2gols == 5 else False
                    await self.update_score()
                    await self.makewiner(self.pid1, stat1, self.p1gols, self.p2gols)
                    await self.makewiner(self.pid2, stat2, self.p1gols, self.p2gols)
                    g = await sync_to_async(InGame.objects.get)(pk=self.id)
                    p1 = await sync_to_async(Player.objects.get)(login=g.player1)
                    p2 = await sync_to_async(Player.objects.get)(login=g.player2)
                    await sync_to_async(g.delete)()
                    await sync_to_async(p1.delete)()
                    await sync_to_async(p2.delete)()
                    break
                else:
                    await self.update_score()
                    await self.round_start()
                
            
            await self.move_objs()##message to clients
            await asyncio.sleep(0.02)
        # #     break
      
    async def round_end(self, winner):
        
        await self.activat_movment(False)
        self.p1gols += 1 if winner == 1 else 0
        self.p2gols += 1 if winner == 2 else 0
        dir = 1 if winner == 1 else -1 if winner == 2 else 1
        self.ball.reset(dir)
        self.p1mv.reset()
        self.p2mv.reset()
        await self.move_objs()


    async def round_start(self):
        
        for i in range(3, 0, -1):
            await self.countDown(i)
            await asyncio.sleep(1)
        await self.activat_movment(True)
        await self.countDownEnd()

    async def makewiner(self, pid, stat, p1s,  p2s):
        msg = "Win !!" if stat == True else "Lose !!"
        cmd = get_cmd('match_end',{"msg": msg, "reson" : f"{p1s} - {p2s}"})
        await self.send_message_by_id(cmd ,pid)

    async def update_score(self):
        cmd = get_cmd('update_score',{"p1": self.p1gols, "p2" : self.p2gols})
        await self.echo_group(cmd)
    
    async def countDown(self, time):
        cmd = get_cmd('count_down',{"time": time})
        await self.echo_group(cmd)

    async def countDownEnd(self):
        cmd = get_cmd('count_down_end',{"none": None})
        await self.echo_group(cmd)

    async def identify_players(self, side):
        cmd = get_cmd('pannel',{
                    "login1" : self.profile1.login,
                    "login2" : self.profile2.login,
                    "iamge1" : self.profile1.imageURL,
                    "iamge2" : self.profile2.imageURL,
                })
        if side == 1:
            await self.send_message_by_id(cmd, self.pid1)
        else :
            await self.send_message_by_id(cmd, self.pid2)
        
    async def activat_movment(self, allow):
        self.move_allowed = allow
        cmd = get_cmd('allow_move',{'allowed' : allow})
        await self.echo_group(cmd)
    
    async def move_objs(self):
        cmd = get_cmd(
            'move_objs',
            {
                'p1' : self.p1mv.getY(),
                'p2' : self.p2mv.getY(),
                'ballX': self.ball.getX(),
                'ballY': self.ball.getY(),
            })
        await self.echo_group(cmd)
