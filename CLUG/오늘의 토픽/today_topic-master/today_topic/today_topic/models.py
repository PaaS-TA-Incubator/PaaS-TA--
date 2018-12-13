from django.db import models


class Topic(models.Model):
    title = models.CharField('기사 제목', max_length=100, unique=True)
    category = models.CharField('카테고리', max_length=100)
    rank = models.CharField('기사 랭크 순위', max_length=10)
    content = models.TextField('기사 내용')
    content_html = models.TextField('기사 내용 코드')
    url = models.TextField('원문 링크')
    date = models.CharField('', max_length=30)

    def __str__(self):
        return self.title

