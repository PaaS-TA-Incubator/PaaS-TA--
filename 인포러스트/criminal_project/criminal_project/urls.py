"""criminal_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from criminal_data.views import index
from criminal_data import mysql_views
urlpatterns = [
    #mysql
    url(r'', include('criminal_data.urls')),
    url(r'^cctv_addr/?$', mysql_views.send_cctv_address, name='send_cctv_address'),
    url(r'^safety_addr/?$', mysql_views.send_safety_address, name='send_safety_address'),
    url(r'^criminal_level/?$', mysql_views.send_criminal_level, name='send_criminal_level'),
    url(r'^login/check_info/?$', mysql_views.login_check, name='login_check'),
    url(r'^join/regist/?$', mysql_views.getJoin, name='getJoin'),


]
