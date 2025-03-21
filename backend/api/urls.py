from django.urls import path
from . import views

urlpatterns = [
    path('transaction', views.process_transaction, name='process_transaction'),
    path('status/<str:transaction_id>', views.get_transaction_status, name='get_transaction_status'),
    path('health', views.health_check, name='health_check'),
] 