import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import AiQuestions from "./pages/AiQuestions/AiQuestions";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import api from "./constants/api.js";
import Profile from "./pages/Profile/Profile.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [profile, setProfile] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (token) {
                const [
                    decksResponse,
                    progressResponse,
                    subjectsResponse,
                    profileResponse,
                ] = await Promise.all([
                    api.get("/decks"),
                    api.get("/progress"),
                    api.get("/subjects"),
                    api.get("/users/profile"),
                ]);

                setDecks(decksResponse.data);
                setProgress(progressResponse.data);
                setSubjects(subjectsResponse.data);
                setProfile(profileResponse.data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                const response = await api.get("/users/profile");
                setProfile(response.data);
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error.message);
        }
    };

    const refreshSubjects = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                const response = await api.get("/subjects");
                setSubjects(response.data);
            }
        } catch (error) {
            console.error("Erro ao atualizar matérias:", error.message);
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
                    exact path="/"
                    element={
                        localStorage.getItem("authToken") ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <LandingPage />
                        )
                    }
                />

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login loadData={loadData} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register loadData={loadData} />
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
                                profile={profile}
                                subjects={subjects}
                                refreshProfile={refreshProfile}
                                refreshSubjects={refreshSubjects}
                                loading={loading}
                                progress={progress}
                            />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
