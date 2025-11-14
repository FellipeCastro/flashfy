import { FaExclamation } from "react-icons/fa";
import styles from "./Deck.module.css";
import CardComponent from "../CardComponent/CardComponent";

const Deck = ({ color, subject, title, cards, nextReview, openCard }) => {
    const formatDate = (dateString) => {
        const now = new Date();
        const reviewDate = new Date(dateString);
        const diffTime = reviewDate - now; // Diferença em milissegundos
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
            (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
            (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        // Se a data já passou
        if (diffTime < 0) {
            const daysPassed = Math.abs(diffDays);
            return daysPassed === 0
                ? "Vencido hoje"
                : `Vencido há ${daysPassed} dia${daysPassed > 1 ? "s" : ""}`;
        }

        // Se for hoje
        if (diffDays === 0) {
            if (diffHours === 0) {
                return diffMinutes <= 0
                    ? "Agora"
                    : `Em ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
            }
            return `Em ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
        }

        // Amanhã
        if (diffDays === 1) {
            return "Amanhã";
        }

        // Esta semana
        if (diffDays <= 7) {
            return `Em ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
        }

        // Mais de uma semana
        return reviewDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const needsAttention = () => {
        if (!nextReview) return false;
        const reviewDate = new Date(nextReview);
        const diffTime = reviewDate - new Date();
        return diffTime < 0 || diffTime < 1000 * 60 * 60 * 24; // Vencido ou vence hoje
    };

    return (
        <CardComponent alternativeClass={styles.deck} onClick={openCard}>
            {needsAttention() && (
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

            <p className={styles.cards}>{cards} card{cards === 1 ? null : "s"}</p>

            <p className={styles.nextReview}>
                <strong>Próxima revisão:</strong>{" "}
                {nextReview ? formatDate(nextReview) : "Não agendada"}
            </p>
        </CardComponent>
    );
};

export default Deck;
