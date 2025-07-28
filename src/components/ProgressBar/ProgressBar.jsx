import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ progress, setProgress }) => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];

    const date = new Date();
    const currentDay = date.getDay();

    return (
        <div className={styles.progressBarContainer}>
            <h2>
                <FaFire /> {progress.consecutiveDays} dias consecutivos!
            </h2>

            <ul className={styles.weekDays}>
                {days.map((day, index) => (
                    <li
                        key={index}
                        className={`${styles.day} ${
                            index === currentDay ? styles.active : ""
                        }`}
                    >
                        {day}
                    </li>
                ))}
            </ul>

            <div className={styles.progress}>
                <span>
                    <strong>Decks estudados: </strong> {progress.studiedDecks}
                </span>
                                <span>
                    <strong>Decks para estudar: </strong> {progress.decksToStudy}
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;
