from django.db import models
from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta


class DailyStats(models.Model):
    """Günlük istatistikleri cache'ler"""
    
    date = models.DateField(unique=True)
    total_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    total_entries = models.IntegerField(default=0)
    new_entries = models.IntegerField(default=0)
    avg_words_learned = models.FloatField(default=0)

    class Meta:
        verbose_name = 'Günlük İstatistik'
        verbose_name_plural = 'Günlük İstatistikler'
        ordering = ['-date']

    def __str__(self):
        return f"İstatistik: {self.date}"