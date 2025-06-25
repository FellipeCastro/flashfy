import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./Cards.module.css";

const Cards = () => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <Link to="/">
                    <FaArrowLeft />
                </Link>
                <h1>Matemática</h1>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: "10%" }}
                    ></div>
                </div>
                <div
                    className={styles.card}
                    onClick={() => setShowAnswer(true)}
                >
                    <p className={styles.question}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quae maiores officiis nesciunt nisi explicabo, possimus
                        rerum repudiandae facilis doloribus fugit distinctio
                        harum alias?
                    </p>
                    <div
                        className={`${styles.answer} ${
                            showAnswer ? styles.showAnswer : null
                        }`}
                    >
                        <div className={`${styles.face} ${styles.back}`}>
                            <p>Clique para ver a resposta</p>
                        </div>
                        <div className={`${styles.face} ${styles.front}`}>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Animi impedit itaque quisquam
                                voluptatum optio accusantium explicabo
                                consequuntur ad quidem est, ea nisi quasi
                                sapiente deserunt sunt, inventore aspernatur
                                fugit officiis.
                            </p>
                        </div>
                    </div>
                </div>

                    <div className={`${styles.feedback} ${showAnswer ? null : styles.hidden}`}>
                        <div className={styles.flexContainer}>
                            <span>Muito fácil</span>
                            <span>Muito difícil</span>
                        </div>

                        <ul className={styles.difficulty}>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                    </div>
            </div>
        </>
    );
};

export default Cards;
