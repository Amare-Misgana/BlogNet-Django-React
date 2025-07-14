import styles from "./PostBlank.module.css";

const PostBlank = ({ ref }) => {
    return (
        <div className={styles.PostBlankContainer} ref={ref}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.avatar}></div>
                    <div className={styles.displayName}></div>
                </div>
                <div className={styles.right}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.postTitle}></div>
                <div className={styles.postBody}>
                    <div className={styles.lineOne}></div>
                    <div className={styles.lineTwo}></div>
                    <div className={styles.lineThree}></div>
                </div>
            </div>
            <div className={styles.button}></div>
        </div>
    );
};

export default PostBlank;
