from django.urls import path
from .views import RegisterView ,user_detail,UserListView, ActivateUser, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('user/', user_detail, name='user_detail'),
    path('users/<str:status>/', UserListView.as_view(), name='user-list'),
    path('users/delup/<int:user_id>/', UserListView.as_view(), name='user-delete'),
    path('user/activate/<int:user_id>/',ActivateUser.as_view(),name='active-user'),
]