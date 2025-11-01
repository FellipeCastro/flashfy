import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight , FaTrashAlt } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import Button from "../../components/Button/Button";
import AddCardForm from "../../components/AddCardForm/AddCardForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import CardComponent from "../../components/CardComponent/CardComponent"
import api from "../../constants/api.js";
import styles from "./Cards.module.css";

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
    const [isStudyingDeck, setIsStudyingDeck] = useState(false);
    const [isDeletingDeck, setIsDeletingDeck] = useState(false);
    const [isDeletingCard, setIsDeletingCard] = useState(false);
    const [deleteCardModal, setDeleteCardModal] = useState(false);
    const [deleteDeckModal, setDeleteDeckModal] = useState(false);
    const [studyDeckModal, setStudyDeckModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);

    useEffect(() => {
        setCurrentDeck(selectedDeck);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSelectedDifficulty(null);

        if (selectedDeck?.cards) {
            setDifficulties(new Array(selectedDeck.cards.length).fill(null));
        }
    }, [decks, id]);

    const createCard = async (question, answer) => {
        try {
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
        const updatedDifficulties = [...difficulties];
        updatedDifficulties[currentCardIndex] = level;
        setDifficulties(updatedDifficulties);
        setSelectedDifficulty(level);
    };

    const handleFinalize = async () => {
        try {
            setIsStudyingDeck(true);

            const response = await api.put("/decks/study", {
                idDeck: id,
                difficulties,
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

    const deleteCard = async (idCard) => {
        try {
            setIsDeletingCard(true);
            const response = await api.delete(`/cards/${idCard}`);
            if (response.data) {
                loadData();
                setDeleteCardModal(false);
                setCardToDelete(null);

                // Se era o último card, volta para o primeiro
                if (currentCardIndex >= currentDeck.cards.length - 1) {
                    setCurrentCardIndex(0);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeletingCard(false);
        }
    };

    const handleOpenDeleteCardModal = (idCard) => {
        setCardToDelete(idCard);
        setDeleteCardModal(true);
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
    const currentDifficulty = difficulties[currentCardIndex];

    return (
        <>
            {deleteDeckModal && (
                <ConfirmModal
                    title={"Deletar Deck"}
                    description={"Tem certeza que deseja excluir esse deck?"}
                    btnText={"Confirmar"}
                    onClick={deleteDeck}
                    onCancel={() => setDeleteDeckModal(false)}
                    isLoading={isDeletingDeck}
                    loadingText={"Deletando Deck..."}
                />
            )}

            {deleteCardModal && (
                <ConfirmModal
                    title={"Deletar Card"}
                    description={"Tem certeza que deseja excluir esse card?"}
                    btnText={"Confirmar"}
                    onClick={() => deleteCard(cardToDelete)}
                    onCancel={() => {
                        setDeleteCardModal(false);
                        setCardToDelete(null);
                    }}
                    isLoading={isDeletingCard}
                    loadingText={"Deletando Card..."}
                />
            )}

            {studyDeckModal && (
                <ConfirmModal
                    title={"Finalizar estudo"}
                    description={"Deseja finalizar o estudo desse deck?"}
                    btnText={"Confirmar"}
                    onClick={handleFinalize}
                    onCancel={() => setStudyDeckModal(false)}
                    isLoading={isStudyingDeck}
                    loadingText={"Finalizando.."}
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
                        title={"Deletar deck"}
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
                    <div className={styles.noCards}>
                        <div className={styles.illustration}>
                            <div className={styles.emptyCard}>
                                <div className={styles.cardIcon}>?</div>
                            </div>
                            <div className={styles.floatingPlus}>+</div>
                        </div>
                        <h3 className={styles.title}>
                            Nenhum card criado ainda
                        </h3>
                        <p className={styles.msg}>
                            Crie seu primeiro card para começar a estudar{" "}
                            <strong>{currentDeck.title}</strong>
                        </p>
                        <Button onClick={() => setIsAddCardFormOpen(true)}>
                            + Criar Primeiro Card
                        </Button>

                        <div className={styles.tips}>
                            <div className={styles.tip}>
                                <span className={styles.tipNumber}>1</span>
                                <p>
                                    Escreva uma pergunta clara na frente do card
                                </p>
                            </div>
                            <div className={styles.tip}>
                                <span className={styles.tipNumber}>2</span>
                                <p>
                                    Adicione a resposta ou explicação no verso
                                </p>
                            </div>
                            <div className={styles.tip}>
                                <span className={styles.tipNumber}>3</span>
                                <p>
                                    Revise regularmente para melhor memorização
                                </p>
                            </div>
                        </div>
                    </div>
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

                        <div class={styles.cardContainer}>
                            <CardComponent alternativeClass={styles.card}>
                                <p className={styles.question}>
                                    {currentCard.question}
                                    <button
                                        className={styles.deleteCardBtn}
                                        onClick={() =>
                                            handleOpenDeleteCardModal(
                                                currentCard.idCard
                                            )
                                        }
                                        title="Deletar card"
                                    >
                                        <FaTrashAlt />
                                    </button>
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
                            </CardComponent>
                        </div>

                        <CardComponent
                            alternativeClass={`${styles.feedbackContainer} ${
                                showAnswer ? null : styles.hidden
                            }`}
                        >
                            <div className={styles.feedback}>
                                <div className={styles.flexContainer}>
                                    <span>Muito fácil</span>
                                    <span>Muito difícil</span>
                                </div>
                                <ul className={styles.difficulty}>
                                    {[1, 2, 3, 4].map((level) => (
                                        <li
                                            key={level}
                                            className={
                                                currentDifficulty === level ||
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
                                <div className={styles.flexContainer}>
                                    <button
                                        onClick={handlePrevCard}
                                        disabled={currentCardIndex === 0}
                                        className={styles.navBtn}
                                    >
                                        <MdArrowLeft /> Anterior
                                    </button>

                                    <button
                                        onClick={handleNextCard}
                                        disabled={
                                            currentCardIndex ===
                                            currentDeck.cards.length - 1
                                        }
                                        className={styles.navBtn}
                                    >
                                        Próximo <MdArrowRight />
                                    </button>
                                </div>
                            </div>
                        </CardComponent>
                    </>
                )}
                {currentCardIndex === currentDeck.cards.length - 1 ? (
                    <div
                        className={`${styles.finalizeBtn} ${
                            showAnswer ? null : styles.hidden
                        }`}
                    >
                        <Button onClick={() => setStudyDeckModal(true)}>
                            Finalizar estudo
                        </Button>
                    </div>
                ) : null}
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
