import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ progress, setProgress }) => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];

    const date = new Date();
    const currentDay = date.getDay();
    const currentProgress = Math.round(
        (progress.studiedDecks / progress.decksToStudy) * 100
    );

    return (
        <div className={styles.progressBarContainer}>
            <h2>
                <FaFire /> {progress.consecutiveDays} dias consecutivos!
            </h2>

            <ul className={styles.weekDays}>
                {days.map((day, index) => {
                    return (
                        <li
                            key={index}
                            className={`${styles.day} ${
                                index === currentDay ? styles.active : null
                            }`}
                        >
                            {day}
                        </li>
                    );
                })}
            </ul>

            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${currentProgress}%` }}
                ></div>
                <span className={styles.progressText}>{currentProgress}%</span>
            </div>

            {progress.studiedDecks === 0 ? (
                <p className={styles.message}>
                    Você ainda não estudou nenhum deck hoje!
                </p>
            ) : (
                <p className={styles.message}>
                    Você estudou {progress.studiedDecks} deck
                    {progress.studiedDecks > 1 ? "s" : null} hoje!
                </p>
            )}
        </div>
    );
};

export default ProgressBar;
