import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import Loading from "../../components/Loading/Loading";
import styles from "./MyDecks.module.css";
import api from "../../constants/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const MyDecks = ({
    isSidebarOpen,
    setIsSidebarOpen,
    decks,
    progress,
    subjects,
    loadData,
    loading,
}) => {
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [isCreatingSubject, setIsCreatingSubject] = useState(false);
    const [isDeletingSubject, setIsDeletingSubject] = useState(false);
    const [selectingSubjectToDelete, setSelectingSubjectToDelete] = useState(false);
    const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const navigate = useNavigate();

    const createDeck = async (idSubject, title) => {
        try {
            setIsCreatingDeck(true);
            const response = await api.post("/decks", {
                idSubject,
                title,
            });
            if (response.data) {
                setIsAddDeckFormOpen(false);
                loadData(); // Atualiza os dados
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCreatingDeck(false);
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
                loadData(); // Atualiza os dados
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCreatingSubject(false);
        }
    };

    const deleteSubject = async (idSubject) => {
        try {
            setIsDeletingSubject(true);
            const response = await api.delete(`/subjects/${idSubject}`);
            if (response.data) {
                setDeleteSubjectModal(false);
                setSelectingSubjectToDelete(false);
                setSubjectToDelete(null);
                loadData(); // Atualiza os dados
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeletingSubject(false);
        }
    };

    const handleDeleteSubjectClick = (subject) => {
        setSubjectToDelete(subject);
        setDeleteSubjectModal(true);
    };

    const handleCancelDelete = () => {
        setDeleteSubjectModal(false);
        setSubjectToDelete(null);
        setSelectingSubjectToDelete(false);
    };

    const handleSubjectSelection = (subject) => {
        setSelectedSubjects((prevSubjects) =>
            prevSubjects.includes(subject)
                ? prevSubjects.filter((t) => t !== subject)
                : [...prevSubjects, subject]
        );
    };

    // Filtra os decks com base nas matérias selecionadas
    const filteredDecks = decks.filter((deck) => {
        if (selectedSubjects.length === 0) return true;
        return selectedSubjects.some((subject) =>
            deck.subject.name?.includes(subject)
        );
    });

    return (
        <>
            {isCreatingDeck && <Loading />}
            {isCreatingSubject && <Loading />}
            {isDeletingSubject && <Loading />}

            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    

                    {loading ? (
                        <p id="loader">Carregando dados...</p>
                    ) : (
                        <>
                            <div className={styles.columnContainer}>
                                <div className={styles.titleContainer}>
                                    <h1>Meus decks</h1>
                                    <Button
                                        onClick={() => setIsAddDeckFormOpen(true)}
                                    >
                                        + Novo deck
                                    </Button>
                                </div>
                                {selectingSubjectToDelete ? (
                                    <button
                                        className={styles.deleteSubjectBtn}
                                        onClick={() => setSelectingSubjectToDelete(false)}
                                    >
                                        Cancelar
                                    </button>
                                ) : (
                                    <button
                                        className={styles.deleteSubjectBtn}
                                        onClick={() => setSelectingSubjectToDelete(true)}
                                    >
                                        Excluir matéria
                                    </button>
                                )}
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
                                                selectingSubjectToDelete
                                                    ? handleDeleteSubjectClick(subject)
                                                    : handleSubjectSelection(subject.name)
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

                            {filteredDecks.length === 0 && (
                                <div className={styles.noDecks}>
                                    <p className={styles.msg}>
                                        {decks.length === 0 
                                            ? "Crie seus decks para começar a estudar!" 
                                            : "Nenhum deck encontrado com os filtros selecionados!"}
                                    </p>
                                </div>
                            )}

                            <ul className={styles.decksContainer}>
                                {filteredDecks
                                    .sort((a, b) => {
                                        const now = new Date();
                                        if (!a.nextReview && !b.nextReview) return 0;
                                        if (!a.nextReview) return 1;
                                        if (!b.nextReview) return -1;

                                        const aDate = new Date(a.nextReview);
                                        const bDate = new Date(b.nextReview);

                                        if (aDate < now && bDate >= now) return -1;
                                        if (bDate < now && aDate >= now) return 1;

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
                                            openCard={() => navigate(`/cards/${deck.idDeck}`)}
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

            {isAddSubjectFormOpen && (
                <AddSubjectForm
                    setIsAddDeckFormOpen={setIsAddDeckFormOpen}
                    setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                    createSubject={createSubject}
                />
            )}

            {deleteSubjectModal && subjectToDelete && (
                <ConfirmModal
                    title={"Deletar matéria"}
                    description={`Todos os decks associados a matéria "${subjectToDelete.name}" também serão excluídos.`}
                    btnText={"Confirmar"}
                    onClick={() => deleteSubject(subjectToDelete.idSubject)}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default MyDecks;