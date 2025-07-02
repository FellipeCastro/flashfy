import { useState } from "react";
import { FaExclamation } from "react-icons/fa";
import styles from "./Deck.module.css";

const Deck = ({ color, subject, title, cards, nextReview, toDo, openCard }) => {
    let now;
    let reviewDate;
    let diffTime;
    let diffDays;
    let diffHours;
    let diffMinutes;

    const formatDate = (dateString) => {
        now = new Date();
        reviewDate = new Date(dateString);
        diffTime = reviewDate - now;
        diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        diffMinutes = Math.floor(diffTime / (1000 * 60));
        // Se a data já passou
        if (diffTime < 0) {
            return "Agora";
        }

        // Dentro do mesmo dia
        if (diffDays === 0) {
            // if (diffHours === 0) {
            //     if (diffMinutes <= 1) {
            //         return "Agora";
            //     }
            //     return `Daqui a ${diffMinutes} minuto${
            //         diffMinutes > 1 ? "s" : ""
            //     }`;
            // }
            // return `Daqui a ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
            return "Hoje";
        }

        // Amanhã
        if (diffDays === 1) {
            return "Amanhã";
        }

        // Esta semana
        if (diffDays <= 7) {
            return `Daqui a ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
        }

        // Mais de uma semana - mostra a data formatada
        return reviewDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            // hour: "2-digit",
            // minute: "2-digit",
        });
    };

    return (
        <li className={styles.deck} onClick={openCard}>
            {diffTime < 0 ||
                (diffDays === 0 && (
                    <span
                        className={styles.toDo}
                        style={{
                            backgroundColor: color,
                        }}
                    >
                        <FaExclamation />
                    </span>
                ))}
            <strong
                className={styles.subject}
                style={{
                    backgroundColor: color,
                }}
            >
                {subject}
            </strong>
            <h3>{title}</h3>
            <p className={styles.cards}>{cards} cards</p>
            <p className={styles.nextReview}>
                <strong>Próxima revisão:</strong> {formatDate(nextReview)}
            </p>
        </li>
    );
};

export default Deck;
