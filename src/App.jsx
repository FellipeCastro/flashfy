import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import mockData from "./mockData";
import subjects from "./subjects";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // Função para incrementar studiedDecks
    const incrementStudiedDecks = () => {
        setProgress((prev) => ({
            ...prev,
            studiedDecks: (prev.studiedDecks || 0) + 1,
        }));
    };

    // Função para verificar e resetar studiedDecks se for novo dia
    const checkAndResetStudiedDecks = () => {
        const today = new Date().toDateString();
        if (!lastStudyDate || lastStudyDate !== today) {
            localStorage.setItem("lastStudyDate", today);
            setLastStudyDate(today);
            setProgress((prev) => ({
                ...prev,
                studiedDecks: 0,
            }));
        }
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
        const today = new Date().toDateString();
        const isNewDay = !lastStudyDate || lastStudyDate !== today;

        setDecks((prevDecks) => {
            const newDecks = prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            );

            // Verifica se é novo dia e atualiza o contador
            checkAndResetStudiedDecks();

            // Incrementa o contador de decks estudados
            incrementStudiedDecks();

            setProgress((prev) => ({
                ...prev,
                decksToStudy: calculateDecksToStudy(newDecks),
            }));

            if (isNewDay) {
                setLastStudyDate(today);
                localStorage.setItem("lastStudyDate", today);
            }

            return newDecks;
        });
    };

    // Filtra a lista de Pokémon com base nos tipos selecionados e no termo de busca
    const filteredDecks = decks.filter((deck) => {
        // Se não há assuntos selecionados, mostra todos os decks
        if (selectedSubjects.length === 0) return true;

        // Verifica se o deck tem pelo menos um dos assuntos selecionados
        return selectedSubjects.some((subject) => deck.subject?.includes(subject));
    });

    useEffect(() => {
        const storedDate = localStorage.getItem("lastStudyDate");
        const initialDate = storedDate || new Date().toDateString();
        setLastStudyDate(initialDate);

        setDecks(mockData.decks);
        setProgress({
            ...mockData.progress,
            decksToStudy: calculateDecksToStudy(mockData.decks),
        });

        // Verifica ao carregar se precisa resetar por novo dia
        checkAndResetStudiedDecks();
    }, []);

    // Verifica a cada hora se mudou o dia
    useEffect(() => {
        const interval = setInterval(() => {
            const today = new Date().toDateString();
            if (lastStudyDate && lastStudyDate !== today) {
                checkAndResetStudiedDecks();
            }
        }, 1000 * 60 * 60); // Verifica a cada hora

        return () => clearInterval(interval);
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
                            decks={selectedSubjects > 0 ? filteredDecks : decks}
                            setDecks={setDecks}
                            progress={progress}
                            selectedSubjects={selectedSubjects}
                            setSelectedSubjects={setSelectedSubjects}
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
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
