from django.shortcuts import render
# Create your views here.
from rest_framework.permissions import BasePermission
from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserModelSerializer, UserModelCustomSerializer


# class SuperUserOnly(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_superuser


class UserModelViewSet(ModelViewSet):
    # renderer_classes = [JSONRenderer]
    queryset = User.objects.all()
    serializer_class = UserModelSerializer


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer

    def get_serializer_class(self):
        if self.request.version == 'v1':
            return UserModelCustomSerializer
        else:
            return UserModelSerializer
