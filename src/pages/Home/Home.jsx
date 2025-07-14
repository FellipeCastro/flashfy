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

const Home = ({ isSidebarOpen, setIsSidebarOpen, decks, setDecks, progress, setProgress }) => {
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
            id: window.crypto.getRandomValues(new Uint32Array(1))[0],
            title: title,
            subject: subject,
            cards: [], // Começa sem cards
        };

        // Atualiza o estado adicionando o novo deck
        setDecks([...decks, newDeck]);

        console.log(decks);

        // Fecha o formulário de adicionar deck
        setIsAddDeckFormOpen(false);
    };

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <ProgressBar 
                        progress={progress}
                        setProgress={setProgress}
                    />

                    <div className={styles.titleContainer}>
                        <h1>Meus decks</h1>
                        <div className={styles.btnsContainer}>
                            <Button onClick={() => setIsAddDeckFormOpen(true)}>
                                + Novo deck
                            </Button>
                        </div>
                    </div>
                    <div className={styles.filterContainer}>
                        {subjects.map((subject) => {
                            return (
                                <button
                                    key={subject.name}
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
                        {decks.length === 0 && (
                            <p>Crie seus decks para começar a estudar!</p>
                        )}
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
