from django.contrib import admin
from .models import tournament
from .matches import matche, player

admin.site.register(tournament)
admin.site.register(matche)
admin.site.register(player)
