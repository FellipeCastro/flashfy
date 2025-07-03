import { FaExclamation } from "react-icons/fa";
import styles from "./Deck.module.css";

const Deck = ({ color, subject, title, cards, nextReview, toDo, openCard }) => {
    const formatDate = (dateString) => {
        const now = new Date();
        const reviewDate = new Date(dateString);
        const diffTime = reviewDate - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        // const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        // const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffTime === 0) {
            return "Agora";
        }

        if (diffDays < 0) {
            return `Há ${-diffDays} dias atrás`;
        }

        if (diffDays === 0) {
            return "Hoje";
        }

        if (diffDays === 1) {
            return "Amanhã";
        }

        if (diffDays <= 7) {
            return `Daqui a ${diffDays} dias`;
        }

        return reviewDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });
    };

    const needsAttention = () => {
        if (!nextReview) return false;
        const reviewDate = new Date(nextReview);
        const diffTime = reviewDate - new Date();
        return diffTime < 0 || diffTime < 1000 * 60 * 60 * 24; // Vencido ou vence hoje
    };

    return (
        <li className={styles.deck} onClick={openCard}>
            {(toDo || needsAttention()) && (
                <span
                    className={styles.toDo}
                    style={{ backgroundColor: color }}
                >
                    <FaExclamation />
                </span>
            )}

            <strong
                className={styles.subject}
                style={{ backgroundColor: color }}
            >
                {subject}
            </strong>

            <h3>{title}</h3>

            <p className={styles.cards}>{cards} cards</p>

            <p className={styles.nextReview}>
                <strong>Próxima revisão:</strong>{" "}
                {nextReview ? formatDate(nextReview) : "Não agendada"}
            </p>
        </li>
    );
};

export default Deck;
