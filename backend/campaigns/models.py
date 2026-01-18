from django.db import models
from django.contrib.auth.models import User

class Campaign(models.Model):
    PLATFORM_CHOICES = [
        ("instagram", "Instagram"),
        ("youtube", "YouTube"),
        ("facebook", "Facebook"),
        ("google", "Google"),
    ]

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("running", "Running"),
        ("paused", "Paused"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="campaigns")

    title = models.CharField(max_length=255)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    budget_inr = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
