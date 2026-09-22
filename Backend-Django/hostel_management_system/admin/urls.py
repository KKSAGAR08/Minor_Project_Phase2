from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.AdminAuthentication.as_view(),name='admin-login'),
    path('newregister/',views.AdminHandling.as_view(),name='admin-newreg'),
    path('profile/',views.AdminHandling.as_view(),name='admin-profile'),
    path('complaints/',views.AdminComplaints.as_view(),name='admin-complaints'),
    path('complaints/<int:compid>/',views.AdminComplaints.as_view(),name='admin-complaints'),
    path('studentsdetails/',views.AdminStudentHandling.as_view(),name='admin-studentDetails'),
    
]
