from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rentfurlax.models import *
from rentfurlax.serializers import *
from django.contrib.auth.models import User # new
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, authenticate, logout #add this
from django.contrib import messages, auth
from rest_framework.views import APIView
# Create your views here.
#https://www.bezkoder.com/django-mongodb-crud-rest-framework/
#https://blog.logrocket.com/django-rest-framework-create-api/
#source ./django_env/bin/activate
from rest_framework import permissions
from rest_framework import views
from rest_framework.response import Response
class LoginView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        print('--------')
        print(serializer)
        print('--------')
        data={}
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            print(user)
            print(request)
            #login(request, user)
            data['message'] ='success'
        except Exception as e:
            print()
            print('e',str(e))
            data['message'] = serializer.errors['non_field_errors'][0]
        return Response(data, status=status.HTTP_202_ACCEPTED)
    
@api_view(['GET', 'POST'])
def profile(request):
    if request.method == 'GET':
        objs = Profile.objects.all()
        serializer = ProfileSerializer(objs, many = True)
        return Response(serializer.data)
    else :
        # data = request.data
        # print(data)
        # user = data['user']
        # user = User.objects.create(**user)
        # print(user.id, user.username)
        # profile =  Profile.objects.create(user=user, phone =data['phone'], address=data['address'] )
        # serializer = ProfileSerializer(profile)
        # return Response(serializer.data)
        print(request.data)
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages,
                        status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def category(request):
    if request.method == 'GET':
        objs = Category.objects.all()
        serializer = CategorySerializer(objs, many = True)
        return Response(serializer.data)
    else :
        data = request.data
        print(data)
        serializer = CategorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

@api_view(['GET'])
def furnitureBycategory(request, category):
    print('furniture by category', category)
    categoryobj = Category.objects.get(type=category)
    objs = Furniture.objects.filter(category=categoryobj)
    print(objs)
    serializer = FurnitureSerializer(objs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def furnitureByid(request, id):
    print('furniture by id',id)
    # categoryobj = Category.objects.get(type=category)
    objs = Furniture.objects.get(pk=id)
    print(objs)
    serializer = FurnitureSerializer(objs)
    return Response(serializer.data)

@api_view(['GET','POST'])
def furniture(request):
    print('furniture', request.method)
    if request.method == 'GET':
        objs = Furniture.objects.all()
        print(objs)
        serializer = FurnitureSerializer(objs, many = True)
        return Response(serializer.data)
    else :
        print('POST else')
        data = request.data
        print(data)
        serializer = FurnitureSerializer(data=data)
        if serializer.is_valid():
            serializer.create(validated_data=data)
            return Response(serializer.data)
        return Response(serializer.errors)
    
@api_view(['GET','POST'])
def invoice(request):
    if request.method == 'GET':
        objs = Invoice.objects.all()
        serializer = InvoiceSerializer(objs, many = True)
        return Response(serializer.data)
    else :
        print('POST else')
        data = request.data
        print(data)
        serializer = InvoiceSerializer(data=data)
        print('serializer', serializer)
        print('---------------------')
        if serializer.is_valid():
            print('is valid')
            serializer = InvoiceSerializer(serializer.create(validated_data=data))
            print('data', serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors)
    
@api_view(['GET'])
def invoiceByUser(request, username):
    print(username)
    status = request.query_params.get('status')
    print(status)
    user = User.objects.get(username=username)
    print('user',user)
    if status is None:
        objs = Invoice.objects.filter(customer=user)
    else:
         objs = Invoice.objects.filter(customer=user,status=status )
    print(objs)
    serializer = InvoiceSerializer(objs, many=True)
    return Response(serializer.data)