import { useContext } from "react";
import styles from "./Account.module.css";
import UserContext from "../../context/UserContext";
import { FaFileAlt, FaHeart, FaComment, FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom"; 

const Account = () => {
    const navigate = useNavigate();
    const { profile } = useContext(UserContext);
    return (
        <div className={styles.AccountContainer}>
            <div className={styles.sideBtn}>
                <button
                    onClick={() => {
                        navigate("/blog/account/edit");
                    }}
                >
                    <MdEdit className={styles.icon} />
                    Edit Accout
                </button>
            </div>
            <div className={styles.userInfo}>
                <div className={styles.left}>
                    <img src={`http://127.0.0.1:8000${profile.avatar}`} alt="User Avatar" />
                    <h3 className={styles.displayName}>{profile.display_name}</h3>
                </div>
                <div className={styles.right}>
                    <div className={styles.card}>
                        <p className={styles.discr}>Posts</p>
                        <FaFileAlt className={styles.icons} />
                        <p className={styles.value}>PlaceHolder</p>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.discr}>Likes</p>
                        <FaHeart className={styles.icons} />
                        <p className={styles.value}>PlaceHolder</p>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.discr}>Comments</p>
                        <FaComment className={styles.icons} />
                        <p className={styles.value}>PlaceHolder</p>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.discr}>Views</p>
                        <FaEye className={styles.icons} />
                        <p className={styles.value}>PlaceHolder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
