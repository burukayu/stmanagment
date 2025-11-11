from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
         
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # pass extra fields based on role
        role = request.data.get("role", "").lower()
        extra_fields = {}

        if role == "admin":
            extra_fields['is_superuser'] = True
            extra_fields['is_staff'] = True
        elif role == "staff":
            extra_fields['is_staff'] = True

        user = serializer.save(**extra_fields)  # ✅ pass extra fields directly



        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        # add custom claims
        access_token["username"] = user.username
        access_token["email"] = user.email
        access_token["role"] = (
            "admin" if user.is_superuser else
            "staff" if user.is_staff else
            "user"
        )

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": (
                    "admin" if user.is_superuser else
                    "staff" if user.is_staff else
                    "user"
                ),
            },
            "refresh": str(refresh),
            "access": str(access_token)
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = request.user  
    serializer = UserSerializer(user)
    return Response(serializer.data)