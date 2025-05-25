from django.db import models
# from django.forms import JSONField

class UserChatbot(models.Model):
    DATA_SOURCE_CHOICES = [
        ('text', 'Text'),
        ('document', 'Document'),
        ('url', 'URL'),
    ]


    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    data_source = models.CharField(max_length=20, choices=DATA_SOURCE_CHOICES, null=False)
    vector_store_path = models.CharField(max_length=500, blank=True, null=True)
    icon = models.CharField(max_length=255, blank=True, null=True)
    icon_image = models.BinaryField(null=True)
    starter_messages = models.JSONField(default=dict)  # Removed 'null' and added a default
    quick_actions = models.JSONField(default=dict)  # Removed 'null' and added a default
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    user_id = models.IntegerField(null=False)
    theme = models.CharField(max_length=50, choices=[('light', 'Light'), ('dark', 'Dark')], null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name or f"Chatbot {self.id}"