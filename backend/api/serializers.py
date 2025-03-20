from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.Serializer):
    id = serializers.CharField()
    sender = serializers.CharField()
    receiver = serializers.CharField()
    amount = serializers.FloatField()
    status = serializers.CharField()
    score = serializers.FloatField()
    explanation = serializers.CharField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    timestamp = serializers.DateTimeField()

class TransactionRequestSerializer(serializers.Serializer):
    sender = serializers.CharField()
    receiver = serializers.CharField()
    amount = serializers.FloatField()
    description = serializers.CharField(required=False, allow_blank=True) 