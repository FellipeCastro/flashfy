import { FaFire } from "react-icons/fa6";
import styles from "./ProgressBar.module.css";

const ProgressBar = () => {
    return (
        <div className={styles.progressBarContainer}>
            <h2>
                <FaFire /> 2 dias consecutivos!
            </h2>

            <ul className={styles.weekDays}>
                <li className={styles.day}>D</li>
                <li className={styles.day}>S</li>
                <li className={styles.day}>T</li>
                <li className={styles.day}>Q</li>
                <li className={`${styles.day} ${styles.active}`}>Q</li>
                <li className={styles.day}>S</li>
                <li className={styles.day}>S</li>
            </ul>

            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: "30%" }}></div>
                <span className={styles.progressText}>30%</span>
            </div>

            <p className={styles.message}>Você estudou 2 flashcards hoje!</p>
        </div>
    );
};

export default ProgressBar;
