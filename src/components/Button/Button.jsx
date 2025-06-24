import styles from "./Button.module.css";

const Button = ({ children, secondary = false , onClick}) => {
    return <button className={[styles.btn, secondary ? styles.secondary : null].join(" ")} onClick={onClick}>
        {children}
    </button>;
};

export default Button;
