import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import AddDeckWithAIForm from "../../components/AddDeckWithAIForm/AddDeckWithAIForm";
import api from "../../constants/api";
import styles from "./Home.module.css";

const Home = ({
    isSidebarOpen,
    setIsSidebarOpen,
    decks,
    progress,
    subjects,
    loadData,
    loading,
}) => {
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);
    const [isAddDeckWithAIFormOpen, setIsAddDeckWithAIFormOpen] =
        useState(false);
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const createDeck = async (idSubject, title) => {
        try {
            const response = await api.post("/decks", {
                idSubject,
                title,
            });
            if (response.data) {
                setIsAddDeckFormOpen(false);
                loadData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const generateDeckWithAI = async (idSubject, theme, quantity) => {
        try {
            await api.post("/ai/create-deck", { idSubject, theme, quantity });

            loadData();
            setIsAddDeckWithAIFormOpen(false);
        } catch (error) {
            console.error("Erro ao gerar deck com IA:", error);
        }
    };

    const createSubject = async (name, color) => {
        try {
            const response = await api.post("/subjects", {
                name,
                color,
            });
            if (response.data) {
                setIsAddSubjectFormOpen(false);
                loadData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubjectSelection = (subject) => {
        setSelectedSubjects((prevSubjects) =>
            prevSubjects.includes(subject)
                ? prevSubjects.filter((t) => t !== subject)
                : [...prevSubjects, subject]
        );
    };

    const filteredDecks = decks.filter((deck) => {
        // Filtro por matéria
        const subjectFilter =
            selectedSubjects.length === 0 ||
            selectedSubjects.includes(deck.subject.name);

        // Filtro por busca
        const searchFilter =
            searchTerm === "" ||
            deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deck.subject.name.toLowerCase().includes(searchTerm.toLowerCase());

        return subjectFilter && searchFilter;
    });

    // Ordenação aplicada ao array filtrado
    const sortedAndFilteredDecks = filteredDecks.sort((a, b) => {
        const now = new Date();

        // Tratamento para decks sem nextReview
        if (!a.nextReview && !b.nextReview) return 0;
        if (!a.nextReview) return 1;
        if (!b.nextReview) return -1;

        const aDate = new Date(a.nextReview);
        const bDate = new Date(b.nextReview);

        // Decks com nextReview no passado têm prioridade
        if (aDate < now && bDate >= now) return -1;
        if (bDate < now && aDate >= now) return 1;

        // Ordenação por data mais próxima
        return aDate - bDate;
    });

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <ProgressBar progress={progress} />

                    {loading ? (
                        <p id="loader">Carregando dados...</p>
                    ) : (
                        <>
                            <div className={styles.titleContainer}>
                                <h1>Meus decks</h1>
                                <div className={styles.buttons}>
                                    <Button
                                        onClick={() =>
                                            setIsAddDeckWithAIFormOpen(true)
                                        }
                                        secondary
                                    >
                                        <BsStars /> Deck Por IA
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setIsAddDeckFormOpen(true)
                                        }
                                    >
                                        + Novo deck
                                    </Button>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Pesquisar deck"
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div className={styles.filterContainer}>
                                {subjects.map((subject) => {
                                    return (
                                        <button
                                            key={subject.idSubject}
                                            style={{
                                                backgroundColor: subject.color,
                                            }}
                                            onClick={() =>
                                                handleSubjectSelection(
                                                    subject.name
                                                )
                                            }
                                            className={
                                                selectedSubjects.includes(
                                                    subject.name
                                                )
                                                    ? styles.active
                                                    : null
                                            }
                                        >
                                            {subject.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {filteredDecks.length === 0 && !loading && (
                                <div className={styles.noDecks}>
                                    <div className={styles.illustration}>
                                        <div className={styles.cardStack}>
                                            <div className={styles.card}></div>
                                            <div className={styles.card}></div>
                                            <div className={styles.card}></div>
                                        </div>
                                    </div>
                                    <h3 className={styles.title}>
                                        {selectedSubjects.length > 0 ||
                                        searchTerm
                                            ? "Nenhum deck encontrado com os filtros aplicados"
                                            : "Nenhum deck criado ainda"}
                                    </h3>
                                    <p className={styles.msg}>
                                        {selectedSubjects.length > 0 ||
                                        searchTerm
                                            ? "Tente ajustar os filtros de busca"
                                            : "Comece organizando seus estudos criando seu primeiro deck!"}
                                    </p>
                                    <Button
                                        onClick={() =>
                                            setIsAddDeckFormOpen(true)
                                        }
                                    >
                                        Criar Deck
                                    </Button>
                                </div>
                            )}

                            <ul className={styles.decksContainer}>
                                {sortedAndFilteredDecks.map((deck) => (
                                    <Deck
                                        key={deck.idDeck}
                                        color={deck.subject.color}
                                        subject={deck.subject.name}
                                        title={deck.title}
                                        cards={deck.cards.length}
                                        nextReview={deck.nextReview}
                                        openCard={() =>
                                            navigate(`/cards/${deck.idDeck}`)
                                        }
                                    />
                                ))}
                            </ul>
                        </>
                    )}
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

            {isAddDeckWithAIFormOpen && (
                <AddDeckWithAIForm
                    setIsAddDeckWithAIFormOpen={setIsAddDeckWithAIFormOpen}
                    setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                    subjects={subjects}
                    generateDeckWithAI={generateDeckWithAI}
                    loadData={loadData}
                />
            )}

            {isAddSubjectFormOpen && (
                <AddSubjectForm
                    setIsAddDeckFormOpen={setIsAddDeckFormOpen}
                    setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                    createSubject={createSubject}
                />
            )}
        </>
    );
};

export default Home;
