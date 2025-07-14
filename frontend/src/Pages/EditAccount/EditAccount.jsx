import styles from "./EditAccount.module.css";
import UserContext from "../../context/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import axios from "axios";

const EditAccount = () => {
    const { profile } = useContext(UserContext);
    const [displayName, setDisplayName] = useState(profile?.display_name || "");
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        setDisplayName(profile?.display_name || "");
    }, [profile]);

    const imgInp = useRef();
    const avatarReview = useRef();

    const handelSubmit = (e) => {
        e.preventDefault();
        const fileData = new FormData();

        if (selectedAvatar) {
            // alert("Please upload info");
            fileData.append("avatar", selectedAvatar);
        }

        fileData.append("display_name", displayName);

        axios
            .post("http://127.0.0.1:8000/api/profile/", fileData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            })
            .then((res) => {
                window.location.reload();
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={styles.EditAccountContainer}>
            <form className={styles.form} onSubmit={handelSubmit}>
                <h1>Edit Profile</h1>
                <img
                    src={`http://127.0.0.1:8000${profile.avatar}`}
                    alt={`${profile.display_name}'s Avatar`}
                    className={styles.avatarReview}
                    onClick={() => {
                        imgInp.current.click();
                    }}
                    ref={avatarReview}
                />
                <input
                    ref={imgInp}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setSelectedAvatar(file);
                            let imgUrl = URL.createObjectURL(file);

                            avatarReview.current.src = imgUrl;
                        }
                    }}
                    title="Edit Avatar"
                />
                <input
                    type="text"
                    value={displayName}
                    className={styles.displayName}
                    onChange={(e) => {
                        setDisplayName(e.target.value);
                    }}
                />
                <button className={styles.editBtn} type="submit">
                    <MdEdit />
                    Edit
                </button>
            </form>
        </div>
    );
};

export default EditAccount;
