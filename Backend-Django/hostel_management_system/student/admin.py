from django.contrib import admin
from .models import StudentDetails,RoomDetails,Rent,Complaint

admin.site.register(StudentDetails)
admin.site.register(RoomDetails)
admin.site.register(Rent)
admin.site.register(Complaint)
