from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('today_topic.api_urls', namespace='api')),
    path('site/', include('today_topic.web_urls', namespace='site')),
]

# 정적 파일 Root 경로 등록
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
