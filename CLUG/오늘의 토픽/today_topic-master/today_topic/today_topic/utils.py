from django.forms.models import model_to_dict
from today_topic.models import Topic


# get topic list
def get_topics(count, category):
    topic_objects = Topic.objects.filter(category=category)[:count]
    topics = list()

    for topic_object in topic_objects:
        topic = model_to_dict(topic_object)
        topics.append(topic)

    return topics
