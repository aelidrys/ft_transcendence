from django.urls import path, include
from . import views, matches

urlpatterns = [
    path('api/', views.play_tournament),
    path('is_inTourn/', views.is_intorn),
    # path('matches', matches.start_matche, name='start_matche'),
]
