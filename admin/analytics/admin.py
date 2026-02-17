from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.utils import timezone
from django.db.models import Count, Sum, Avg, F
from datetime import timedelta
from users_mirror.models import User, DiaryEntry
from .models import DailyStats


class AnalyticsDashboardAdmin(admin.ModelAdmin):
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'dashboard/',
                self.admin_site.admin_view(self.dashboard_view),
                name='analytics-dashboard'
            ),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        last_7_days = now - timedelta(days=7)

        # ── Genel İstatistikler ──
        total_users = User.objects.count()
        total_entries = DiaryEntry.objects.count()
        new_users_30d = User.objects.filter(created_at__gte=last_30_days).count()
        new_entries_30d = DiaryEntry.objects.filter(created_at__gte=last_30_days).count()
        new_users_7d = User.objects.filter(created_at__gte=last_7_days).count()
        new_entries_7d = DiaryEntry.objects.filter(created_at__gte=last_7_days).count()

        # ── Ortalama Günlük / Kullanıcı ──
        avg_entries = round(total_entries / total_users, 1) if total_users > 0 else 0

        # ── Toplam Öğrenilen Kelime ──
        all_entries = DiaryEntry.objects.all()
        total_words = sum(
            len(e.new_words) for e in all_entries if e.new_words
        )

        # ── IELTS Dağılımı ──
        ielts_raw = (
            DiaryEntry.objects
            .values('ielts_level')
            .annotate(count=Count('id'))
            .order_by('ielts_level')
        )
        max_ielts = max((i['count'] for i in ielts_raw), default=1)
        ielts_distribution = [
            {
                'ielts_level': i['ielts_level'],
                'count': i['count'],
                'percentage': round(i['count'] / max_ielts * 100),
            }
            for i in ielts_raw
        ]

        # ── Provider Dağılımı ──
        provider_raw = (
            User.objects
            .values('provider')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        total_provider = sum(p['count'] for p in provider_raw) or 1
        provider_stats = [
            {
                'provider': p['provider'],
                'count': p['count'],
                'percentage': round(p['count'] / total_provider * 100),
            }
            for p in provider_raw
        ]

        # ── Top 10 Kullanıcı ──
        top_users = (
            User.objects
            .annotate(entry_count=Count('diary_entries'))
            .filter(entry_count__gt=0)
            .order_by('-entry_count')[:10]
        )

        # ── Son 10 Günlük ──
        recent_entries = (
            DiaryEntry.objects
            .select_related('user')
            .order_by('-created_at')[:10]
        )

        context = {
            **self.admin_site.each_context(request),
            'title': 'Analytics Dashboard',
            'total_users': total_users,
            'total_entries': total_entries,
            'new_users_30d': new_users_30d,
            'new_entries_30d': new_entries_30d,
            'new_users_7d': new_users_7d,
            'new_entries_7d': new_entries_7d,
            'avg_entries_per_user': avg_entries,
            'total_words': total_words,
            'ielts_distribution': ielts_distribution,
            'provider_stats': provider_stats,
            'top_users': top_users,
            'recent_entries': recent_entries,
        }
        return render(request, 'analytics/dashboard.html', context)


@admin.register(DailyStats)
class DailyStatsAdmin(AnalyticsDashboardAdmin):
    list_display = ['date', 'total_users', 'new_users', 'total_entries', 'new_entries']
    ordering = ['-date']