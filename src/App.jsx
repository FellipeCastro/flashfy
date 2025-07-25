import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({
        consecutiveDays: 0,
        decksToStudy: 0,
        studiedDecks: 0,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const calculateDecksToStudy = (decks) => {
        return decks.filter((deck) => {
            if (!deck.nextReview) return false; // Decks sem data não devem ser estudados

            try {
                const reviewDate = new Date(decks.nextReview);
                const diffTime = reviewDate - new Date();
                return diffTime < 0 || diffTime < 1000 * 60 * 60 * 24; // Vencido ou vence hoje
            } catch (e) {
                console.error("Invalid date format for deck:", deck.id, e);
                return false; // Considera decks com datas inválidas para não estudo
            }
        }).length;
    };

    const updateDeck = (updatedDeck) => {
        setDecks((prevDecks) =>
            prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            )
        );
        // Atualiza contagem imediatamente
        setProgress((prev) => ({
            ...prev,
            decksToStudy: calculateDecksToStudy(
                decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
            ),
        }));
    };

    useEffect(() => {
        // Carrega os dados mockados
        setDecks(mockData.decks);
        setProgress({
            ...mockData.progress,
            decksToStudy: calculateDecksToStudy(mockData.decks),
        });
    }, []);

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
