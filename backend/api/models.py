# We're using MongoDB directly, so we don't need Django models
# This file can be empty or contain minimal models if needed
from django.db import models

class Transaction(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    amount = models.FloatField()
    status = models.CharField(max_length=20)
    score = models.FloatField()
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.id} - {self.status}" 