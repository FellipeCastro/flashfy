import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ progress, loading }) => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];

    const date = new Date();
    const currentDay = date.getDay();

    return (
        <div className={styles.progressBarContainer}>
            <h2>
                <FaFire />
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
        </div>
    );
};

export default ProgressBar;
