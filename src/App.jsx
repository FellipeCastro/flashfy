import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import mockData from "./mockData";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const calculateDecksToStudy = (decks) => {
        return decks.filter((deck) => {
            if (!deck.nextReview || deck.nextReview === "") return false;
            const reviewDate = new Date(deck.nextReview);
            const diffTime = reviewDate - new Date();
            return diffTime < 0 || diffTime < 1000 * 60 * 60 * 24;
        }).length;
    };

    const updateDeck = (updatedDeck) => {
        setDecks((prevDecks) =>
            prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            )
        );
    };

    useEffect(() => {
        setDecks(mockData.decks);
        setProgress({
            ...mockData.progress,
            decksToStudy: calculateDecksToStudy(mockData.decks),
        });
    }, []);

    useEffect(() => {
        console.log(progress.decksToStudy);
        
    })

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
