import styles from "./ErrorComponent.module.css";

const ErrorComponent = ({ error }) => {
    return <>{error && <div className={styles.errorMessage}>{error}</div>}</>;
};

export default ErrorComponent;
