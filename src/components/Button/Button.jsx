import styles from "./Button.module.css";

const Button = ({ children, secondary = false }) => {
    return <button className={[styles.btn, secondary ? styles.secondary : null].join(" ")}>
        {children}
    </button>;
};

export default Button;
