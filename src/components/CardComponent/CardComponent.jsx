import styles from "./CardComponent.module.css";

const CardComponent = ({ children, onClick, alternativeClass = null }) => {
    return (
        <div
            className={`${styles.card} ${
                alternativeClass ? alternativeClass : ""
            }`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default CardComponent;
