from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('done', 'Done'), 
        ('redo', 'Redo'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    last_updated_by = models.ForeignKey( 
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_tasks",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.IntegerField(default=0)
    def __str__(self):
        return self.title
