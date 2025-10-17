import { useMemo } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import BarChart from "../../components/Charts/BarChart";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import {
FaBook,
FaLayerGroup,
FaFileAlt,
FaCalendarAlt,
FaChartBar,
} from "react-icons/fa";
import styles from "./Stats.module.css";

const Stats = ({ isSidebarOpen, setIsSidebarOpen, decks = [], subjects = [], profile = {} }) => {
// Memoize calculations to avoid re-computing on every render
const statsData = useMemo(() => {
if (!decks || decks.length === 0) {
return {
totalDecks: 0,
totalCards: 0,
averageCards: 0,
mostStudiedSubject: "N/A",
upcomingReviews: [],
decksBySubjectData: { labels: [], datasets: [] },
studyActivityData: { labels: [], datasets: [] },
};
}

    // Métricas Adicionais
    const totalDecks = decks.length;
    const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);
    const averageCards = totalDecks > 0 ? (totalCards / totalDecks).toFixed(1) : 0;

    // Desempenho por Matéria
    const decksBySubject = subjects.map(subject => ({
        name: subject.name,
        count: decks.filter(deck => deck.subject.idSubject === subject.idSubject).length,
        color: subject.color,
    }));

    const decksBySubjectData = {
        labels: decksBySubject.map(s => s.name),
        datasets: [
            {
                label: "Nº de Decks",
                data: decksBySubject.map(s => s.count),
                backgroundColor: decksBySubject.map(s => s.color),
                borderColor: subjects.map(s => s.color.replace('0.4', '1')),
                borderWidth: 1,
            },
        ],
    };

    // Calendário de Revisões
    const upcomingReviews = decks
        .filter(deck => deck.nextReview && new Date(deck.nextReview) > new Date())
        .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
        .slice(0, 5); // Pega as próximas 5 revisões

    // Gráfico de Atividade Semanal (simulado, já que não temos histórico)
    // No futuro, isso viria de um histórico de estudos real
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date().getDay();
    const weeklyLabels = [...labels.slice(today + 1), ...labels.slice(0, today + 1)];

    const studyActivityData = {
        labels: weeklyLabels,
        datasets: [
            {
                label: "Decks Estudados",
                data: [2, 3, 1, 4, 2, 5, 3], // Dados de exemplo
                backgroundColor: "rgba(1, 165, 228, 0.6)",
                borderColor: "rgba(1, 165, 228, 1)",
                borderWidth: 1,
            },
        ],
    };

    return {
        totalDecks,
        totalCards,
        averageCards,
        decksBySubjectData,
        upcomingReviews,
        studyActivityData,
    };
}, [decks, subjects, profile]);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};


return (
    <div className={styles.container}>
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className={styles.mainContainer}>
            <header className={styles.header}>
                <h1>Dashboard de Estatísticas</h1>
                <p>Acompanhe seu progresso e desempenho nos estudos.</p>
            </header>

            {/* Métricas Adicionais */}
            <section className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaLayerGroup />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total de Decks</h3>
                        <p className={styles.statValue}>{statsData.totalDecks}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaFileAlt />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total de Cards</h3>
                        <p className={styles.statValue}>{statsData.totalCards}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaChartBar />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Média de Cards/Deck</h3>
                        <p className={styles.statValue}>{statsData.averageCards}</p>
                    </div>
                </div>
            </section>

            {/* Gráficos */}
            <section className={styles.chartsGrid}>
                <div className={styles.chartContainer}>
                    <BarChart chartData={statsData.studyActivityData} />
                </div>
                <div className={styles.chartContainer}>
                    <DoughnutChart chartData={statsData.decksBySubjectData} />
                </div>
            </section>

            {/* Calendário de Revisões */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <FaCalendarAlt /> Próximas Revisões
                </h2>
                {statsData.upcomingReviews.length > 0 ? (
                    <ul className={styles.reviewList}>
                        {statsData.upcomingReviews.map(deck => (
                            <li key={deck.idDeck} className={styles.reviewItem}>
                                <div className={styles.reviewInfo}>
                                    <span className={styles.reviewDeckTitle}>{deck.title}</span>
                                    <span className={styles.reviewSubject} style={{ backgroundColor: deck.subject.color }}>
                                        {deck.subject.name}
                                    </span>
                                </div>
                                <span className={styles.reviewDate}>
                                    {formatDate(deck.nextReview)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noReviewsMessage}>Nenhuma revisão agendada para os próximos dias.</p>
                )}
            </section>
        </main>
    </div>
);

};

export default Stats;