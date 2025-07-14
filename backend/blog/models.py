from django.db import models
from user.models import Profile


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ("food", "Food"),
        ("electronics", "Electronics"),
        ("life_hacks", "Life Hacks"),
        ("family", "Family"),
        ("education", "Education"),
        ("entertainment", "Entertainment"),
        ("stories", "Stories"),
        ("news", "News"),
    ]
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    post_title = models.CharField(max_length=100)
    post_body = models.TextField()
    post_title_color = models.CharField(max_length=15)
    post_img = models.ImageField(upload_to="post_img/")
    post_catagory = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    like = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.display_name} posted {self.post_title}"


class LikePost(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    is_liked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.profile.user.username} liked {self.post.post_title}"


class Comments(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    commenter = models.ForeignKey(Profile, on_delete=models.CASCADE)
    comment = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.commenter.display_name} has said {self.comment} to: {self.post.post_title}"
