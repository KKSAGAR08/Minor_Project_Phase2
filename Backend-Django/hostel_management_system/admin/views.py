from django.contrib.auth.models import User
from django.db import models
from rest_framework.views import APIView
from student.serialize import StudentAuthSerializer
from student.models import Complaint, RoomDetails, StudentDetails
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from .serialize import AdminStudentData,AdminComplainSerializer,AdminRoomDetailsSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.core.mail import send_mail


def assign_room(roomno):
    room = RoomDetails.objects.get(roomno=roomno)
    room.no_occupancy+=1

    if room.no_occupancy == room.total_occupancy:
        room.occupied = True

    room.save()
    return

class AdminAuthentication(APIView):

    def post(self,request):
        serializer = StudentAuthSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = authenticate(request,username=username,password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user=user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },status.HTTP_200_OK)
                        
            else:
                return Response('Invalid Credentials',status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AdminHandling(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):
            serialize = AdminStudentData(data=request.data)

            if serialize.is_valid():
                serialize.save()
                assign_room(roomno=serialize.validated_data.get('roomno'))

                return Response(serialize.data,status=status.HTTP_201_CREATED)

            else:
                return Response(serialize.errors,status.HTTP_406_NOT_ACCEPTABLE)

    def get(self,request):

        try:
            total_student = StudentDetails.objects.count()
            occupied_room = RoomDetails.objects.filter(occupied=True).count()
            total_room = RoomDetails.objects.all()

            serialize = AdminRoomDetailsSerializer(instance=total_room,many=True)


            return Response({
                'username': request.user.username,
                'total_student_count':total_student,
                'occupied_rooms':occupied_room,
                'total_rooms':len(serialize.data),
                'rooms':serialize.data
                },status=status.HTTP_200_OK);

        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)

class AdminStudentHandling(APIView):
    def get(self,request):
        try:
            page = int(request.query_params.get('page',1))
            limit = int(request.query_params.get('limit',10))
            offset = (page-1)*limit

            totalRecords = StudentDetails.objects.all().count()
            totalPages = (totalRecords+limit-1)//limit

            student_records = StudentDetails.objects.all()[offset:offset+limit]

            serialize = AdminStudentData(instance=student_records,many=True)

            return Response({
                'student_record':serialize.data,
                'pagination':{
                    'totalRecords':totalRecords,
                    'totalPages':totalPages,
                    'CurrentPage':page,
                    'limit':limit,
                    'hasNextPage':page < totalPages,
                    'hasPrevPage':page > 1
                },
            },status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e),status=status.HTTP_400_BAD_REQUEST)


class AdminComplaints(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        complaint_data = Complaint.objects.select_related('usn')

        print(complaint_data)

        for comp in complaint_data:
            comp.std_name = comp.usn.studentdetails.std_name

        serialize = AdminComplainSerializer(instance=complaint_data,many=True)
        pending_countdata = Complaint.objects.exclude(status = "Completed").count()

        return Response({  
            'complaints':serialize.data,
            'totalCount':pending_countdata
        },status=status.HTTP_200_OK)

    def delete(self,request,compid):
        try:
            cmp = Complaint.objects.get(id=compid)
        except Complaint.DoesNotExist:
            return Response({'error_msg':"Complain Id does not exsists"},status=status.HTTP_404_NOT_FOUND)

        cmp.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, compid):
        try:
            complaint = Complaint.objects.get(id=compid)
        except Complaint.DoesNotExist:
            return Response({'error_msg': "Complain Id does not exsists"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminComplainSerializer(instance=complaint, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdminSendMail(APIView):
    def get(self,request):

            mail = send_mail(
                subject="Set your Hostel Management password",
                message=f"""
                Hello Admin,

                Your hostel account has been created.

                Please set your password using the following link:

                http://127.0.0.1:8000/set-password/10000/abc

                After setting your password, you can log in normally.

                Regards,
                Hostel Management System
                """,
                from_email='kksagar08062004@gmail.com',
                recipient_list=['kksagar08062004@gmail.com'],
            )

            print(mail)

            return Response('sent',status=status.HTTP_201_CREATED)


    
