import styles from  "./Loading.module.css";

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <span className={styles.loading}></span>
        </div>
    );
};

export default Loading;
