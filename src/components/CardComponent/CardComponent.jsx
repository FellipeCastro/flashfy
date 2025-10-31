import styles from "./CardComponent.module.css";

const CardComponent = ({
    children,
    alternativeClass = null,
    onClick,
    style,
}) => {
    return (
        <div
            className={`${styles.card} ${
                alternativeClass ? alternativeClass : ""
            }`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
};

export default CardComponent;
