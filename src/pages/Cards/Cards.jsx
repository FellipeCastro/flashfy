import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import mockDecks from "../../mockDecks";
import styles from "./Cards.module.css";

const Cards = () => {
    const { state } = useLocation();
    const { decks, onUpdateDeck } = state || {};
    const { id } = useParams();
    const navigate = useNavigate();

    const [showAnswer, setShowAnswer] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);

    const difficults = [];

    useEffect(() => {
        // Encontra o deck correspondente ao ID na URL
        const selectedDeck = mockDecks?.find(
            (deck) => deck.id === parseInt(id)
        );
        setCurrentDeck(selectedDeck);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSelectedDifficulty(null);
    }, [id, decks]);

    const handleNextCard = () => {
        if (currentCardIndex < currentDeck?.cards?.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
            setSelectedDifficulty(null);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowAnswer(false);
            setSelectedDifficulty(null);
        }
    };

    const handleSetDifficulty = (level) => {
        const updatedCards = currentDeck.cards.map((card, index) =>
            index === currentCardIndex ? { ...card, difficulty: level } : card
        );

        const updatedDeck = {
            ...currentDeck,
            cards: updatedCards,
        };

        setCurrentDeck(updatedDeck);
        setSelectedDifficulty(level);

        // Atualiza no estado global se a função estiver disponível
        if (onUpdateDeck) {
            onUpdateDeck(updatedDeck);
        }
    };

    const handleFinalize = () => {
        currentDeck.cards.map((deck) => {
            if (!deck.difficulty) {
                difficults.push(1);
                return;
            }
            difficults.push(deck.difficulty);
        });
        console.log(difficults);
        // Alteração da data da próxima revisão
        navigate("/");
    };

    if (!currentDeck || currentDeck.cards.length === 0) {
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

    const currentCard = currentDeck.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / currentDeck.cards.length) * 100;

    return (
        <>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <Link to="/">
                        <FaArrowLeft />
                    </Link>
                    <h1>{currentDeck.title}</h1>
                </div>

                <button className={styles.deleteBtn}>
                    <FaTrashAlt />
                </button>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: `${progress}%` }}
                    ></div>
                    <span className={styles.progressText}>
                        {currentCardIndex + 1}/{currentDeck.cards.length}
                    </span>
                </div>
                <div className={styles.card}>
                    <p className={styles.question}>{currentCard.question}</p>
                    <div
                        className={`${styles.answer} ${
                            showAnswer ? styles.showAnswer : ""
                        }`}
                        onClick={() => setShowAnswer(!showAnswer)}
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
                                    currentCard.difficulty === level ||
                                    selectedDifficulty === level
                                        ? styles.selected
                                        : ""
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
                            onClick={
                                currentCardIndex ===
                                currentDeck.cards.length - 1
                                    ? handleFinalize
                                    : handleNextCard
                            }
                            className={styles.navBtn}
                        >
                            {currentCardIndex === currentDeck.cards.length - 1
                                ? "Finalizar"
                                : "Próximo"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cards;
