import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import AddDeckWithAIForm from "../../components/AddDeckWithAIForm/AddDeckWithAIForm";
import Loading from "../../components/Loading/Loading";
import api from "../../constants/api";
import styles from "./Home.module.css";


const Home = ({
    isSidebarOpen,
    setIsSidebarOpen,
    decks,
    progress,
    subjects,
    selectedSubjects,
    setSelectedSubjects,
    loadData,
    loading,
}) => {
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);
    const [isAddDeckWithAIFormOpen, setIsAddDeckWithAIFormOpen] = useState(false);
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [isCreatingSubject, setIsCreatingSubject] = useState(false);
    const navigate = useNavigate();

    // MUDANÇA 1: A função createDeck voltou ao normal.
    // Ela agora só se preocupa com o modal de criação manual.
    const createDeck = async (idSubject, title) => {
        try {
            setIsCreatingDeck(true);
            const response = await api.post("/decks", {
                idSubject,
                title,
            });
            if (response.data) {
                setIsAddDeckFormOpen(false); // Apenas fecha o modal de formulário manual
                loadData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCreatingDeck(false);
        }
    };
    
   const generateDeckWithAI = async (idSubject, theme, quantity) => {
        // Esta função será chamada pelo modal AddDeckWithAIForm
        try {
            // Reutilizamos o estado de loading para dar feedback visual ao usuário
            setIsCreatingDeck(true); 
            
            // Esta é a chamada REAL para a sua nova rota no backend
            await api.post("/ai/create-deck", { idSubject, theme, quantity });
            
            // Se a chamada for bem-sucedida, atualizamos os dados e fechamos o modal
            loadData();
            setIsAddDeckWithAIFormOpen(false);
        } catch (error) {
            console.error("Erro ao gerar deck com IA:", error);
            // O ideal é passar uma função de erro para o modal exibir a mensagem
            // Mas por enquanto, um alerta ou log é suficiente.
        } finally {
            setIsCreatingDeck(false); // Garante que o loading pare, mesmo se der erro
        }
    };

    const createSubject = async (name, color) => {
        try {
            setIsCreatingSubject(true);
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
        } finally {
            setIsCreatingSubject(false);
        }
    };

    const handleSubjectSelection = (subject) => {
        setSelectedSubjects((prevSubjects) =>
            prevSubjects.includes(subject)
                ? prevSubjects.filter((t) => t !== subject)
                : [...prevSubjects, subject]
        );
    };

    return (
        <>
            {isCreatingDeck && <Loading />}
            {isCreatingSubject && <Loading />}

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
                                {/* A div dos botões foi mantida como no seu código */}
                                <div className={styles.buttons}>
                                    <Button
                                        onClick={() => setIsAddDeckFormOpen(true)}
                                    >
                                        + Novo deck
                                    </Button>
                                    <Button
                                        onClick={() => setIsAddDeckWithAIFormOpen(true)}
                                    >
                                        + Novo deck Por IA
                                    </Button>
                                </div>
                            </div>

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

                            {decks.length === 0 && loading === false && (
                                <div className={styles.noDecks}>
                                    <div className={styles.illustration}>
                                        <div className={styles.cardStack}>
                                            <div className={styles.card}></div>
                                            <div className={styles.card}></div>
                                            <div className={styles.card}></div>
                                        </div>
                                    </div>
                                    <h3 className={styles.title}>
                                        {selectedSubjects.length > 0
                                            ? "Nenhum deck criado nessa matéria"
                                            : "Nenhum deck criado ainda"}
                                    </h3>
                                    <p className={styles.msg}>
                                        Comece organizando seus estudos criando
                                        seu primeiro deck!
                                    </p>
                                    <Button
                                        onClick={() =>
                                            setIsAddDeckFormOpen(true)
                                        }
                                    >
                                        Criar Meu Primeiro Deck
                                    </Button>
                                </div>
                            )}

                            <ul className={styles.decksContainer}>
                                {decks
                                    .sort((a, b) => {
                                        const now = new Date();
                                        if (!a.nextReview && !b.nextReview)
                                            return 0;
                                        if (!a.nextReview) return 1;
                                        if (!b.nextReview) return -1;
                                        const aDate = new Date(a.nextReview);
                                        const bDate = new Date(b.nextReview);
                                        if (aDate < now && bDate >= now)
                                            return -1;
                                        if (bDate < now && aDate >= now)
                                            return 1;
                                        return aDate - bDate;
                                    })
                                    .map((deck) => (
                                        <Deck
                                            key={deck.idDeck}
                                            color={deck.subject.color}
                                            subject={deck.subject.name}
                                            title={deck.title}
                                            cards={deck.cards.length}
                                            nextReview={deck.nextReview}
                                            openCard={() =>
                                                navigate(
                                                    `/cards/${deck.idDeck}`
                                                )
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
            
            {/* MUDANÇA 3: Adicionamos a renderização do novo modal aqui. */}
            {isAddDeckWithAIFormOpen && (
                <AddDeckWithAIForm
                    setIsAddDeckWithAIFormOpen={setIsAddDeckWithAIFormOpen}
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