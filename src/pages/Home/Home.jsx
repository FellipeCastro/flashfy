import { useNavigate } from "react-router-dom";
import { useState } from "react";
import subjects from "../../subjects";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import styles from "./Home.module.css";

const Home = ({
    isSidebarOpen,
    setIsSidebarOpen,
    decks,
    progress,
    selectedSubjects,
    setSelectedSubjects,
}) => {
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const navigate = useNavigate();

    const subjectColors = subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.color;
        return acc;
    }, {});

    const createDeck = (subject, title) => {
        

        // Fecha o formulário de adicionar deck
        setIsAddDeckFormOpen(false);
    };

    // Função que alterna a seleção de uma matéria
    const handleSubjectSelection = (subject) => {
        setSelectedSubjects(
            (prevSubjects) =>
                // Verifica se a matéria já está na lista de materias selecionadas
                prevSubjects.includes(subject)
                    ? prevSubjects.filter((t) => t !== subject) // Se já estiver na lista, remove a matéria filtrando o array para não incluí-la
                    : [...prevSubjects, subject] // Se não estiver na lista, adiciona a matéria ao final do array
        );
    };

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <ProgressBar progress={progress} />

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
                                    onClick={() =>
                                        handleSubjectSelection(subject.name)
                                    }
                                    className={
                                        selectedSubjects.includes(subject.name)
                                            ? styles.active
                                            : null
                                    }
                                >
                                    {subject.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.deleteSubjectContainer}>
                        <button className={styles.deleteSubjectBtn}>
                            Excluir matéria
                        </button>
                    </div>
                    {decks.length === 0 && (
                        <div className={styles.noDecks}>
                            <p className={styles.msg}>
                                Crie seus decks para começar a estudar!
                            </p>
                        </div>
                    )}
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
                                    key={deck.idDeck}
                                    color={subjectColors[deck.subject]}
                                    subject={deck.subject}
                                    title={deck.title}
                                    cards={deck.cards.length}
                                    nextReview={deck.nextReview}
                                    openCard={() =>
                                        navigate(`/cards/${deck.idDeck}`)
                                    }
                                />
                            ))}
                    </ul>
                </div>
            </div>

            {isAddDeckFormOpen && (
                <AddDeckForm
                    setIsAddDeckFormOpen={setIsAddDeckFormOpen}
                    setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                    subjects={subjects}
                    createDeck={createDeck}
                />
            )}

            {isAddSubjectFormOpen && (
                <AddSubjectForm
                    setIsAddDeckFormOpen={setIsAddDeckFormOpen}
                    setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                />
            )}
        </>
    );
};

export default Home;
