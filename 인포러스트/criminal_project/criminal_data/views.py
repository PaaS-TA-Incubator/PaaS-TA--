from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.generic.base import TemplateView

# Create your views here.
def index(request):
    return render(request, 'index.html', {})

def join(request):
    return render(request, 'join.html', {})

def login(request):
    return render(request, 'login.html', {})
