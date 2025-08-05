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
        if (!lastStudyDate || lastStudyDate !== today) {
            localStorage.setItem("lastStudyDate", today);
            setLastStudyDate(today);
            return 0;
        }
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
        const today = new Date().toDateString();
        const isNewDay = !lastStudyDate || lastStudyDate !== today;

        setDecks((prevDecks) => {
            const isFirstDeckOfDay = progress.studiedDecks === 0;

            const newDecks = prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            );

            setProgress((prev) => ({
                ...prev,
                consecutiveDays: isFirstDeckOfDay
                    ? (prev.consecutiveDays || 0) + 1
                    : prev.consecutiveDays,
                decksToStudy: calculateDecksToStudy(newDecks),
                studiedDecks: (prev.studiedDecks || 0) + 1,
            }));

            if (isNewDay) {
                setLastStudyDate(today);
                localStorage.setItem("lastStudyDate", today);
            }

            return newDecks;
        });
    };

    useEffect(() => {
        const storedDate = localStorage.getItem("lastStudyDate");
        const initialDate = storedDate || new Date().toDateString();
        setLastStudyDate(initialDate);

        setDecks(mockData.decks);
        setProgress({
            ...mockData.progress,
            consecutiveDays: storedDate
                ? mockData.progress.consecutiveDays || 0
                : 0,
            decksToStudy: calculateDecksToStudy(mockData.decks),
            studiedDecks: calculateStudiedDecks(),
        });
    }, []);

    useEffect(() => {
        const checkNewDay = () => {
            const today = new Date().toDateString();
            if (lastStudyDate && lastStudyDate !== today) {
                setLastStudyDate(today);
                setProgress((prev) => ({
                    ...prev,
                    studiedDecks: 0,
                }));
            }
        };

        const interval = setInterval(checkNewDay, 1000 * 60 * 60); // Verifica a cada hora
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
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
