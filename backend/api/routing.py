from django.urls import re_path
from .consumers import LikeConsumer

websocket_urlpatterns = [
    re_path(r"ws/like/$", LikeConsumer.as_asgi()),
]
