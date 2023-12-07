
from django.urls import path
from rentfurlax.views import *

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('register/', profile),
    path('category/', category),
    path('furniture/', furniture),
    path('furniture/<category>', furnitureBycategory),
    path('item/<id>', furnitureByid),
    path('invoice/', invoice),
    path('invoice/<username>', invoiceByUser)
]