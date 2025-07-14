import styles from "./HomeNav.module.css";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const HomeNav = ({ currentPage, navRef, isHomePage = true }) => {
    const navigation = useNavigate();
    const { isAuthenticated, loading, user } = useAuth(
        "http://127.0.0.1:8000/api/token/check/",
        "http://127.0.0.1:8000/api/token/refresh/"
    );

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            navigation("/blog");
            return;
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className={styles.HomeNavContainer} ref={navRef}>
            <div
                className={styles.left}
                onClick={() => {
                    navigation("/");
                }}
            >
                <img src={Logo} alt="Logo" />
                <h1>BlogNet</h1>
            </div>
            <div className={styles.right}>
                <Link to="/login" className={currentPage === "signIn" ? styles.currentPage : ""}>
                    Sign In
                </Link>
                <Link to="/Register" className={currentPage === "signUp" ? styles.currentPage : ""}>
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default HomeNav;
