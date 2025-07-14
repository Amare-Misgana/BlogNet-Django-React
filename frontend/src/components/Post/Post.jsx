import { FaHeart } from "react-icons/fa";
import styles from "./Post.module.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import numeral from "numeral";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../context/UserContext";

const Post = ({ post }) => {
    const { user } = useContext(UserContext);
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const socketRef = useRef(null);
    const [readableLike, setReadableLike] = useState(numeral(post.like).format(post.like < 1000 ? "0a" : "0.0a"));

    const readableTime = formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true });

    const avatar = post.profile.avatar.includes("http")
        ? post.profile.avatar
        : `http://127.0.0.1:8000${post.profile.avatar}`;

    const onMessage = useCallback(
        (event) => {
            const data = JSON.parse(event.data);
            if (data.post_id === post.id && data.like_count !== undefined) {
                setReadableLike(numeral(data.like_count).format(data.like_count < 1000 ? "0a" : "0.0a"));
            }
        },
        [post.id]
    );

    useEffect(() => {
        const socketUrl = `${protocol}://${host}:8000/ws/like/`;
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        socketRef.current.onmessage = onMessage;

        socketRef.current.onclose = () => {
            console.log("❌ WebSocket closed");
        };

        return () => {
            socketRef.current?.close();
        };
    }, [onMessage]);

    const handleLikePost = (id) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    message: {
                        post_id: id,
                        username: user.username,
                    },
                })
            );
            console.log("WebSocket is working");
        } else {
            console.log("WebSocket is not open");
        }
    };

    return (
        <div className={styles.PostContainer}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <img src={avatar} alt={`${post.user} avatar`} />
                    <h1>{post.profile.display_name}</h1>
                </div>
                <div className={styles.right} onClick={() => handleLikePost(post.id)}>
                    <FaHeart />
                    <p>{readableLike}</p>
                </div>
            </div>
            <div className={styles.body}>
                <h2>{post.post_title}</h2>
                <p>{post.post_body}</p>
            </div>
            <h3>{readableTime}</h3>
            <button>Read More</button>
        </div>
    );
};

export default Post;
