from channels.generic.websocket import AsyncWebsocketConsumer
import json
from user.models import Profile
from channels.db import database_sync_to_async


class LikeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "like"

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

        await self.send(text_data=json.dumps({"message": "Like Consumer Connected successfully"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.send(text_data=json.dumps({"message": "Like Consumer is Closed"}))

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        post_id = message.get("post_id", None)
        username = message.get("username", None)

        like_count = await self.save_like(post_id, username)
        print(username)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_message",
                "message": message,
                "post_id": post_id,
                "username": username,
                "like_count": like_count,
            },
        )

    async def send_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "post_id": event["post_id"],
                    "like_count": event["like_count"],
                }
            )
        )

    @database_sync_to_async
    def save_like(self, post_id, username):
        from blog.models import LikePost, BlogPost

        try:
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return "Profile doesn't exist"

        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return "The post doesn't exist"

        if LikePost.objects.filter(profile=profile, post=post).exists():
            like_post = LikePost.objects.get(profile=profile, post=post)
            if like_post.is_liked:
                post.like -= 1
                like_post.is_liked = False
            else:
                post.like += 1
                like_post.is_liked = True

            post.save()
            like_post.save()
        else:
            LikePost.objects.create(profile=profile, post=post)
            post.like += 1
            post.save()

        return post.like
