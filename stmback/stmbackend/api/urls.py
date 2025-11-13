from django.urls import path
from .views import RegisterView ,user_detail,UserListView,  CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('user/', user_detail, name='user_detail'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UserListView.as_view(), name='user-delete'),
]