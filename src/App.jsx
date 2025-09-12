import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import AiQuestions from "./pages/AiQuestions/AiQuestions";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import api from "./constants/api.js";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const loadData = async () => {
        try {
            const decksResponse = await api.get("/decks");
            const progressResponse = await api.get("/progress");
            setDecks(decksResponse.data);
            setProgress(progressResponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadData()
    });

    // Filtra os decks com base nas matérias selecionados
    const filteredDecks = decks.filter((deck) => {
        // Se não há assuntos selecionados, mostra todos os decks
        if (selectedSubjects.length === 0) return true;

        // Verifica se o deck tem pelo menos um dos assuntos selecionados
        return selectedSubjects.some((subject) =>
            deck.subject?.includes(subject)
        );
    });

    // Componente de rota protegida
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? children : <Navigate to="/login" replace />;
    };

    // Componente de rota para visitantes
    const GuestRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? <Navigate to="/home" replace /> : children;
    };

    const updateDeck = () => {
        console.log("OK");   
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                localStorage.getItem("authToken")
                                    ? "/home"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                decks={filteredDecks}
                                setDecks={setDecks}
                                progress={progress}
                                selectedSubjects={selectedSubjects}
                                setSelectedSubjects={setSelectedSubjects}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/aiquestions"
                    element={
                        <ProtectedRoute>
                            <AiQuestions
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/methodology"
                    element={
                        <ProtectedRoute>
                            <Methodology
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/:id"
                    element={
                        <ProtectedRoute>
                            <Cards
                                decks={decks}
                                setDecks={setDecks}
                                updateDeck={updateDeck}
                            />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
