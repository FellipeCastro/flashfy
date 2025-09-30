import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import AiQuestions from "./pages/AiQuestions/AiQuestions";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import api from "./constants/api.js";
import Profile from "./pages/Profile/Profile.jsx";
import Community from "./pages/Community/Community";
import MyDecks from "./pages/MyDecks/MyDecks";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (token) {
                const [decksResponse, progressResponse, subjectsResponse] =
                    await Promise.all([
                        api.get("/decks"),
                        api.get("/progress"),
                        api.get("/subjects"),
                    ]);

                setDecks(decksResponse.data);
                setProgress(progressResponse.data);
                setSubjects(subjectsResponse.data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtra os decks com base nas matérias selecionados
    const filteredDecks = decks.filter((deck) => {
        // Se não há assuntos selecionados, mostra todos os decks
        if (selectedSubjects.length === 0) return true;

        // Verifica se o deck tem pelo menos um dos assuntos selecionados
        return selectedSubjects.some((subject) =>
            deck.subject.name?.includes(subject)
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

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login loadData={loadData} loading={loading} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register loadData={loadData} loading={loading} />
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
                                progress={progress}
                                subjects={subjects}
                                selectedSubjects={selectedSubjects}
                                setSelectedSubjects={setSelectedSubjects}
                                loadData={loadData}
                                loading={loading}
                            />
                        </ProtectedRoute>
                    }
                />

               <Route
                    path="/my-decks"
                    element={
                        <ProtectedRoute>
                            <MyDecks
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                decks={decks}
                                progress={progress}
                                subjects={subjects}
                                loadData={loadData} // Adicione esta linha
                                loading={loading}   // E esta também se quiser
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/community"
                    element={
                        <ProtectedRoute>
                            <Community
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                decks={decks}
                                progress={progress}
                                subjects={subjects}
                                setDecks={setDecks}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/:id"
                    element={
                        <ProtectedRoute>
                            <Cards decks={decks} loadData={loadData} />
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;