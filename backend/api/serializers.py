from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from user.models import Profile
from django.contrib.auth import authenticate


class EmailTokenObtainPairView(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with this email.")

        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid password.")

        refresh = self.get_token(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "display_name"]


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def validate_username(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("User can't be empty.")
        elif User.objects.filter(username=value).exists():
            raise serializers.ValidationError("User already taken.")
        return value

    def validate_email(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("Email can't be empty.")
        elif User.objects.filter(email=value):
            raise serializers.ValidationError("Email already taken.")
        return value

    def validate_password(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("Password can't be empty.")
        elif len(value) < 4:
            raise serializers.ValidationError("Password can't be below 4 characters.")
        elif not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one capital letter.")
        elif not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must contain at least on small letter.")

        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
