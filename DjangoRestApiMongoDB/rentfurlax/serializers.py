from rest_framework import serializers 
from rentfurlax.models import *
from django.contrib.auth.models import User 
from datetime import date, datetime
from datetime import timedelta
from django.contrib.auth import login, authenticate, logout #add this

class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        # This will be used when the DRF browsable API is enabled
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        print('validate')
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                print(1)
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            print(2)
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        print(user)
        attrs['user'] = user
        print(attrs)
        return attrs
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = '__all__' 
        #extra_kwargs = {'password': {'write_only': True}}

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = '__all__'
        depth=1

    def create(self, validated_data):
        """
        Overriding the default create method of the Model serializer.
        :param validated_data: data containing all the details of profile
        :return: returns a successfully created profile record
        """
        print('\n*************** PROFILE create ****************\n')
        user_data = validated_data.pop('user')
        print(user_data)
        try:
            user = UserSerializer.create(UserSerializer(),validated_data=user_data)
            print('user ',user)
            user.set_password(user.password)
            user.save()
            profile = Profile.objects.update_or_create(user=user, phone =validated_data.pop('phone'), 
            address=validated_data.pop('address'))
        except Exception as e:
            print('error')
        return profile

        
class CategorySerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Category
        fields = '__all__'
      
class RentalOptionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RentalOptions
        fields = ['tenure', 'ratepermonth','id']
        depth = 1
    

class FurnitureSerializer(serializers.ModelSerializer):
    #serializers.PrimaryKeyRelatedField(many=True, 
    #                             read_only=False,queryset=FurnitureOptions.objects.all())
    rentaloptions = RentalOptionsSerializer(many=True)
    #serializers.PrimaryKeyRelatedField(many=True, 
     #                           read_only=False,queryset=RentalOptions.objects.all())
    

    class Meta:
        model = Furniture
        fields='__all__'#('name','description','noofdays','condition','furnitureOptions','rentalOptions')
        # depth=1
    def create(self, validated_data):
        print('\n************** CREATE *****************\n')
        print(validated_data)
        # furnitureOptions = validated_data.pop('furnitureoptions')
        rentalOptions = validated_data.pop('rentaloptions')
        print()
        print(rentalOptions)
        print()
        category = validated_data.pop('category')
        category = Category.objects.get(type=category)
        print('category ', category)
        furniture_instance = Furniture.objects.create(category=category,**validated_data)
        for roptions in rentalOptions:
            RentalOptions.objects.create(furniture=furniture_instance,**roptions)
        print('\n*******************************\n')
        return furniture_instance
    
class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields =['quantity','rentalOptions']

class InvoiceSerializer(serializers.ModelSerializer):
    lineitem = LineItemSerializer(required=True, many=True)
    
    class Meta:
        model = Invoice
        fields= ['customer','lineitem']
        depth=1


    def to_representation(self, instance):
        print('rep',instance.customer)
        representation = super(InvoiceSerializer, self).to_representation(instance)
        representation['orderdate'] = instance.orderdate
        representation['status'] = instance.status
        representation['invoiceamount'] = instance.invoiceamount
        representation['customer'] = instance.customer.username
        representation['deliveryaddress'] = instance.deliveryaddress
        representation['id'] = instance.id

        return representation
    
    def create(self, validated_data):
        print('\n************** CREATE INVOICE*****************\n')
        print(validated_data)
        lineItems = validated_data.pop('lineitem')
        print()
        print(lineItems)
        print()
        customer = validated_data.pop('customer')
        print(customer)
        username = customer['username']
        customer = User.objects.get(username=username)
        print('customer ', customer)
        profile = Profile.objects.get(user=customer)
        print('profile',profile)
        orderdate = datetime.now().strftime("%Y-%m-%d")
        print(orderdate)
        invoice_instance = Invoice.objects.create(customer=customer,
                        **validated_data, status='ORDERED', deliveryaddress=profile.address,
                        orderdate = orderdate, invoiceamount=0 )
        sum = 0
        for lineitem in lineItems:
            rentalobj = RentalOptions.objects.get(id=lineitem['rentalOptions'])
            ratepermonth = rentalobj.ratepermonth
            noofdays = rentalobj.furniture.noofdays
            qty = lineitem['quantity']
            total = qty * ratepermonth
            deliverydate = date.today() + timedelta(days = noofdays)
            deliverydate = deliverydate.strftime("%Y-%m-%d")
            print(deliverydate)
            LineItem.objects.create(invoice=invoice_instance,
                                    rentalOptions= rentalobj,
                                    total=total, quantity = qty,
                                deliverydate=deliverydate)
            sum += total
        print(invoice_instance.id)
        Invoice.objects.filter(pk=invoice_instance.id).update(invoiceamount=sum)
        invoice_instance = Invoice.objects.get(id=invoice_instance.id)
        print('\n*******************************\n')
        return invoice_instance