# -*- coding: utf-8 -*-
from django.views.decorators.http import require_POST
from django.http import HttpResponse
# from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.db import connections
from django.shortcuts import redirect
import json

import sys
import urllib

def make_connection():
    db_type = 'default'
    cursor = connections[db_type].cursor()
    return cursor

class JSONResponse(HttpResponse):

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)
@csrf_exempt
def send_cctv_address(request):
    cursor = make_connection()
    if request.method == 'GET':
        address = request.GET['address']
        cursor.execute('select lng, lot from {0}_cctv;'.format(address))
        loca = make_cctv_location(cursor)
        cursor.close()
        return JSONResponse(loca, status=200)

@csrf_exempt
def send_safety_address(request):
    cursor = make_connection()
    if request.method == 'GET':
        address = request.GET['address']

        cursor.execute('select * from {0}_safetyzone;'.format(address))
        loca = make_safety_location(cursor)
        cursor.close()

        return JSONResponse(loca, status=200)
@csrf_exempt
def send_criminal_level(request):
    cursor = make_connection()

    #2.2.1. 조직 및 그룹(하위조직) 리스트 요청

    if request.method == 'GET':
        # address = request.GET['address'].decode('cp949').encode('utf-8')
        address = request.GET['address']
        # sys.stderr.write(address)
        # address = urllib.unquote(address)
        # sys.stderr.write(address)
        cursor.execute('select criminal_counts, criminal_level from {0}_criminal;'.format(address))
        loca = make_criminal_level(cursor)
        cursor.close()

        return JSONResponse(loca, status=200)
@csrf_exempt
def getJoin(request):
    cursor = make_connection()
    if request.method == 'POST':
        id = request.POST['id']
        password = request.POST['password']
        category = request.POST['category']
        emergency = request.POST['tel']
        sys.stderr.write(id + '\n')
        sys.stderr.write(password+ '\n')
        sys.stderr.write(category+ '\n')
        sys.stderr.write(emergency+ '\n')
        sql ='insert into user(id, password, emergency_category, emergency_phone) values (\"{0}\", \"{1}\", \"{2}\", \"{3}\");'.format(id, password, category, emergency)
        cursor.execute(sql)
        cursor.close()
        return JSONResponse({}, status=201)

@csrf_exempt
def login_check(request):
    cursor = make_connection()
    if request.method == 'POST':
        id = request.POST['id']
        password = request.POST['password']
        sys.stderr.write(id+ '\n')
        sys.stderr.write(password+ '\n')
        sys.stderr.write(str(request.session)+ '\n')

        sql = 'select * from user where id = \"{0}\"'.format(id)
        cursor.execute(sql)
        info = cursor.fetchall()
        sys.stderr.write('suuuuuuuuuuuuuu0' + '\n')

        data = [
            {'id' : info[0][0], 'password' : info[0][1], 'category' : info[0][2], 'emergency' : info[0][3] }
        ]
        cursor.close()
        return JSONResponse(json.loads(json.dumps(data)), status=201)

        # if login_info == False :
        #     cursor.close()
        #     return redirect('/login/')
        # else :
        #     cursor.close()
        #     return JSONResponse(login_info, status=200)
def make_cctv_location(cursor):
    rows = cursor.fetchall()
    data = [
        {'lng' : lng, 'lat' : lat} for lng, lat in rows
    ]
    return json.loads(json.dumps(data))
# -*- coding: utf-8 -*-
def make_safety_location(cursor):
    rows = cursor.fetchall()
    data = [
        {'name': name, 'address': address, 'lat': lat, 'lng' : lng} for _, name, address, lat, lng in rows
    ]
    return json.loads(json.dumps(data))
def make_criminal_level(cursor):
    rows = cursor.fetchall()
    data = [
        {'criminal_counts' : counts, 'criminal_level' : level} for counts, level in rows
    ]
    return json.loads(json.dumps(data))
