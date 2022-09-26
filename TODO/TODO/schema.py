import graphene
from graphene import ObjectType
from graphene_django import DjangoObjectType

from users.models import User
from notes.models import ToDo, Project

# class Query(ObjectType):
#     hello = graphene.String(default_value='HI!')
# schema = graphene.Schema(query=Query)

# ---------------------------------------------------------------

# class UserType(DjangoObjectType):
#     class Meta:
#         model = User
#         fields = '__all__'
#
#
# class Query(ObjectType):
#     all_users = graphene.List(UserType)
#
#     def resolve_all_users(root, info):
#         return User.objects.all()
#
#
# schema = graphene.Schema(query=Query)

# ---------------------------------------------------------------


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class Query(ObjectType):
    all_users = graphene.List(UserType)
    all_projects = graphene.List(ProjectType)
    all_todos = graphene.List(ToDoType)

    user_by_id = graphene.Field(UserType, id=graphene.Int(required=True))
    project_by_id = graphene.Field(ProjectType, id=graphene.Int(required=True))
    todo_by_id = graphene.Field(ToDoType, id=graphene.Int(required=True))

    project_by_user_username = graphene.List(ProjectType, username=graphene.String(required=False))

    def resolve_all_users(root, info):
        return User.objects.all()

    def resolve_all_projects(root, info):
        return Project.objects.all()

    def resolve_all_todos(root, info):
        return ToDo.objects.all()


    def resolve_user_by_id(self, info, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    def resolve_project_by_id(self, info, id):
        try:
            return Project.objects.get(id=id)
        except Project.DoesNotExist:
            return None

    def resolve_todo_by_id(self, info, id):
        try:
            return ToDo.objects.get(id=id)
        except ToDo.DoesNotExist:
            return None

    def resolve_project_by_user_username(self, info, username=None):
        projects = Project.objects.all()
        if username:
            projects = projects.filter(users__username=username)
        return projects


class UserMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, id, first_name, last_name):
        user = User.objects.get(pk=id)
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return UserMutation(user=user)


class Mutation(graphene.ObjectType):
    update_user = UserMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

# Все заметки, их проекты и юзеры, относящиеся к этим проектам
# {allTodos{
#     id
#     text
#     project{
#       id
#       name
#       users{
#         id
#         username
#         email
#       }
#     }
#   }
# }

# Проекты одного юзера и заметки к этим проектам
# {
#   projectByUserUsername(username: "Lina"){
#     id
#     name
#     todoSet{
#       text
#     }
#   }
# }

# Изменение имени и фамилии юзера
# mutation
# updateUser
# {
#     updateUser(id: 2, firstName: "Виктор", lastName: "Олегович"){
#     user
# {
#     id
# username
# firstName
# lastName
# }
# }
# }

