import { FaArrowLeft } from "react-icons/fa";
import styles from "./Cards.module.css";

const Cards = () => {
    return (
        <>
            <header className={styles.header}>
                <a href="#">
                    <FaArrowLeft />
                </a>
                <h1>Matemática</h1>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: "10%" }}
                    ></div>
                </div>
                <div className={styles.card}>
                    <p className={styles.question}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae maiores officiis nesciunt nisi explicabo, possimus rerum repudiandae facilis doloribus fugit distinctio harum alias?</p>
                    <div className={styles.answer}>
                        <p>Clique para ver a resposta</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cards;
