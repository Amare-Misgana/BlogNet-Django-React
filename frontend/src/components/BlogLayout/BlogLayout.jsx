import styles from "./BlogLayout.module.css";
import Logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBars, FaPlus } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { FaUser } from "react-icons/fa";
import { MdArticle, MdEdit, MdMenuBook, MdPerson, MdLogout } from "react-icons/md";
import { Outlet } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { RiLogoutBoxRFill } from "react-icons/ri";

const BlogLayout = () => {
    const navigate = useNavigate();
    const slideNavRef = useRef(null);

    const location = useLocation();
    const path = location.pathname;

    let currentPage = "home";
    if (path.includes("/post")) currentPage = "post";
    else if (path.includes("/add-post")) currentPage = "add-post";
    else if (path.includes("/account/edit")) currentPage = "edit-account";
    else if (path.includes("/account")) currentPage = "account";
    else currentPage = "blog";

    const [avatar, setAvatar] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [profile, setProfile] = useState({});

    const { isAuthenticated, loading, user } = useAuth(
        "http://127.0.0.1:8000/api/token/check/",
        "http://127.0.0.1:8000/api/token/refresh/"
    );

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const fetchAvatar = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                });
                setAvatar(res.data.avatar);
                setDisplayName(res.data.display_name);
                setProfile(res.data);
            } catch (error) {
                console.log("Error fetching profile:", error);
            }
        };

        fetchAvatar();
    }, [loading, isAuthenticated]);

    useEffect(() => {
        setTimeout(() => {
            if (slideNavRef.current) {
                const isSlide = localStorage.getItem("slide") === "true";
                slideNavRef.current.classList.toggle(styles.slide, isSlide);
            }
        }, 0);
    }, [loading]);

    if (loading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className={styles.BlogLayoutContainer}>
            <header>
                <div className={styles.left}>
                    <FaBars
                        className={styles.menuBar}
                        onClick={() => {
                            slideNavRef.current.classList.toggle(styles.slide);
                            localStorage.setItem("slide", slideNavRef.current.classList.contains(styles.slide));
                            console.log("clicked!");
                        }}
                    />
                    <img
                        src={Logo}
                        alt="Logo"
                        onClick={() => {
                            navigate("/blog/");
                        }}
                    />
                </div>
                <div
                    className={styles.right}
                    onClick={() => {
                        navigate("/blog/account");
                    }}
                >
                    <h1 className={styles.username}>{displayName}</h1>
                    {avatar && <img src={`http://127.0.0.1:8000${avatar}`} alt="avatar" className="avatar" />}
                </div>
            </header>
            <main>
                <nav className={styles.slideNav} ref={slideNavRef}>
                    <button
                        onClick={() => {
                            navigate("/blog/add-post/");
                        }}
                        className={styles.addPostBtn}
                    >
                        <FaPlus /> Add Post
                    </button>
                    <ul>
                        <li
                            onClick={() => {
                                navigate("/blog");
                            }}
                            className={currentPage == "blog" ? styles.currentPage : ""}
                        >
                            <MdMenuBook className={styles.icons} /> Read Blog
                        </li>

                        <li
                            onClick={() => {
                                navigate("/blog/post");
                            }}
                            className={currentPage == "post" ? styles.currentPage : ""}
                        >
                            <MdArticle className={styles.icons} /> Post
                        </li>

                        <li
                            onClick={() => {
                                navigate("/blog/account");
                            }}
                            className={currentPage == "account" ? styles.currentPage : ""}
                        >
                            <MdPerson className={styles.icons} /> Account
                        </li>

                        <li
                            onClick={() => {
                                navigate("/blog/account/edit");
                            }}
                            className={currentPage == "edit-account" ? styles.currentPage : ""}
                        >
                            <MdEdit className={styles.icons} /> Edit Account
                        </li>

                        <li
                            onClick={() => {
                                let wantToLogout = confirm("Are you sure you want to logout?");
                                if (wantToLogout) {
                                    navigate("/logout");
                                }
                            }}
                            className={currentPage == "logout" ? styles.currentPage : ""}
                        >
                            <MdLogout className={styles.icons} /> Logout
                        </li>
                    </ul>
                </nav>
                <div className={styles.content}>
                    <UserContext.Provider value={{ user, profile }}>
                        <Outlet />
                    </UserContext.Provider>
                </div>
            </main>
        </div>
    );
};

export default BlogLayout;
