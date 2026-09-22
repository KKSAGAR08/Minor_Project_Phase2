from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
import cloudinary_storage

choice = [
    ('male','Male'),
    ('female','Female')
]

class RoomDetails(models.Model):
    roomno = models.IntegerField(unique=True)
    room_type = models.CharField(max_length=50)
    occupied = models.BooleanField(default=False)
    no_occupancy = models.IntegerField()
    total_occupancy = models.IntegerField()


    def __str__(self):
        return str(self.roomno)


class StudentDetails(models.Model):
    usn = models.OneToOneField(User,on_delete=models.CASCADE)
    roomno = models.ForeignKey(RoomDetails,on_delete=models.SET_NULL,null=True)
    std_name = models.CharField(max_length=100)
    std_email = models.EmailField(unique=True)
    std_fname = models.CharField(max_length=100)
    std_mname = models.CharField(max_length=100)
    mobile_no = models.CharField(unique=True,max_length=10)
    gender = models.CharField(choices=choice)
    dob = models.DateField()
    profile_pic = CloudinaryField("profile_pic",null=True,blank=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    reseted_password = models.BooleanField(default=False)

    def __str__(self):
        return self.std_name


class Complaint(models.Model):
    usn = models.ForeignKey(User,on_delete=models.CASCADE)
    roomno = models.ForeignKey('RoomDetails',on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20)
    status = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Attendence1(models.Model):
    usn = models.ForeignKey(User,on_delete=models.CASCADE)
    roomno = models.ForeignKey('RoomDetails',on_delete=models.CASCADE)
    checkOutDate = models.DateField(null=True)
    expCheckInDate = models.DateField(null=True)
    reason = models.CharField(max_length=100,null=True)
    checkInDate = models.DateField()
    additionReason = models.TextField()
    isavailable = models.BooleanField(default=True)
    days = models.IntegerField(default=0)
    payment = models.BooleanField(default=False)

    def __str__(self):
        return self.checkInDate.isoformat()


class Rent(models.Model):
    usn = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    roomno = models.ForeignKey('RoomDetails',on_delete=models.SET_NULL,null=True)
    amount = models.FloatField()
    payment_date = models.DateField()
    payment_id = models.CharField(max_length=50)
    reciept_url = models.URLField(blank=True)
    


class PasswordReset(models.Model):
    usn = models.CharField(max_length=30)
    email = models.EmailField()
    token = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True,)

