from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.


class User(AbstractUser):
    # username = models.CharField(max_length=64, unique=True)
    # password = models.CharField(max_length=64, default='')
    # first_name = models.CharField(max_length=64)
    # last_name = models.CharField(max_length=64)
    email = models.CharField(max_length=64, unique=True)
