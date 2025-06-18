import styles from "./Deck.module.css";

const Deck = ({ color, deck, title, cards }) => {
    return (
        <li className={styles.deck}>
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
