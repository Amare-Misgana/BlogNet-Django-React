import { useRef, useState } from "react";
import styles from "./AddPost.module.css";
import defaultImg from "../../assets/defaultImg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPost = ({ addPostUrl = "http://127.0.0.1:8000/blog/add-post/" }) => {
    const postImgRef = useRef();
    const [color, setColor] = useState("#000000");
    const [file, setFile] = useState(null);
    const [postTitle, setPostTitle] = useState("Post Title");
    const [postBody, setPostBody] = useState("Post Body");
    const handleColorChange = (event) => setColor(event.target.value);
    const formData = new FormData();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.append("post_title", postTitle);
        formData.append("post_body", postBody);
        formData.append("post_img", file);
        formData.append("post_title_color", color);
        formData.append("post_catagory", "food");

        try {
            const response = await axios.post(addPostUrl, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
            navigate("/blog/post");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.AddPostContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Add Post</h1>
                <label htmlFor="postTitle" className={styles.postTitleLabel}>
                    <input
                        type="text"
                        id="postTitle"
                        placeholder=""
                        value={postTitle}
                        onChange={(e) => {
                            setPostTitle(e.target.value);
                        }}
                    />
                    <span>Post Title</span>
                </label>
                <label htmlFor="postImg" className={styles.postImgLabel}>
                    <input
                        type="file"
                        ref={postImgRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setFile(e.target.files[0]);
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            postImgRef.current.click();
                        }}
                        type="button"
                    >
                        Choose Image
                    </button>
                    <span>Chosen file: {file ? file.name : "No file chosen."}</span>
                </label>
                <label htmlFor="color" className={styles.postTitleColorLabel}>
                    <span>Post Title Color</span>
                    <div className={styles.row}>
                        <input type="color" id="color" value={color} onChange={handleColorChange} />
                        <span className={styles.colorSpan}>Color: {color}</span>
                    </div>
                </label>
                <label htmlFor="postBody" className={styles.postBodyLabel}>
                    <textarea
                        className={styles.textarea}
                        placeholder=""
                        id="postBody"
                        value={postBody}
                        onChange={(e) => {
                            setPostBody(e.target.value);
                        }}
                    ></textarea>
                    <span>Post Body</span>
                </label>
                <button type="submit">Add Post</button>
            </form>
            <div className={styles.preview}>
                <h1>Preview</h1>
                <div className={styles.container}>
                    <div className={styles.hero}>
                        <img src={file ? URL.createObjectURL(file) : defaultImg} alt="Preview Image" />
                        <h2 className={styles.postTitle} style={{ color: color }} title={postTitle}>
                            {postTitle}
                        </h2>
                    </div>
                    <p className={styles.postBody}>{postBody}</p>
                </div>
            </div>
        </div>
    );
};

export default AddPost;
