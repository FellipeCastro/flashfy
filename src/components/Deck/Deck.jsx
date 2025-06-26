import { FaExclamation } from "react-icons/fa";
import styles from "./Deck.module.css";

const Deck = ({ key, color, subject, title, cards, toDo, openCard }) => {
    return (
        <li className={styles.deck} onClick={openCard} key={key}>
            {toDo && (
                <span
                    className={styles.toDo}
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <FaExclamation />
                </span>
            )}
            <strong
                style={{
                    backgroundColor: color,
                }}
            >
                {subject}
            </strong>
            <h3>{title}</h3>
            <p>{cards} cards</p>
        </li>
    );
};

export default Deck;
