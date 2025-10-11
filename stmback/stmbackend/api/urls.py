from django.urls import path
from .views import RegisterView ,user_detail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('user/', user_detail, name='user_detail'),
]