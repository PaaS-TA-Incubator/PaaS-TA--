from today_topic.models import Topic

import json
import requests


# convert long url to short url
def get_short_url(long_url):
    # json request
    url = 'http://surl.kr/Api/create.php'
    params = {
        'type': 'json',
        'longUrl': long_url
    }
    res = requests.get(url, params=params)

    # convert json to dictionary
    res_data = json.loads(res.text)

    return res_data['shortUrl'] if res_data['status'] == 'success' else res_data['longUrl']


# update topic list
def set_topics():
    print('starting requests...')
    category_list = ['all', 'entertainment', 'politics', 'economics', 'society', 'it', 'world']

    # delete all topics
    queryset = Topic.objects.all()
    queryset.delete()

    # request topic_list for all categories
    for category in category_list:
        url = 'http://api.datamixi.com/datamixiApi/topictoday'
        params = {
            'key': '3082028134077943630',
            'count': 8,
            'category': category
        }
        res = requests.get(url, params=params)

        # convert json to dictionary
        res_data = json.loads(res.text)
        docus = res_data['document']

        # insert new topics
        for docu in docus:
            # adjust data format
            date = docu['date']  # 기사 발행일
            date = date[0:4] + '-' + date[4:6] + '-' + date[6:8] + ' ' \
                   + date[8:10] + ':' + date[10:12]
            docu['orgUrl'] = get_short_url(docu['orgUrl'])

            topic = Topic(
                title=docu['title'],
                category=category,
                rank=docu['rank'],
                content=docu['content'],
                content_html=docu['pub_html'],
                url=docu['orgUrl'],
                date=date,
            )
            topic.save()
            print(str(topic.pk) + ' created')
    print('request finished!')


def run():
    set_topics()
