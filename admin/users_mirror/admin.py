from django.contrib import admin
from django.utils.html import format_html
from .models import User, DiaryEntry


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        'email', 'name', 'role', 'provider',
        'email_verified', 'get_diary_count',
        'last_login_at', 'created_at'
    ]
    list_filter = ['role', 'provider', 'email_verified']
    search_fields = ['email', 'name']
    readonly_fields = [
        'id', 'email', 'name', 'role', 'provider',
        'profile_picture', 'email_verified',
        'last_login_at', 'created_at', 'updated_at'
    ]
    ordering = ['-created_at']

    @admin.display(description='Günlük Sayısı')
    def get_diary_count(self, obj):
        try:
            count = obj.diary_entries.count()
            color = 'green' if count > 5 else 'orange' if count > 0 else 'red'
            return format_html(
                '<span style="color: {}; font-weight: bold;">{} günlük</span>',
                color, count
            )
        except Exception:
            return '-'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(DiaryEntry)
class DiaryEntryAdmin(admin.ModelAdmin):
    list_display = [
        'get_user_email', 'entry_date', 'ielts_level',
        'get_word_count', 'get_has_image', 'created_at'
    ]
    list_filter = ['ielts_level']
    search_fields = ['user__email', 'original_text']
    readonly_fields = [
        'id', 'user', 'original_text', 'rewritten_text',
        'ielts_level', 'new_words', 'image_url',
        'entry_date', 'created_at', 'updated_at'
    ]
    date_hierarchy = 'entry_date'
    ordering = ['-entry_date']

    @admin.display(description='Kullanıcı')
    def get_user_email(self, obj):
        return obj.user.email

    @admin.display(description='Yeni Kelime')
    def get_word_count(self, obj):
        count = len(obj.new_words) if obj.new_words else 0
        return format_html(
            '<span style="color: purple; font-weight: bold;">{} kelime</span>',
            count
        )

    @admin.display(description='Resim')
    def get_has_image(self, obj):
        if obj.image_url:
            return format_html('<span style="color: green;">✓ Var</span>')
        return format_html('<span style="color: gray;">✗ Yok</span>')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser