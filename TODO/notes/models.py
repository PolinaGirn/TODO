from django.db import models

# Create your models here.
from django.db import models
from TODO.users.models import User


class Project(models.Model):
    title = models.CharField(max_length=64, unique=True)
    users = models.ManyToManyField(User)
    link_repo = models.URLField(blank=True)


class ToDo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    text = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)






