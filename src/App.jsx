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

    useEffect(() => {
        setDecks(mockData.decks);
        setProgress(mockData.progress);
    }, []);

    const updateDeck = (updatedDeck) => {
        setDecks((prevDecks) =>
            prevDecks.map((deck) =>
                deck.id === updatedDeck.id ? updatedDeck : deck
            )
        );
    };

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
                    element={<Cards decks={decks} setDecks={setDecks} updateDeck={updateDeck} />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
