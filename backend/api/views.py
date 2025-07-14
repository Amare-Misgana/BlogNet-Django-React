from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from user.models import Profile


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response({"success": True}, status=status.HTTP_201_CREATED)


class EmailLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"success": False, "errors": {"email": "Email doesn't exist."}}, status=status.HTTP_401_UNAUTHORIZED
            )
        user = authenticate(username=user.username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {"success": True, "access": str(refresh.access_token), "refresh": str(refresh)},
                status=status.HTTP_202_ACCEPTED,
            )
        return Response(
            {
                "success": False,
                "errors": {
                    "password": "Invalid Password",
                },
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )


class TokenCheck(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response({"isValid": True, "detail": "Access token is valid.", "user": serializer.data})
        except Exception as e:
            return Response({"isValid": False, "detail": str(e)}, status=500)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(instance=profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "user profile updated successfully"})
        return Response(serializer.errors, status=400)

    def get(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = Profile(user=user, avatar="avatars/default.webp")
            profile.save()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)
