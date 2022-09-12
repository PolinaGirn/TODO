from django.test import TestCase

# Create your tests here.

from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer

from users.models import User
from users.views import UserModelViewSet
from notes.views import ProjectModelViewSet, ToDoModelViewSet
from notes.models import Project, ToDo


class TestUserViewSet(TestCase):

    def setUp(self) -> None:
        self.url = '/api/users/'
        self.users_dict = {'username': 'Alex', 'email': 'Alex@gmail.com', 'password': 'Alex_12345'}
        self.users_dict_fake = {'username': 'Alex777', 'email': 'Alex777@gmail.com', 'password': 'Alex_777'}
        self.admin = User.objects.create_superuser('Lina', 'lina000805@gmail.com', 'Qwerty123!')
        self.admin_fake = {'username': 'admin777', 'email': 'admin777@gmail.com', 'password': 'admin_777'}
        self.format = 'json'
        self.users = User.objects.create(**self.users_dict)

    def test_factory_get_list(self):
        factory = APIRequestFactory()
        request = factory.get(self.url)
        view = UserModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_factory_create_guest(self):
        factory = APIRequestFactory()
        request = factory.post(self.url, self.users_dict, format=self.format)
        view = UserModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_factory_create_admin(self):
    #     factory = APIRequestFactory()
    #     request = factory.post(self.url, self.users_dict, format=self.format)
    #     force_authenticate(request, self.admin)
    #     view = UserModelViewSet.as_view({'post': 'create'})
    #     response = view(request)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_api_client_detail(self):
        client = APIClient()
        response = client.get(f'{self.url}{self.users.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_client_update_guest(self):
        client = APIClient()
        response = client.put(f'{self.url}{self.users.id}/', **self.users_dict_fake)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        pass


class TestUser(APITestCase):
    def setUp(self) -> None:
        self.url = '/api/users/'
        self.users_dict = {'username': 'Alex', 'email': 'Alex@gmail.com', 'password': 'Alex_12345'}
        self.users_dict_fake = {'username': 'Alex777', 'email': 'Alex777@gmail.com', 'password': 'Alex_777'}
        self.admin = User.objects.create_superuser('Lina', 'lina000805@gmail.com', 'Qwerty123!')
        self.admin_fake = {'username': 'admin777', 'email': 'admin777@gmail.com', 'password': 'admin_777'}
        self.format = 'json'
        self.users = User.objects.create(**self.users_dict)

    def test_api_test_case_update_admin(self):
        # self.client.login(username='Lina', password='Qwerty123!')
        self.client.force_login(user=self.admin)
        response = self.client.put(f'{self.url}{self.admin.id}/', self.admin_fake, format=self.format)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.admin.refresh_from_db()
        self.assertEqual(self.admin.username, self.admin_fake.get('username'))
        self.client.logout()

    def test_mixer(self):
        user = mixer.blend(User)
        self.client.force_login(user=self.admin)
        response = self.client.put(f'{self.url}{user.id}/', self.users_dict_fake, format=self.format)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()
        self.assertEqual(user.username, self.users_dict_fake.get('username'))
        self.client.logout()

    def tearDown(self) -> None:
        pass
