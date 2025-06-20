import { FaExclamation } from "react-icons/fa";
import styles from "./Deck.module.css";

const Deck = ({ color, deck, title, cards, toDo }) => {
    return (
        <li className={styles.deck}>
            {toDo && (<span className={styles.toDo}><FaExclamation /></span>)}
            <strong
                style={{
                    backgroundColor: color,
                }}
            >
                {deck}
            </strong>
            <h3>{title}</h3>
            <p>{cards} cards</p>
        </li>
    );
};

export default Deck;
