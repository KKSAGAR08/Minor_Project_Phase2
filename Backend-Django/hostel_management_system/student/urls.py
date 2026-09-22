from django.urls import path
from . import views
from admin.views import AdminComplaints

urlpatterns = [
    path('login/',views.StudentAuthentication.as_view(),name='login'),
    path('complaint/',views.StudentComplaint.as_view(),name='std-complaint'),

    path('complaints/<int:compid>/',AdminComplaints.as_view(),name='admin-complaints'),
    
    path('studentdetails/',views.StudentData.as_view(),name='std-details'),
    path('attendense/',views.StudentAttendense.as_view(),name='std-attendense'),
    path('sendmail/',views.StudentSendMail.as_view(),name='send_mail'),
    path('set-password/<str:userid>/<str:token>/',views.StudentPasswordReset.as_view(),name='password-reset'),
]
