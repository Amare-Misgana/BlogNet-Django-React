from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import PostSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import BlogPost, Comments, LikePost
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from user.models import Profile


@api_view(["POST"])
def like_post(request):
    print(request.data)
    profile = Profile.objects.get(user=request.user)
    try:
        post = BlogPost.objects.get(id=request.data.get("id"))
    except BlogPost.DoesNotExist:
        return Response({"status": "Post object not found."}, status=status.HTTP_404_NOT_FOUND)
    post.like += 1
    post.save()
    if LikePost.objects.filter(profile=profile, post=post).exists():
        post.like -= 1
        post.save()
        return Response({"status": "Already liked."}, status=status.HTTP_400_BAD_REQUEST)
    LikePost.objects.create(profile=profile, post=post)
    return Response({"status": "You liked successfully."})


@api_view(["GET"])
def my_post(request):
    profile = Profile.objects.get(user=request.user)
    try:
        posts = BlogPost.objects.filter(profile=profile)
    except BlogPost.DoesNotExist:
        return Response({"status": "no posts found."}, status=status.HTTP_204_NO_CONTENT)
    serializer = PostSerializer(posts, many=True)
    if serializer:
        return Response(
            {"status": f"{posts.count()} posts found.", "results": serializer.data}, status=status.HTTP_200_OK
        )
    return Response(
        {"Status": "Something went wrong.", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
    )


class PostPagination(PageNumberPagination):
    page_size = 2


class PaginatedPostView(ListAPIView):
    queryset = BlogPost.objects.all().order_by("-timestamp")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PostPagination


class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk, user__user=request.user)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "updated"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk, user__user=request.user)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "partially updated"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user_id = request.query_params.get("user_id")
        if user_id:
            posts = BlogPost.objects.filter(user__user__id=user_id).order_by("-timestamp")
        else:
            posts = BlogPost.objects.all().order_by("-timestamp")

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            profile = Profile.objects.get(user=request.user)
            serializer.save(profile=profile)
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors, "name": "Amare"}, status=status.HTTP_400_BAD_REQUEST)


class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        post_id = request.query_params.get("post_id")
        if not post_id:
            return Response({"error": "post_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        comments = Comments.objects.filter(post__id=post_id).order_by("-timestamp")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
