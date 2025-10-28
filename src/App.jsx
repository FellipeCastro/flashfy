import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"; // useNavigate importado
// Correção: Adicionar .jsx às importações de componentes React
import Home from "./pages/Home/Home.jsx";
import Methodology from "./pages/Methodology/Methodology.jsx";
import Cards from "./pages/Cards/Cards.jsx";
import AiQuestions from "./pages/AiQuestions/AiQuestions.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import api from "./constants/api.js"; // .js está correto aqui
import Profile from "./pages/Profile/Profile.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

const App = () => {
    // --- Theme State ---
    const [theme, setTheme] = useState(() => {
        // Tenta ler o tema do localStorage ou define 'light' como padrão
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme : "light";
    });

    // --- Apply Theme and Save to localStorage ---
    useEffect(() => {
        // Aplica o atributo data-theme ao elemento <html>
        document.documentElement.setAttribute("data-theme", theme);
        // Salva a preferência de tema no localStorage
        localStorage.setItem("theme", theme);
    }, [theme]); // Roda este efeito sempre que o estado 'theme' mudar

    // --- Toggle Theme Function ---
    const toggleTheme = () => {
        // Alterna o tema entre 'light' e 'dark'
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    // --- End Theme State ---

    // --- Application Data State ---
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [profile, setProfile] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false); // Loading geral para dados iniciais

    // --- Data Fetching Logic ---
    const loadData = async (navigateInstance) => { // Aceita navigate como argumento
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (token) {
                // Configura o interceptor para lidar com 401 (Unauthorized)
                const interceptorId = api.interceptors.response.use(
                    response => response,
                    error => {
                        if (error.response && error.response.status === 401) {
                            console.error("Token inválido ou expirado. Deslogando...");
                            localStorage.removeItem("authToken");
                            localStorage.removeItem("idUser");
                            // Usa a instância do navigate passada para redirecionar
                            if (navigateInstance) {
                                navigateInstance("/login");
                            } else {
                                // Fallback se navigateInstance não for passado (menos ideal)
                                window.location.href = '/login';
                            }
                        }
                        return Promise.reject(error);
                    }
                );


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

                // Ejeta o interceptor após as chamadas bem-sucedidas
                api.interceptors.response.eject(interceptorId);

                setDecks(decksResponse.data);
                setProgress(progressResponse.data);
                setSubjects(subjectsResponse.data);
                setProfile(profileResponse.data);
            } else {
                 setLoading(false); // Garante que loading seja false se não houver token
            }
        } catch (error) {
            // O interceptor já deve ter lidado com 401
            if (error.response?.status !== 401) {
                console.error("Erro ao carregar dados:", error.message);
            }
        } finally {
             // Garante que loading seja desativado mesmo se não houver token
             // ou se um erro diferente de 401 ocorrer (embora o interceptor trate 401)
             if (localStorage.getItem("authToken")) {
                 setLoading(false);
             } else {
                 // Certifique-se de que o loading seja falso se não houver token
                 setLoading(false);
             }
        }
    };

    // --- Refresh Profile Data ---
    const refreshProfile = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                const response = await api.get("/users/profile");
                setProfile(response.data);
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error.message);
             // Adicionar tratamento de erro 401 aqui também se necessário
             if (error.response && error.response.status === 401) {
                 localStorage.removeItem("authToken");
                 localStorage.removeItem("idUser");
                 // Idealmente, usar useNavigate aqui também
                 window.location.href = '/login';
             }
        }
    };

    // --- Refresh Subjects Data ---
    const refreshSubjects = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                const response = await api.get("/subjects");
                setSubjects(response.data);
            }
        } catch (error) {
            console.error("Erro ao atualizar matérias:", error.message);
             // Adicionar tratamento de erro 401
            if (error.response && error.response.status === 401) {
                 localStorage.removeItem("authToken");
                 localStorage.removeItem("idUser");
                 window.location.href = '/login';
             }
        }
    };

    // Hook Wrapper para usar useNavigate dentro de loadData
    const DataLoader = () => {
        const navigate = useNavigate();
        useEffect(() => {
            // Carrega os dados apenas se um token existir
            if (localStorage.getItem("authToken")) {
                loadData(navigate); // Passa a instância do navigate
            }
        }, [navigate]); // Dependência do navigate
        return null; // Este componente não renderiza nada
    };


    // Filtra os decks com base nas matérias selecionados
    const filteredDecks = decks.filter((deck) => {
        if (selectedSubjects.length === 0) return true;
        // Garante que deck.subject e deck.subject.name existam antes de acessar includes
        return deck.subject && deck.subject.name && selectedSubjects.some((subject) =>
            deck.subject.name.includes(subject)
        );
    });

    // --- Protected Route Component ---
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        // Se não houver token, redireciona para login
        return token ? children : <Navigate to="/login" replace />;
    };

    // --- Guest Route Component ---
    const GuestRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        // Se houver token, redireciona para home
        return token ? <Navigate to="/home" replace /> : children;
    };

    // --- Render ---
    return (
        <BrowserRouter>
             <DataLoader /> {/* Coloca o DataLoader dentro do BrowserRouter */}
            <Routes>
                {/* Landing Page (Apenas para visitantes) */}
                <Route
                    exact path="/"
                    element={
                        localStorage.getItem("authToken") ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <LandingPage theme={theme} toggleTheme={toggleTheme} />
                        )
                    }
                />

                {/* Login Page (Apenas para visitantes) */}
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            {/* Passa loadData para ser chamado após login bem-sucedido */}
                            {/* É preciso envolver useNavigate() numa função para chamá-lo condicionalmente */}
                            <Login loadData={() => { const navigate = useNavigate(); loadData(navigate); }} />
                        </GuestRoute>
                    }
                />

                {/* Register Page (Apenas para visitantes) */}
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                             {/* Passa loadData para ser chamado após registro bem-sucedido */}
                            <Register loadData={() => { const navigate = useNavigate(); loadData(navigate); }} />
                        </GuestRoute>
                    }
                />

                {/* Protected Routes (Apenas para usuários logados) */}
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
                                loadData={() => { const navigate = useNavigate(); loadData(navigate); }} // Passa loadData com navigate
                                loading={loading}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/:id"
                    element={
                        <ProtectedRoute>
                            <Cards decks={decks} loadData={() => { const navigate = useNavigate(); loadData(navigate); }} />
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
                                loading={loading} // Passa o loading geral
                                progress={progress}
                                theme={theme} // Passa o tema atual
                                toggleTheme={toggleTheme} // Passa a função de toggle
                            />
                        </ProtectedRoute>
                    }
                />

                 {/* Rota Catch-all (opcional, para páginas não encontradas) */}
                 <Route path="*" element={<Navigate to={localStorage.getItem("authToken") ? "/home" : "/"} replace />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;

