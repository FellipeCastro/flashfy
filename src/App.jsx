import { useEffect, useState } from "react";
import mockDecks from "./mockDecks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setDecks(mockDecks);
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
