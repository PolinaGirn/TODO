from mixer.backend.django import mixer
from django.core.management.base import BaseCommand

from notes.models import Project, ToDo, User


class Command(BaseCommand):
    help = 'Create project and todo'

    def handle(self, *args, **options):
        user = User.objects.filter(username='Lina').first()
        if not user:
            User.objects.create_seperuser(username='Lina', password='Qwerty123!', email='lina000805@gmail.com')

        for i in range(5):
            mixer.blend(Project)
            mixer.blend(ToDo)
        print('done')
