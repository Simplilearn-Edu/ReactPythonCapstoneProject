from django.db import models
from django.contrib.auth.models import User # new
from django.db.models.signals import post_save
from django.dispatch import receiver
#https://python.plainenglish.io/user-registration-and-login-authentication-in-django-2f3450479409
# Create your models here.

from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser,BaseUserManager
from django.contrib.auth.models import PermissionsMixin


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True)
    phone = models.TextField(max_length=20, blank=False)
    address = models.CharField(max_length=500, blank=True)
    

class Category(models.Model):
    type = models.CharField(max_length=50)
    def __str__(self) -> str:
        return str(self.id) + " "+ self.type

'''
Furniture
1 jade bed

FO
1 brown queen img1
1 brown king img2

'''

class Furniture(models.Model):
    name=models.CharField(max_length=200)
    description=models.CharField(max_length=500)
    condition=models.CharField(max_length=200)
    noofdays=models.IntegerField() 
    color=models.CharField(max_length=200) #red brown
    size=models.CharField(max_length=100)
    imageurl=models.CharField(max_length=200)
    category=models.ForeignKey(Category, on_delete=models.CASCADE, related_name="category")

    def __str__(self):
        return self.name+" "+self.description[:10]+" "+str(self.noofdays)+" "+self.color+" "+self.size+" "+self.imageurl

class RentalOptions(models.Model):
    tenure=models.IntegerField()
    ratepermonth=models.FloatField()
    furniture=models.ForeignKey(Furniture, on_delete=models.CASCADE, related_name='rentaloptions')

    # def __str__(self):
    #     return str(self.tenure)+" "+str(self.ratepermonth)

class Invoice(models.Model):
    customer=models.ForeignKey(User, on_delete=models.CASCADE, related_name="invoice")
    deliveryaddress=models.TextField()
    orderdate=models.DateField()
    status=models.CharField(max_length=20)
    invoiceamount=models.FloatField()

class LineItem(models.Model):
    invoice=models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="lineitem")
    rentalOptions=models.ForeignKey(RentalOptions, on_delete=models.CASCADE, related_name="lineitem")
    quantity=models.IntegerField()
    total=models.FloatField()
    deliverydate=models.DateField()

