from django.urls import path
from today_topic import web_views


app_name = 'site'
urlpatterns = [
    path('', web_views.IndexView.as_view(), name='index'),
    path('<category>', web_views.IndexView.as_view(), name='detail'),
]
