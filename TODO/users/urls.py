from django.urls import path, include
from .views import UserListAPIView

app_name = 'users'

urlpatterns = [
    # path('api/<str:version>/users/', UserListAPIView.as_view()),
    path('', UserListAPIView.as_view()),
]


