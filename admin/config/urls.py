from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'Yıldızlara Mektup Admin'
admin.site.site_title = 'YM Admin'
admin.site.index_title = 'Yönetim Paneli'

urlpatterns = [
    path('admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)