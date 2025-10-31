import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";
import CardComponent from "../CardComponent/CardComponent";

const ProgressBar = ({ progress }) => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];

    const date = new Date();
    const currentDay = date.getDay();

    return (
        <CardComponent alternativeClass={styles.progressBarContainer}>
            <h2>
                <FaFire className={progress.consecutiveDays > 0 ? `${styles.fireIcon}` : `${styles.fireIcon} ${styles.inative}`} />
                {progress.message ? progress.message : <p id="loader">Carregando...</p>}
            </h2>

            <ul className={styles.weekDays}>
                {days.map((day, index) => (
                    <li
                        key={index}
                        className={`${styles.day} ${
                            index === currentDay ? styles.active : null
                        }`}
                    >
                        {day}
                    </li>
                ))}
            </ul>

            <div className={styles.progress}>
                <span>
                    <strong>Decks estudados: </strong>{" "}
                    {progress.studiedDecks ? progress.studiedDecks : 0}
                </span>
                <span>
                    <strong>Decks para estudar: </strong>{" "}
                    {progress.decksToStudy ? progress.decksToStudy : 0}
                </span>
            </div>
        </CardComponent>
    );
};

export default ProgressBar;
