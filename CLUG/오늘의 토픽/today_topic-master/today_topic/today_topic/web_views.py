from django.views.generic.base import TemplateView
from today_topic.utils import get_topics


class IndexView(TemplateView):
    template_name = 'today_topic/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        category = kwargs.get('category')
        if category is not None:
            context['topics'] = get_topics(8, category)
        return context
