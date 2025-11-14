from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework import generics, status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
         
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()  # ✅ pass extra fields directly



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


class UserListView(APIView):
    permission_classes = [IsAuthenticated]  # or [IsAdminUser] if only admins can access

    def get(self, request, status):
        if status == 'Active':
           users = User.objects.filter(is_active=True)
        elif status == 'Inactive':
             users = User.objects.filter(is_active=False)
        else:
            return Response({"error": "Invalid status"}, status=400)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

   
        
    def put(self, request, user_id):
        """Update user by ID"""
        user = get_object_or_404(User, id=user_id)

        # Only superusers or staff can edit other users
        if  not request.user.is_superuser:
            return Response(
                {"detail": "You do not have permission to update users."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id): 
        if   request.user.is_superuser:
            return Response(
                {"detail": "You do not have permission to deactivate users."},
                status=status.HTTP_403_FORBIDDEN
            )

        user = get_object_or_404(User, id=user_id)
        username = user.username

        # Instead of deleting, mark as inactive
        user.is_active = False
        user.save()

        return Response(
            {"message": f"User '{username}' deactivated successfully."},
            status=status.HTTP_200_OK
        )


class ActivateUser(APIView):
    permission_classes= IsAdminUser

    def put(self, request, user_id):
        if not request.user.is_superuser:
            return Response({"detail":"You dont have right to activate the user"},
            status=status.HTTP_403_FORBIDDEN)


        user = get_object_or_404(User , id=user_id)


        if user.is_active:
            return Response({"detial":"the user is already active"},
            status=status.HTTP_200_OK)


        user.is_active=True
        user.save


        return Response({"detial":f"User'{user.name}' is successfuly activated"},
        status=status.HTTP_200_OK)