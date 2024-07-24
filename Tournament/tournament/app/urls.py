from django.urls import path, include
from . import views, matches

urlpatterns = [
    path('api/', views.play_tournament),
    path('is_inTourn/', views.is_intorn),
    path('tourn_hover/', views.tourn_info),
    # path('matches', matches.start_matche, name='start_matche'),
]
