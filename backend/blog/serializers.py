from rest_framework import serializers
from .models import BlogPost, Comments, LikePost
from user.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "avatar",
            "display_name",
        ]


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "profile",
            "post_title",
            "post_body",
            "post_title_color",
            "post_img",
            "post_catagory",
            "like",
            "timestamp",
        ]      
        read_only_fields = ["profile", "timestamp"]


class LikePostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = LikePost
        fields = ["post", "profile"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = "__all__"
