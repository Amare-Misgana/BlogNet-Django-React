import styles from "./HomeBlog.module.css";
import Post from "../../components/Post/Post";
import PostBlank from "../../components/PostBlank/PostBlank";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const HomeBlog = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, []);

    useEffect(() => {
        let cancel = false;

        axios
            .get(`http://127.0.0.1:8000/blog/posts/?page=${page}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
            })
            .then((res) => {
                if (cancel) return;
                console.log(res);
                setPosts((prev) => [...prev, ...(res.data.results || [])]);
                if (!res.data.next) setHasMore(false);
            })
            .catch((err) => {
                console.error("Failed to load posts:", err);
                setHasMore(false);
            });

        return () => {
            cancel = true;
        };
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setPage((prevPage) => {
                        if (hasMore) {
                            console.log("Intersecting, loading page", prevPage + 1);
                            return prevPage + 1;
                        }
                        return prevPage;
                    });
                }
            },
            { threshold: 0.6 }
        );

        const target = observerRef.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, []);

    return (
        <div className={styles.HomeBlogContainer}>
            {posts.length === 0 ? (
                <div className={styles.HomeBlogContainer}>No Posts Found</div>
            ) : (
                posts.map((post) => <Post key={post.id} post={post} />)
            )}
            <PostBlank ref={observerRef} />
        </div>
    );
};

export default HomeBlog;
