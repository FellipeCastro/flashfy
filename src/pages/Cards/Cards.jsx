import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import styles from "./Cards.module.css";
import Button from "../../components/Button/Button";
import AddCardForm from "../../components/AddCardForm/AddCardForm";

const Cards = ({ decks, setDecks, updateDeck, setProgress }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Encontra o deck correspondente ao ID na URL
    const selectedDeck = decks.find((deck) => deck.id === parseInt(id));

    const [showAnswer, setShowAnswer] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [isAddCardFormOpen, setIsAddCardFormOpen] = useState(false);

    useEffect(() => {
        setCurrentDeck(selectedDeck);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSelectedDifficulty(null);
    }, [decks, id]);

    const createCard = (question, answer) => {
        setDecks((prevDecks) =>
            prevDecks.map((deck) => {
                if (deck.title === selectedDeck.title) {
                    return {
                        ...deck,
                        cards: [...deck.cards, { question, answer }],
                    };
                }
                return deck;
            })
        );

        setIsAddCardFormOpen(false);
    };

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
    };

    const handleFinalize = () => {
        // Calcular dificuldades (com fallback para 1 se não definido)
        const difficulties = currentDeck.cards.map(
            (card) => card.difficulty || 1
        );

        // Calcular média e arredondar
        const average = Math.round(
            difficulties.reduce((sum, value) => sum + value, 0) /
                difficulties.length
        );

        // Determinar dias para adicionar
        const daysToAdd =
            {
                1: 7,
                2: 5,
                3: 3,
                4: 1,
            }[average] || 3; // Fallback para 3 dias se average for inesperado

        // Calcular nova data
        const newReviewDate = new Date();
        newReviewDate.setDate(newReviewDate.getDate() + daysToAdd);

        // Criar novo deck atualizado
        const updatedDeck = {
            ...currentDeck,
            nextReview: newReviewDate.toISOString(),
        };


        // Adicionando 1 aos decks estudados
        setProgress((prev) => ({
            ...prev,
            studiedDecks: prev.studiedDecks + 1,
        }))

        // Atualizar estados
        updateDeck(updatedDeck);
        
        // Navegar para home
        navigate("/");
    };

    // Fazer validação currentDeck.cards.length === 0
    if (!currentDeck) {
        return (
            <>
                <header className={styles.header}>
                    <div className={styles.titleContainer}>
                        <Link to="/">
                            <FaArrowLeft />
                        </Link>
                        <h1>Deck não encontrado</h1>
                    </div>
                </header>
                <div className={styles.mainContainer}>
                    <p>Esse deck não existe</p>
                </div>
            </>
        );
    }

    if (currentDeck.cards.length === 0) {
        return (
            <>
                <header className={styles.header}>
                    <div className={styles.titleContainer}>
                        <Link to="/">
                            <FaArrowLeft />
                        </Link>
                        <h1>{currentDeck.title}</h1>
                        <button className={styles.deleteBtn}>
                            <FaTrashAlt />
                        </button>
                    </div>

                    <div className={styles.btnsContainer}>
                        <Button onClick={() => setIsAddCardFormOpen(true)}>
                            + Novo Card
                        </Button>
                    </div>
                </header>
                <div className={styles.mainContainer}>
                    <p>Crie cards para responder nesse deck</p>
                </div>
            </>
        );
    }

    const currentCard = currentDeck.cards[currentCardIndex];
    const progress =
        ((currentCardIndex + 1) / currentDeck.cards.length) * 100;

    return (
        <>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <Link to="/">
                        <FaArrowLeft />
                    </Link>
                    <h1>{currentDeck.title}</h1>
                    <button className={styles.deleteBtn}>
                        <FaTrashAlt />
                    </button>
                </div>

                <div className={styles.btnsContainer}>
                    <Button onClick={() => setIsAddCardFormOpen(true)}>
                        + Novo Card
                    </Button>
                </div>
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
                            showAnswer ? styles.showAnswer : null
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
                        showAnswer ? null : styles.hidden
                    }`}
                >
                    <div className={styles.flexContainer}>
                        <span>Muito fácil</span>
                        <span>Muito difícil</span>
                    </div>

                    <ul className={styles.difficulty}>
                        {[1, 2, 3, 4].map((level) => (
                            <li
                                key={level}
                                className={
                                    currentCard.difficulty === level ||
                                    selectedDifficulty === level
                                        ? styles.selected
                                        : null
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

            {isAddCardFormOpen && (
                <AddCardForm
                    setIsAddCardFormOpen={setIsAddCardFormOpen}
                    createCard={createCard}
                />
            )}
        </>
    );
};

export default Cards;
