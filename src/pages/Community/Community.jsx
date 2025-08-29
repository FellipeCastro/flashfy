import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import { IoSearch, IoDownloadOutline, IoShareOutline, IoStar, IoTimeOutline } from "react-icons/io5";
import styles from "./Community.module.css";

const Community = ({ isSidebarOpen, setIsSidebarOpen, setIsAuthenticated, decks, progress, subjects }) => {
    const [activeTab, setActiveTab] = useState('community');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [sortBy, setSortBy] = useState('popularity');

    // Decks da comunidade (exemplos)
    const [communityDecks] = useState([
        { 
            id: 1, 
            name: "Funções Quadráticas", 
            author: "Maria Silva", 
            downloads: 142, 
            rating: 4.8, 
            subject: "Matemática",
            cards: 15,
            createdAt: "2024-11-15",
            tags: ["matemática", "álgebra"],
            description: "Deck completo sobre funções quadráticas com exemplos práticos."
        },
        { 
            id: 2, 
            name: "Revolução Industrial", 
            author: "João Santos", 
            downloads: 89, 
            rating: 4.5, 
            subject: "História",
            cards: 12,
            createdAt: "2024-11-10",
            tags: ["história", "revolução industrial"],
            description: "Análise completa da Revolução Industrial e seus impactos sociais."
        },
        { 
            id: 3, 
            name: "Tabela Periódica", 
            author: "Ana Costa", 
            downloads: 203, 
            rating: 4.9, 
            subject: "Química",
            cards: 18,
            createdAt: "2024-11-08",
            tags: ["química", "tabela periódica"],
            description: "Deck interativo para memorização da tabela periódica."
        },
        { 
            id: 4, 
            name: "Fotossíntese", 
            author: "Pedro Alves", 
            downloads: 76, 
            rating: 4.3, 
            subject: "Biologia",
            cards: 10,
            createdAt: "2024-11-05",
            tags: ["biologia", "fotossíntese"],
            description: "Processo de fotossíntese explicado de forma simples e completa."
        },
        { 
            id: 5, 
            name: "Literatura Brasileira", 
            author: "Carla Mendes", 
            downloads: 156, 
            rating: 4.7, 
            subject: "Literatura",
            cards: 20,
            createdAt: "2024-11-12",
            tags: ["literatura", "brasil"],
            description: "Principais autores e obras da literatura brasileira."
        }
    ]);

    const getSubjectColor = (subjectName) => {
        const subject = subjects.find(s => s.name === subjectName);
        return subject ? subject.color : 'var(--border-color)';
    };

    const filteredCommunityDecks = communityDecks.filter(deck => {
        const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deck.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || deck.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    const sortedCommunityDecks = [...filteredCommunityDecks].sort((a, b) => {
        switch(sortBy) {
            case 'popularity': return b.downloads - a.downloads;
            case 'rating': return b.rating - a.rating;
            case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
            default: return 0;
        }
    });

    const handleDownloadDeck = (deckId) => {
        alert(`Deck ${deckId} baixado com sucesso!`);
    };

    const handleShareDeck = (deckId) => {
        alert(`Deck ${deckId} compartilhado com sucesso!`);
    };

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setIsAuthenticated={setIsAuthenticated}
            />

            <div className={styles.mainContainer}>
                <ProgressBar progress={progress} />
                
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1>Comunidade FlashFy</h1>
                        <p>Compartilhe conhecimento e acelere seus estudos</p>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'community' ? styles.active : ''}`}
                        onClick={() => setActiveTab('community')}
                    >
                        Decks da Comunidade
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'myDecks' ? styles.active : ''}`}
                        onClick={() => setActiveTab('myDecks')}
                    >
                        Meus Decks
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Seção de Decks da Comunidade */}
                    {activeTab === 'community' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Decks Compartilhados</h2>
                                <div className={styles.controls}>
                                    <div className={styles.searchBox}>
                                        <IoSearch className={styles.searchIcon} />
                                        <input
                                            type="text"
                                            placeholder="Buscar decks..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                    </div>
                                    <div className={styles.filters}>
                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="all">Todas as matérias</option>
                                            {subjects.map(subject => (
                                                <option key={subject.name} value={subject.name}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="popularity">Mais populares</option>
                                            <option value="rating">Melhor avaliados</option>
                                            <option value="newest">Mais recentes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.decksGrid}>
                                {sortedCommunityDecks.map(deck => {
                                    const subjectColor = getSubjectColor(deck.subject);
                                    return (
                                        <div key={deck.id} className={styles.deckCard}>
                                            <div className={styles.deckHeader}>
                                                <h3>{deck.name}</h3>
                                                <span className={styles.rating}>
                                                    <IoStar /> {deck.rating}
                                                </span>
                                            </div>
                                            
                                            <div className={styles.deckMeta}>
                                                <span className={styles.author}>por {deck.author}</span>
                                                <span className={styles.subject} style={{backgroundColor: subjectColor}}>
                                                    {deck.subject}
                                                </span>
                                            </div>

                                            <p className={styles.description}>{deck.description}</p>

                                            <div className={styles.deckStats}>
                                                <span className={styles.stat}>
                                                    <IoDownloadOutline /> {deck.downloads}
                                                </span>
                                                <span className={styles.stat}>
                                                    {deck.cards} cards
                                                </span>
                                                <span className={styles.stat}>
                                                    <IoTimeOutline /> {new Date(deck.createdAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>

                                            <div className={styles.deckActions}>
                                                <Button 
                                                    onClick={() => handleDownloadDeck(deck.id)}
                                                    className={styles.downloadBtn}
                                                >
                                                    <IoDownloadOutline /> Baixar
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {sortedCommunityDecks.length === 0 && (
                                <div className={styles.emptyState}>
                                    <p>Nenhum deck encontrado. Tente ajustar os filtros.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Seção de Meus Decks */}
                    {activeTab === 'myDecks' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Meus Decks</h2>
                                <span className={styles.decksCount}>{decks.length} decks</span>
                            </div>

                            <div className={styles.decksGrid}>
                                {decks.map(deck => {
                                    const subjectColor = getSubjectColor(deck.subject);
                                    return (
                                        <div key={deck.id} className={styles.deckCard}>
                                            <div className={styles.deckHeader}>
                                                <h3>{deck.title}</h3>
                                                <button 
                                                    className={styles.shareButton}
                                                    onClick={() => handleShareDeck(deck.id)}
                                                >
                                                    <IoShareOutline />
                                                </button>
                                            </div>
                                            
                                            <div className={styles.deckMeta}>
                                                <span className={styles.cardsCount}>
                                                    {deck.cards?.length || 0} cards
                                                </span>
                                                <span className={styles.subject} style={{backgroundColor: subjectColor}}>
                                                    {deck.subject}
                                                </span>
                                            </div>

                                            {deck.nextReview && (
                                                <div className={styles.reviewInfo}>
                                                    <IoTimeOutline />
                                                    Próxima revisão: {new Date(deck.nextReview).toLocaleDateString('pt-BR')}
                                                </div>
                                            )}

                                            <div className={styles.deckActions}>
                                                <Button className={styles.studyBtn}>
                                                    Estudar
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {decks.length === 0 && (
                                <div className={styles.emptyState}>
                                    <p>Você ainda não criou nenhum deck.</p>
                                    <Button>Criar Primeiro Deck</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;