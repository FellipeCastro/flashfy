import styles from "./Button.module.css";

const Button = ({
    children,
    onClick,
    isLoading = null,
    loadingText = null,
    secondary = false,
}) => {
    return (
        <button
            className={`${styles.btn} ${isLoading ? styles.loading : ""} ${
                secondary ? styles.secondary : ""
            }`}
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span className={styles.spinner}></span>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
