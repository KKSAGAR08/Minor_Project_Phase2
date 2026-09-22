from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Complaint,RoomDetails,Attendence1
from django.contrib.auth.models import User

class StudentAuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class StudentComplainSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    usn = serializers.CharField()
    roomno = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    category =serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def validate_usn(self, data):
        try:
            return User.objects.get(username=data)
        except User.DoesNotExist as e:
            raise serializers.ValidationError('User Not found')

    def validate_roomno(self, data):
        try:
            return RoomDetails.objects.get(roomno=data)
        except RoomDetails.DoesNotExist as e:
            raise serializers.ValidationError('Room Not Found')

    def validate(self, data):
        data = super().validate(data)

        user = data.get('usn')

        roomno = user.studentdetails.roomno

        if roomno != data['roomno']:
            raise serializers.ValidationError('Student details not matching with RoomNo')

        return data
        

    def create(self,data):
        return Complaint.objects.create(**data)


class StudentAttendenseSerializer(serializers.Serializer):
    usn = serializers.CharField()
    roomno = serializers.CharField()
    checkOutDate = serializers.DateField()
    expCheckInDate = serializers.DateField()
    reason = serializers.CharField()
    checkInDate = serializers.DateField()
    additionReason = serializers.CharField()
    isavailable = serializers.BooleanField()
    days = serializers.IntegerField()
    payment = serializers.BooleanField()


    def validate_usn(self, data):
        try:
            return User.objects.get(username=data)
        except User.DoesNotExist as e:
            raise serializers.ValidationError('User Not found')
    
    def validate_roomno(self, data):
        try:
            return RoomDetails.objects.get(roomno=data)
        except RoomDetails.DoesNotExist as e:
            raise serializers.ValidationError('Room Not Found')

    def validate_create(self,data):
        data = super().validate(data)

        details = Attendence1.objects.all().last()

        if details and details.isavailable == True:
            raise serializers.ValidationError("You need to checkout before checkin")

        return data

    def create(self,data):
        return Attendence1.objects.create(**data)

    def update(self,instance,validated_data):
        for key,value in validated_data.items():
            setattr(instance,key,value)

        instance.save()
        return instance
    








    

