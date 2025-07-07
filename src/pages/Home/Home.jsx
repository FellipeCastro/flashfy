import { useNavigate } from "react-router-dom";
import { useState } from "react";
import subjects from "../../subjects";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddCardForm from "../../components/AddCardForm/AddCardForm";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import styles from "./Home.module.css";

const Home = ({ isSidebarOpen, setIsSidebarOpen, decks, setDecks }) => {
    const [isAddCardFormOpen, setIsAddCardFormOpen] = useState(false);
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);
    const navigate = useNavigate();

    const subjectColors = subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.color;
        return acc;
    }, {});

    const createDeck = (subject, title) => {
        // Verifica se já existe um deck com o mesmo título
        const deckExists = decks.some(
            (deck) =>
                deck.title.toLowerCase() === title.toLowerCase() &&
                deck.subject === subject
        );

        if (deckExists) {
            alert("Já existe um deck com este título para esta matéria!");
            return;
        }

        // Cria o novo deck
        const newDeck = {
            title: title,
            subject: subject,
            cards: [], // Começa sem cards
            toDo: false,
        };

        // Atualiza o estado adicionando o novo deck
        setDecks([...decks, newDeck]);

        // Fecha o formulário de adicionar deck
        setIsAddDeckFormOpen(false);
    };

    const createCard = (title, question, answer) => {
        setDecks((prevDecks) =>
            prevDecks.map((deck) => {
                if (deck.title === title) {
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

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <ProgressBar />

                    <div className={styles.titleContainer}>
                        <h1>Meus decks</h1>
                        <div className={styles.btnsContainer}>
                            <Button
                                secondary
                                onClick={() => setIsAddDeckFormOpen(true)}
                            >
                                + Novo deck
                            </Button>
                            <Button onClick={() => setIsAddCardFormOpen(true)}>
                                + Novo card
                            </Button>
                        </div>
                    </div>
                    <div className={styles.filterContainer}>
                        {subjects.map((subject) => {
                            return (
                                <button
                                    style={{
                                        backgroundColor: subject.color,
                                    }}
                                >
                                    {subject.name}
                                </button>
                            );
                        })}
                    </div>
                    <ul className={styles.decksContainer}>
                        {decks
                            .sort((a, b) => {
                                const now = new Date();

                                // Trata decks sem data (vão para o final)
                                if (!a.nextReview && !b.nextReview) return 0;
                                if (!a.nextReview) return 1;
                                if (!b.nextReview) return -1;

                                const aDate = new Date(a.nextReview);
                                const bDate = new Date(b.nextReview);

                                // Prioritiza revisões vencidas (datas passadas)
                                if (aDate < now && bDate >= now) return -1;
                                if (bDate < now && aDate >= now) return 1;

                                // Ordena pela data mais próxima (crescente)
                                return aDate - bDate;
                            })
                            .map((deck) => (
                                <Deck
                                    key={deck.id}
                                    color={subjectColors[deck.subject]}
                                    subject={deck.subject}
                                    title={deck.title}
                                    cards={deck.cards.length}
                                    nextReview={deck.nextReview}
                                    openCard={() =>
                                        navigate(`/cards/${deck.id}`)
                                    }
                                />
                            ))}
                    </ul>
                </div>
            </div>

            {isAddCardFormOpen && (
                <AddCardForm
                    setIsAddCardFormOpen={setIsAddCardFormOpen}
                    decks={decks}
                    createCard={createCard}
                />
            )}
            
            {isAddDeckFormOpen && (
                <AddDeckForm
                    setIsAddDeckFormOpen={setIsAddDeckFormOpen}
                    subjects={subjects}
                    createDeck={createDeck}
                />
            )}
        </>
    );
};

export default Home;
