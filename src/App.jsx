import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import mockData from "./mockData";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    
    const calculateStudiedDecks = () => {
        const today = new Date().toDateString();
        
        // Se for um novo dia, reseta o contador
        if (!lastStudyDate || lastStudyDate !== today) {
            localStorage.setItem('lastStudyDate', today);
            setLastStudyDate(today);
            return 0;
        }
        
        // Caso contrário, mantém o valor atual
        return progress.studiedDecks || 0;
    };
    
    const calculateDecksToStudy = (decks) => {
        return decks.filter((deck) => {
            if (!deck.nextReview) return false;

            try {
                const reviewDate = new Date(deck.nextReview);
                const diffTime = reviewDate - new Date();
                return diffTime < 0 || diffTime < 1000 * 60 * 60 * 24;
            } catch (e) {
                console.error("Invalid date format for deck:", deck.id, e);
                return false;
            }
        }).length;
    };

    const updateDeck = (updatedDeck) => {
        setDecks((prevDecks) => {
            const newDecks = prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            );
            // Atualiza contagem com os decks mais recentes
            setProgress((prev) => ({
                ...prev,
                decksToStudy: calculateDecksToStudy(newDecks),
            }));
            return newDecks;
        });
    };

    useEffect(() => {
        // Carrega a última data do localStorage
        const storedDate = localStorage.getItem('lastStudyDate');
        setLastStudyDate(storedDate || new Date().toDateString());
        
        // Inicializa os decks e progresso
        setDecks(mockData.decks);
        setProgress({
            ...mockData.progress,
            decksToStudy: calculateDecksToStudy(mockData.decks),
            studiedDecks: calculateStudiedDecks()
        });
    }, []);

    // Verifica periodicamente se mudou o dia
    useEffect(() => {
        const checkNewDay = () => {
            const today = new Date().toDateString();
            if (lastStudyDate && lastStudyDate !== today) {
                setLastStudyDate(today);
            }
        };
        
        const interval = setInterval(checkNewDay, 1000 * 60 * 60); // Verifica a cada hora
        return () => clearInterval(interval);
    }, [lastStudyDate]);

    // Atualiza o contador sempre que a data muda
    useEffect(() => {
        setProgress(prev => ({
            ...prev,
            studiedDecks: calculateStudiedDecks()
        }));
    }, [lastStudyDate]);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                            decks={decks}
                            setDecks={setDecks}
                            progress={progress}
                            setProgress={setProgress}
                            calculateDecksToStudy={calculateDecksToStudy}
                        />
                    }
                />
                <Route
                    path="/methodology"
                    element={
                        <Methodology
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    }
                />
                <Route
                    path="/cards/:id"
                    element={
                        <Cards
                            decks={decks}
                            setDecks={setDecks}
                            updateDeck={updateDeck}
                            progress={progress}
                            setProgress={setProgress}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;