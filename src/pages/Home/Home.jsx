import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Deck from "../../components/Deck/Deck";
import AddDeckForm from "../../components/AddDeckForm/AddDeckForm";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import Loading from "../../components/Loading/Loading";
import styles from "./Home.module.css";
import api from "../../constants/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { IoBook, IoTime, IoStatsChart, IoStar, IoCalendar, IoChevronBack, IoChevronForward } from "react-icons/io5";

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
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [isCreatingSubject, setIsCreatingSubject] = useState(false);
    const [isDeletingSubject, setIsDeletingSubject] = useState(false);
    const [selectingSubjectToDelete, setSelectingSubjectToDelete] = useState(false);
    const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [studyStats, setStudyStats] = useState({
        totalCards: 0,
        totalDecks: 0,
        cardsReviewed: 0,
        studyTime: 0
    });
    
    // Estado para o calendário
    const [currentDate, setCurrentDate] = useState(new Date());
    const [studySessions, setStudySessions] = useState([]);
    const navigate = useNavigate();

    // Calcular estatísticas de estudo
    useEffect(() => {
        if (decks.length > 0) {
            const totalCards = decks.reduce((total, deck) => total + (deck.cards?.length || 0), 0);
            const cardsReviewed = decks.reduce((total, deck) => {
                return total + (deck.cards?.filter(card => card.lastReview).length || 0);
            }, 0);
            
            // Simular sessões de estudo para demonstração
            const mockStudySessions = generateMockStudySessions();
            setStudySessions(mockStudySessions);
            
            setStudyStats({
                totalCards,
                totalDecks: decks.length,
                cardsReviewed,
                studyTime: Math.floor(totalCards * 2.5) // Estimativa de tempo em minutos
            });
        }
    }, [decks]);

    // Gerar sessões de estudo mockadas para demonstração
    const generateMockStudySessions = () => {
        const sessions = [];
        const today = new Date();
        
        // Sessões dos últimos 15 dias
        for (let i = 0; i < 15; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            // Aleatoriamente decidir se houve sessão neste dia
            if (Math.random() > 0.3) {
                sessions.push({
                    date: date.toISOString().split('T')[0],
                    duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutos
                    cardsStudied: Math.floor(Math.random() * 50) + 10, // 10-60 cards
                    decks: Math.floor(Math.random() * 3) + 1 // 1-4 decks
                });
            }
        }
        return sessions;
    };

    // Funções de navegação do calendário
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Gerar dias do calendário
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        const startingDayOfWeek = firstDayOfMonth.getDay();
        
        const days = [];
        
        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
                hasStudySession: false
            });
        }
        
        // Dias do mês atual
        const today = new Date().toDateString();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const hasStudySession = studySessions.some(session => session.date === dateString);
            
            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.toDateString() === today,
                hasStudySession
            });
        }
        
        // Dias do próximo mês para completar a grid
        const totalCells = 42; // 6 semanas
        const remainingDays = totalCells - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                date: new Date(year, month + 1, day),
                isCurrentMonth: false,
                hasStudySession: false
            });
        }
        
        return days;
    };

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

    // Decks para revisão (com data vencida ou próxima)
    const decksForReview = decks.filter(deck => {
        if (!deck.nextReview) return false;
        const reviewDate = new Date(deck.nextReview);
        const today = new Date();
        return reviewDate <= new Date(today.setDate(today.getDate() + 1)); // Revisões para hoje ou atrasadas
    });

    // Formatar nome do mês
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
                    <ProgressBar progress={progress} loading={loading} />

                    {loading ? (
                        <p id="loader">Carregando dados...</p>
                    ) : (
                        <>
                            {/* Dashboard Stats */}
                            <div className={styles.dashboard}>
                                <h2>Dashboard de Estudos</h2>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon}>
                                            <IoBook />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <h3>{studyStats.totalDecks}</h3>
                                            <p>Decks Criados</p>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon}>
                                            <IoStatsChart />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <h3>{studyStats.totalCards}</h3>
                                            <p>Cartões Totais</p>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon}>
                                            <IoStar />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <h3>{studyStats.cardsReviewed}</h3>
                                            <p>Cartões Revisados</p>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon}>
                                            <IoTime />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <h3>{studyStats.studyTime}</h3>
                                            <p>Minutos de Estudo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Calendário */}
                            <div className={styles.calendarSection}>
                                <div className={styles.calendarHeader}>
                                    <div className={styles.calendarTitle}>
                                        <IoCalendar className={styles.calendarIcon} />
                                        <h3>Calendário de Estudos</h3>
                                    </div>
                                    <div className={styles.calendarControls}>
                                        <button onClick={goToPreviousMonth} className={styles.calendarBtn}>
                                            <IoChevronBack />
                                        </button>
                                        <span className={styles.currentMonth}>
                                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                        </span>
                                        <button onClick={goToNextMonth} className={styles.calendarBtn}>
                                            <IoChevronForward />
                                        </button>
                                        <button onClick={goToToday} className={styles.todayBtn}>
                                            Hoje
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.calendar}>
                                    <div className={styles.calendarWeekdays}>
                                        {dayNames.map(day => (
                                            <div key={day} className={styles.weekday}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className={styles.calendarDays}>
                                        {getCalendarDays().map((day, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.calendarDay} ${
                                                    !day.isCurrentMonth ? styles.otherMonth : ''
                                                } ${day.isToday ? styles.today : ''} ${
                                                    day.hasStudySession ? styles.hasStudySession : ''
                                                }`}
                                            >
                                                <span className={styles.dayNumber}>
                                                    {day.date.getDate()}
                                                </span>
                                                {day.hasStudySession && (
                                                    <div className={styles.studyDot} title="Sessão de estudo"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.calendarLegend}>
                                    <div className={styles.legendItem}>
                                        <div className={styles.studyDot}></div>
                                        <span>Sessão de estudo</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={`${styles.calendarDay} ${styles.today}`}></div>
                                        <span>Hoje</span>
                                    </div>
                                </div>
                            </div>

                            {/* Revisões Pendentes */}
                            {decksForReview.length > 0 && (
                                <div className={styles.reviewSection}>
                                    <div className={styles.sectionHeader}>
                                        <h3>Revisões Pendentes</h3>
                                        <span className={styles.reviewCount}>
                                            {decksForReview.length} deck{decksForReview.length > 1 ? 's' : ''} para revisar
                                        </span>
                                    </div>
                                    <div className={styles.reviewDecks}>
                                        {decksForReview.slice(0, 3).map((deck) => (
                                            <div key={deck.idDeck} className={styles.reviewDeck}>
                                                <Deck
                                                    color={deck.subject.color}
                                                    subject={deck.subject.name}
                                                    title={deck.title}
                                                    cards={deck.cards.length}
                                                    nextReview={deck.nextReview}
                                                    openCard={() => navigate(`/cards/${deck.idDeck}`)}
                                                    isReview={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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

export default Home;