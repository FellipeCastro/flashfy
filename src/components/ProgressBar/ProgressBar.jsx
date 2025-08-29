import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ progress = {} }) => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];
    const date = new Date();
    const currentDay = date.getDay();

    // Valores padrão para evitar erros
    const consecutiveDays = progress.consecutiveDays || 0;
    const totalStudyTime = progress.totalStudyTime || 0;
    const accuracy = progress.accuracy || 0;

    const formatStudyTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className={styles.progressBarContainer}>
            <h2>
                <FaFire />
                {consecutiveDays <= 1
                    ? "Vamos começar sua sequência!"
                    : `${consecutiveDays} dias consecutivos!`}
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
                    <strong>Tempo de estudo: </strong> {formatStudyTime(totalStudyTime)}
                </span>
                <span>
                    <strong>Taxa de acerto: </strong> {accuracy}%
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;