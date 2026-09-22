from rest_framework import serializers
from student.models import StudentDetails,RoomDetails
from django.contrib.auth.models import User

class AdminStudentData(serializers.Serializer):
    usn = serializers.CharField()
    roomno = serializers.CharField()
    std_name = serializers.CharField()
    std_email = serializers.EmailField()
    std_fname = serializers.CharField()
    std_mname = serializers.CharField()
    mobile_no = serializers.CharField()
    gender = serializers.CharField()
    dob = serializers.DateField()
    profile_pic = serializers.ImageField(required=False)
    address = serializers.CharField()


    def validate_mobile_no(self,data):
        if len(data) != 10 or not data.isdigit():
            raise serializers.ValidationError("Invalid Mobile Number")

        if StudentDetails.objects.filter(mobile_no=data).exists():
            raise serializers.ValidationError("Mobile number already exists")

        return data

    def validate_usn(self, data):
        if StudentDetails.objects.filter(usn__username=data).exists():
            raise serializers.ValidationError("This User already exists")

        return data

    def validate_roomno(self, data):
        try:
            room = RoomDetails.objects.get(roomno = data)
        except RoomDetails.DoesNotExist:
            raise serializers.ValidationError('Room does not exists')

        if room.occupied or room.no_occupancy == room.total_occupancy:
            raise serializers.ValidationError('This room is already occupied')

        return data

    def create(self,data):
        usn = data.pop('usn')
        roomno = data.pop('roomno')


        user = User.objects.create_user(username=usn,password="a")
        room = RoomDetails.objects.get(roomno=roomno)


        return StudentDetails.objects.create(usn=user,roomno=room,**data)

    def update(self, instance, validated_data):
        for key,value in validated_data.items():
            setattr(instance,key,value)

        instance.save()
        return instance
    


class AdminComplainSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    usn = serializers.CharField()
    roomno = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    category =serializers.CharField()
    status = serializers.CharField()
    std_name = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def update(self, instance, validated_data):
        for key,value in validated_data.items():
            setattr(instance,key,value)

        instance.save()
        return instance


class AdminRoomDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomDetails
        fields = "__all__"
    