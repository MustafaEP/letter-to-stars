from django.contrib import admin
from django.db.models import Count, Avg, Sum
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta
from users_mirror.models import User, DiaryEntry
from .models import DailyStats


class AnalyticsDashboard(admin.ModelAdmin):
    """Ana analytics dashboard"""

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_site.admin_view(self.dashboard_view), name='analytics-dashboard'),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        last_7_days = now - timedelta(days=7)

        # Genel istatistikler
        total_users = User.objects.count()
        total_entries = DiaryEntry.objects.count()
        
        # Son 30 gün
        new_users_30d = User.objects.filter(created_at__gte=last_30_days).count()
        new_entries_30d = DiaryEntry.objects.filter(created_at__gte=last_30_days).count()

        # Son 7 gün
        new_users_7d = User.objects.filter(created_at__gte=last_7_days).count()
        new_entries_7d = DiaryEntry.objects.filter(created_at__gte=last_7_days).count()

        # IELTS dağılımı
        ielts_distribution = (
            DiaryEntry.objects
            .values('ielts_level')
            .annotate(count=Count('id'))
            .order_by('ielts_level')
        )

        # En aktif kullanıcılar
        top_users = (
            User.objects
            .annotate(entry_count=Count('diary_entries'))
            .filter(entry_count__gt=0)
            .order_by('-entry_count')[:10]
        )

        # Provider dağılımı
        provider_stats = (
            User.objects
            .values('provider')
            .annotate(count=Count('id'))
        )

        context = {
            'title': 'Analytics Dashboard',
            'total_users': total_users,
            'total_entries': total_entries,
            'new_users_30d': new_users_30d,
            'new_entries_30d': new_entries_30d,
            'new_users_7d': new_users_7d,
            'new_entries_7d': new_entries_7d,
            'ielts_distribution': ielts_distribution,
            'top_users': top_users,
            'provider_stats': provider_stats,
            'opts': self.model._meta,
        }
        return render(request, 'analytics/dashboard.html', context)


@admin.register(DailyStats)
class DailyStatsAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'total_users', 'new_users',
        'active_users', 'total_entries', 'new_entries'
    ]
    ordering = ['-date']