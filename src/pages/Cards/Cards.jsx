import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight, MdOutlineCheck } from "react-icons/md";
import Button from "../../components/Button/Button";
import AddCardForm from "../../components/AddCardForm/AddCardForm";
import Loading from "../../components/Loading/Loading.jsx";
import api from "../../constants/api.js";
import styles from "./Cards.module.css";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.jsx";

const Cards = ({ decks, loadData }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const selectedDeck = decks.find((deck) => deck.idDeck === parseInt(id));

    const [showAnswer, setShowAnswer] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [isAddCardFormOpen, setIsAddCardFormOpen] = useState(false);
    const [difficulties, setDifficulties] = useState([]);
    const [isCreatingCard, setIsCreatingCard] = useState(false);
    const [isStudyingDeck, setIsStudyingDeck] = useState(false);
    const [isDeletingDeck, setIsDeletingDeck] = useState(false);
    const [deleteDeckModal, setDeleteDeckModal] = useState(false);
    const [studyDeckModal, setStudyDeckModal] = useState(false);

    useEffect(() => {
        setCurrentDeck(selectedDeck);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSelectedDifficulty(null);

        if (selectedDeck?.cards) {
            setDifficulties(
                selectedDeck.cards.map((card) => card.difficulty || null)
            );
        }
    }, [decks, id]);

    const createCard = async (question, answer) => {
        try {
            setIsCreatingCard(true);
            const response = await api.post("/cards", {
                idDeck: id,
                question,
                answer,
            });
            if (response.data) {
                setIsAddCardFormOpen(false);
                loadData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCreatingCard(false);
        }
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

        const updatedDifficulties = [...difficulties];
        updatedDifficulties[currentCardIndex] = level;
        setDifficulties(updatedDifficulties);

        setCurrentDeck(updatedDeck);
        setSelectedDifficulty(level);
    };

    const handleFinalize = async () => {
        try {
            setIsStudyingDeck(true);

            const response = await api.put("/decks/study", {
                idDeck: id,
                difficulties: difficulties,
            });

            if (response.data) {
                navigate("/home");
                loadData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsStudyingDeck(false);
            setStudyDeckModal(false);
        }
    };

    const deleteDeck = async () => {
        try {
            setIsDeletingDeck(true);
            const response = await api.delete(`/decks/${id}`);
            if (response.data) {
                navigate("/home");
                loadData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeletingDeck(false);
            setDeleteDeckModal(false);
        }
    };

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
                    <p className={styles.msg}>Esse deck não existe!</p>
                </div>
            </>
        );
    }

    const currentCard = currentDeck.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / currentDeck.cards.length) * 100;

    return (
        <>
            {isCreatingCard && <Loading />}
            {isStudyingDeck && <Loading />}
            {isDeletingDeck && <Loading />}

            {deleteDeckModal && (
                <ConfirmModal
                    title={"Deletar Deck"}
                    description={"Tem certeza que deseja excluir esse deck?"}
                    btnText={"Confirmar"}
                    onClick={deleteDeck}
                    onCancel={() => setDeleteDeckModal(false)}
                />
            )}

            {studyDeckModal && (
                <ConfirmModal
                    title={"Finalizar estudo"}
                    description={"Deseja finalizar o estudo desse deck?"}
                    btnText={"Confirmar"}
                    onClick={handleFinalize}
                    onCancel={() => setStudyDeckModal(false)}
                    success
                />
            )}

            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <Link to="/home">
                        <FaArrowLeft />
                    </Link>
                    <h1>{currentDeck.title}</h1>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteDeckModal(true)}
                    >
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
                {currentDeck.cards.length === 0 ? (
                    <p className={styles.msg}>Crie cards para responder!</p>
                ) : (
                    <>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progress}
                                style={{ width: `${progress}%` }}
                            ></div>
                            <span className={styles.progressText}>
                                {currentCardIndex + 1}/
                                {currentDeck.cards.length}
                            </span>
                        </div>
                        <div className={styles.card}>
                            <p className={styles.question}>
                                {currentCard.question}
                            </p>
                            <div
                                className={`${styles.answer} ${
                                    showAnswer ? styles.showAnswer : null
                                }`}
                                onClick={() => setShowAnswer(!showAnswer)}
                            >
                                <div
                                    className={`${styles.face} ${styles.back}`}
                                >
                                    <p>Clique para ver a resposta</p>
                                </div>
                                <div
                                    className={`${styles.face} ${styles.front}`}
                                >
                                    <p>{currentCard.answer}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${styles.feedbackContainer} ${
                                showAnswer ? null : styles.hidden
                            }`}
                        >
                            <div className={styles.feedback}>
                                <div className={styles.flexContainer}>
                                    <span>Muito fácil</span>
                                    <span>Muito difícil</span>
                                </div>
                                <div className={styles.flexContainer}>
                                    <button
                                        onClick={handlePrevCard}
                                        disabled={currentCardIndex === 0}
                                        className={styles.navBtn}
                                    >
                                        <MdArrowLeft />
                                    </button>
                                    <ul className={styles.difficulty}>
                                        {[1, 2, 3, 4].map((level) => (
                                            <li
                                                key={level}
                                                className={
                                                    currentCard.difficulty ===
                                                        level ||
                                                    selectedDifficulty === level
                                                        ? styles.selected
                                                        : null
                                                }
                                                onClick={() =>
                                                    handleSetDifficulty(level)
                                                }
                                            >
                                                {level}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={
                                            currentCardIndex ===
                                            currentDeck.cards.length - 1
                                                ? () => setStudyDeckModal(true)
                                                : handleNextCard
                                        }
                                        className={styles.navBtn}
                                    >
                                        <MdArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
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
