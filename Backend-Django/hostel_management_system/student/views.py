from .models import Complaint,Attendence1,StudentDetails,PasswordReset
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serialize
from admin.serialize import AdminStudentData
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from datetime import date,datetime,timedelta
from django.db.models import F
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError



class StudentAuthentication(APIView):
    def post(self,request):
        serializer = serialize.StudentAuthSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = authenticate(request,username=username,password=password)

            if user is not None:

                reset_password = StudentDetails.objects.values('reseted_password').get(usn=user)

                if not reset_password['reseted_password']:
                    return Response('Reset the password to use the account',status=status.HTTP_403_FORBIDDEN)

                refresh = RefreshToken.for_user(user=user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },status.HTTP_200_OK)
            
            else:
                return Response('User not found, contact admin',status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    


class StudentComplaint(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = serialize.StudentComplainSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    def get(self,request):
        complaints = Complaint.objects.filter(usn_id=request.user)

        serializer = serialize.StudentComplainSerializer(instance=complaints,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)




class StudentData(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self,request):


        serialize = AdminStudentData(instance=request.user.studentdetails,data=request.data,partial=True)

        if serialize.is_valid():
            serialize.save()

            return Response(serialize.data,status=status.HTTP_200_OK)

        return Response(serialize.errors,status=status.HTTP_400_BAD_REQUEST)



    #current year fee (Pending)
    def get(self,request):

        try:
            data = StudentDetails.objects.get(usn=request.user)
        except StudentDetails.DoesNotExist:
            return Response('Student Details not found',status=status.HTTP_404_NOT_FOUND)
        

        serializer = AdminStudentData(instance=data)

        pending_complaint = Complaint.objects.exclude(status = 'Completed').count()

        attendence = Attendence1.objects.filter(usn=request.user).last()


        isAvailable = attendence.isavailable if attendence else False

        roomate = StudentDetails.objects.filter(roomno=request.user.studentdetails.roomno).exclude(usn=request.user).values_list('usn__username','std_name')
        
        return Response({
            'studentDetails':serializer.data,
            'availability':isAvailable,
            'roommates': roomate,
            'pendingComplaints':pending_complaint,
        },status=status.HTTP_200_OK)

class StudentAttendense(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = serialize.StudentAttendenseSerializer(data=request.data,partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    # ai generated need to review it

    def patch(self, request):
        try:
            checkOut_details = request.data

            # Checkout date: YYYY-MM-DD
            checkoutDate = date(
                *map(int, checkOut_details['checkOutDate'].split('-'))
            )

            # Get latest attendance record
            prevCheckIn = (
                Attendence1.objects
                .filter(usn_id=request.user)
                .order_by('-serial_no')
                .first()
            )

            # No previous record
            if prevCheckIn is None:
                return Response(
                    {"message": "You have not checked IN yet"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check whether student is currently checked in
            if not prevCheckIn.isAvailable:
                return Response(
                    {"message": "You have not checked IN yet"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            checkInDate = prevCheckIn.checkInDate

            # Checkout cannot be before check-in
            if checkoutDate < checkInDate:
                return Response(
                    {
                        "message":
                        "Checkout date should be greater than the checkin date"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            checkInYear = checkInDate.year
            checkOutYear = checkoutDate.year

            # --------------------------------
            # CASE 1: Same year
            # --------------------------------
            if checkInYear == checkOutYear:

                days = (checkoutDate - checkInDate).days

                data = request.data.copy()
                data['days'] = days
                data['isAvailable'] = False

                serializer = serialize.StudentAttendenseSerializer(
                    instance=prevCheckIn,
                    data=data,
                    partial=True
                )

                if serializer.is_valid():
                    serializer.save()

                    return Response(
                        {
                            "message": "Checkout Successful (same year)",
                            "data": serializer.data
                        },
                        status=status.HTTP_200_OK
                    )

                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --------------------------------
            # CASE 2: Multiple years
            # --------------------------------

            currentStart = checkInDate
            currentYear = checkInYear

            # First record + intermediate full years
            while currentYear < checkOutYear:

                currentEnd = date(currentYear, 12, 31)

                days = (currentEnd - currentStart).days + 1

                # First year → update existing record
                if currentYear == checkInYear:

                    data = request.data.copy()

                    data['checkoutDate'] = currentEnd
                    data['days'] = days
                    data['isAvailable'] = False

                    serializer = serialize.StudentAttendenseSerializer(
                        instance=prevCheckIn,
                        data=data,
                        partial=True
                    )

                    if not serializer.is_valid():
                        return Response(
                            serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    serializer.save()

                # Intermediate years → create new record
                else:

                    data = {
                        'usn': prevCheckIn.usn.id,
                        'roomno': prevCheckIn.roomno,
                        'checkInDate': currentStart,
                        'checkoutDate': currentEnd,
                        'expCheckinDate':
                            checkOut_details.get('expCheckinDate'),
                        'reason':
                            checkOut_details.get('reason'),
                        'checkInTime': '00:00:00',
                        'addtionalreason':
                            prevCheckIn.addtionalreason,
                        'isAvailable': False,
                        'days': days
                    }

                    serializer = serialize.StudentAttendenseSerializer(data=data)

                    if not serializer.is_valid():
                        return Response(
                            serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    serializer.save()

                # Move to next year
                currentYear += 1
                currentStart = date(currentYear, 1, 1)

            # --------------------------------
            # Last year
            # --------------------------------

            daysLast = (checkoutDate - currentStart).days + 1

            data = {
                'usn': prevCheckIn.usn.id,
                'roomno': prevCheckIn.roomno,
                'checkInDate': currentStart,
                'checkoutDate': checkoutDate,
                'expCheckinDate':
                    checkOut_details.get('expCheckinDate'),
                'reason':
                    checkOut_details.get('reason'),
                'checkInTime': '00:00:00',
                'addtionalreason':
                    prevCheckIn.addtionalreason,
                'isAvailable': False,
                'days': daysLast
            }

            serializer = serialize.StudentAttendenseSerializer(data=data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()

            return Response(
                {
                    "message":
                        "Checkout Successful (spanning multiple years)"
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("Error in Checkout:", e)

            return Response(
                {"message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class StudentSendMail(APIView):
    def post(self,request):

        try:
            user = User.objects.get(username=request.data['usn'])
        except StudentDetails.DoesNotExist as e:
            return Response("User Did not found",status=status.HTTP_404_NOT_FOUND)

        data = StudentDetails.objects.get(usn=user)

        token = get_random_string(length=32)
        mail = data.std_email.strip()

        mail = send_mail(
            subject="Set your Hostel Management password",
            message=f"""
            Hello {data.std_name},

            Your hostel account has been created.

            Please set your password using the following link:

            http://localhost:5173/reset/{request.data['usn']}/{token}

            After setting your password, you can log in normally.

            Regards,
            Hostel Management System
            """,
            from_email='kksagar08062004@gmail.com',
            recipient_list=[mail],
        )

        if mail:
            PasswordReset.objects.create(usn=request.data['usn'],email=data.std_email,token=token)

            return Response('Email sent Check your Inbox',status=status.HTTP_204_NO_CONTENT)

        return Response('Email not sent try again later',status=status.HTTP_400_BAD_REQUEST)

class StudentPasswordReset(APIView):
    def post(self,request,userid,token):
        token = PasswordReset.objects.filter(token=token).first()

        if not token or datetime.now() > token.created_at+timedelta(minutes=10) or token.usn != userid:
            return Response("Invalid Details or Invalid Token",status=status.HTTP_401_UNAUTHORIZED)

        if request.data['password'] != request.data['confirmPassword']:
            return Response("Password not matching",status=status.HTTP_406_NOT_ACCEPTABLE)

        try:

            try:
                validate_password(password=request.data['password'])
            except ValidationError as e:
                return Response(e,status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.get(username=userid)



            user.password = make_password(request.data['password'])
            user.save()

            stdData = StudentDetails.objects.get(usn=user)
            stdData.reseted_password = True
            stdData.save()

            token.delete()

            return Response('Password Reset Successfully',status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response("User does not exsist",status=status.HTTP_401_UNAUTHORIZED)

        
    











    
    



        

