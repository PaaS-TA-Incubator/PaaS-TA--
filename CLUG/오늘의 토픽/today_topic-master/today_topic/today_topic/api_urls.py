from django.urls import path
from today_topic import api_views


app_name = 'api'
urlpatterns = [
    path('keyboard/', api_views.keyboard, name='keyboard'),
    path('message', api_views.message, name='message'),
]
