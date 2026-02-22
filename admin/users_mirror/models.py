from django.db import models


class User(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50, default='USER')
    provider = models.CharField(max_length=50, default='LOCAL')
    profile_picture = models.TextField(
        null=True, blank=True,
        db_column='profilePicture'
    )
    email_verified = models.BooleanField(
        default=False,
        db_column='emailVerified'
    )
    last_login_at = models.DateTimeField(
        null=True, blank=True,
        db_column='lastLoginAt'
    )
    created_at = models.DateTimeField(db_column='createdAt')
    updated_at = models.DateTimeField(db_column='updatedAt')

    class Meta:
        managed = False
        db_table = 'User'
        verbose_name = 'Kullanıcı'
        verbose_name_plural = 'Kullanıcılar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name or 'İsimsiz'} ({self.email})"


class DiaryEntry(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        db_column='userId',
        related_name='diary_entries'
    )
    original_text = models.TextField(db_column='originalText')
    rewritten_text = models.TextField(
        db_column='rewrittenText',
        null=True, blank=True
    )
    ielts_level = models.IntegerField(db_column='ieltsLevel')
    new_words = models.JSONField(
        db_column='newWords',
        default=list
    )
    grammar_corrections = models.JSONField(
        db_column='grammarCorrections',
        null=True, blank=True,
        default=list
    )
    writing_tips = models.JSONField(
        db_column='writingTips',
        null=True, blank=True,
        default=list
    )
    strengths = models.JSONField(
        db_column='strengths',
        null=True, blank=True,
        default=list
    )
    weaknesses = models.JSONField(
        db_column='weaknesses',
        null=True, blank=True,
        default=list
    )
    overall_feedback = models.TextField(
        db_column='overallFeedback',
        null=True, blank=True
    )
    image_url = models.TextField(
        db_column='imageUrl',
        null=True, blank=True
    )
    entry_date = models.DateField(db_column='entryDate')       # ← DateField (date tipi)
    created_at = models.DateTimeField(db_column='createdAt')   # ← DateTimeField (timestamp)
    updated_at = models.DateTimeField(db_column='updatedAt')   # ← DateTimeField (timestamp)

    class Meta:
        managed = False
        db_table = 'Diary'
        verbose_name = 'Günlük Kaydı'
        verbose_name_plural = 'Günlük Kayıtları'
        ordering = ['-entry_date']

    def __str__(self):
        try:
            return f"{self.user.email} - {self.entry_date.strftime('%d/%m/%Y')}"
        except Exception:
            return f"Günlük {self.id}"