from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from today_topic.utils import get_topics

import json


# category list
category_kor = ['모든토픽', '엔터테이먼트', '정치', '경제', '사회', 'IT', '세계']
category_eng = ['all', 'entertainment', 'politics', 'economics', 'society', 'it', 'world']


def keyboard(request):
    return JsonResponse({
        'type': 'buttons',
        'buttons': category_kor
    })


@csrf_exempt  # Django에서 Post 방식을 사용했을 때 에러 방지
def message(request):
    # 사용자에게 입력받은 버튼 추출
    request_law = ((request.body).decode('utf-8'))
    request_json = json.loads(request_law)
    category = request_json['content']
    num_of_topic = 5

    # convert kor category to eng category
    index = category_kor.index(category)
    category = category_eng[index]

    # get topic list
    topics = get_topics(num_of_topic, category)

    # trim text for chatbot
    topics_for_response = '인공지능기반 실시간 트랜드 TOP 5\n\n'
    for topic in topics:
        topics_for_response += topic['title'] + '\n'
        topics_for_response += topic['url'] + '\n\n'

    return JsonResponse({
        'message': {
            'text': topics_for_response,
            "message_button": {
                "label": "웹으로 보기",
                "url": "http://13.209.97.110/site/"}
        },
        'keyboard': {
            'type': 'buttons',
            'buttons': category_kor
        }
    })
