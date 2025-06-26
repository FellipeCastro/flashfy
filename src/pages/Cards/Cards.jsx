import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./Cards.module.css";

const Cards = () => {
    const { state } = useLocation();
    const decks = state?.decks || [];
    const { id } = useParams();
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [deck, setDeck] = useState(null);
    const [difficulty, setDifficulty] = useState(null);

    useEffect(() => {
        // Encontra o deck correspondente ao ID na URL
        const selectedDeck = decks.find((deck) => deck.id === parseInt(id));
        setDeck(selectedDeck);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setDifficulty(null);
    }, [id, decks]);

    const handleNextCard = () => {
        if (currentCardIndex < deck.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
            setDifficulty(null);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowAnswer(false);
            setDifficulty(null);
        }
    };

    const handleSetDifficulty = (level) => {
        setDifficulty(level);
        // Aqui você pode adicionar lógica para salvar a dificuldade do card
        // fazer a media das dificudades
        // 
    };

    if (!deck || deck.cards.length === 0) {
        return (
            <>
                <header className={styles.header}>
                    <Link to="/">
                        <FaArrowLeft />
                    </Link>
                    <h1>Deck não encontrado</h1>
                </header>
                <div className={styles.mainContainer}>
                    <p>Não há cards neste deck ou o deck não existe.</p>
                </div>
            </>
        );
    }

    const currentCard = deck.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / deck.cards.length) * 100;

    return (
        <>
            <header className={styles.header}>
                <Link to="/">
                    <FaArrowLeft />
                </Link>
                <h1>{deck.title}</h1>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: `${progress}%` }}
                    ></div>
                    <span className={styles.progressText}>
                        {currentCardIndex + 1}/{deck.cards.length}
                    </span>
                </div>
                <div className={styles.card}>
                    <p className={styles.question}>{currentCard.question}</p>
                    <div
                        className={`${styles.answer} ${
                            showAnswer ? styles.showAnswer : ""
                        }`}
                        onClick={() => !showAnswer && setShowAnswer(true)}
                    >
                        <div className={`${styles.face} ${styles.back}`}>
                            <p>Clique para ver a resposta</p>
                        </div>
                        <div className={`${styles.face} ${styles.front}`}>
                            <p>{currentCard.answer}</p>
                        </div>
                    </div>
                </div>

                <div
                    className={`${styles.feedback} ${
                        showAnswer ? "" : styles.hidden
                    }`}
                >
                    <div className={styles.flexContainer}>
                        <span>Muito fácil</span>
                        <span>Muito difícil</span>
                    </div>

                    <ul className={styles.difficulty}>
                        {[1, 2, 3, 4, 5].map((level) => (
                            <li
                                key={level}
                                className={
                                    difficulty === level ? styles.selected : ""
                                }
                                onClick={() => handleSetDifficulty(level)}
                            >
                                {level}
                            </li>
                        ))}
                    </ul>

                    <div className={styles.flexContainer}>
                        <button
                            onClick={handlePrevCard}
                            disabled={currentCardIndex === 0}
                            className={styles.navBtn}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNextCard}
                            disabled={
                                currentCardIndex === deck.cards.length - 1
                            }
                            className={styles.navBtn}
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cards;
