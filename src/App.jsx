import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";
import IaQuestions from "./pages/IaQuestions/IaQuestions";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Community from "./pages/Community/Community";
import mockData from "./mockData";
import subjects from "./subjects";

const App = () => {
    const [decks, setDecks] = useState([]);
    const [progress, setProgress] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const incrementStudiedDecks = () => {
        setProgress((prev) => ({
            ...prev,
            studiedDecks: (prev.studiedDecks || 0) + 1,
        }));
    };

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

            checkAndResetStudiedDecks();
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

    const filteredDecks = decks.filter((deck) => {
        if (selectedSubjects.length === 0) return true;
        return selectedSubjects.some((subject) =>
            deck.subject?.includes(subject)
        );
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

        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);

        checkAndResetStudiedDecks();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const today = new Date().toDateString();
            if (lastStudyDate && lastStudyDate !== today) {
                checkAndResetStudiedDecks();
            }
        }, 1000 * 60 * 60);

        return () => clearInterval(interval);
    }, [lastStudyDate]);

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
                        isAuthenticated ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <Login setIsAuthenticated={setIsAuthenticated} />
                        )
                    } 
                />
                
                <Route 
                    path="/register" 
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <Register setIsAuthenticated={setIsAuthenticated} />
                        )
                    } 
                />
                
                <Route 
                    path="/home" 
                    element={
                        isAuthenticated ? (
                            <Home
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                decks={filteredDecks}
                                setDecks={setDecks}
                                progress={progress}
                                selectedSubjects={selectedSubjects}
                                setSelectedSubjects={setSelectedSubjects}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="/iaquestions" 
                    element={
                        isAuthenticated ? (
                            <IaQuestions
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="/methodology" 
                    element={
                        isAuthenticated ? (
                            <Methodology
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="/cards/:id" 
                    element={
                        isAuthenticated ? (
                            <Cards
                                decks={decks}
                                setDecks={setDecks}
                                updateDeck={updateDeck}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="/profile" 
                    element={
                        isAuthenticated ? (
                            <Profile
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                setIsAuthenticated={setIsAuthenticated}
                                decks={decks}
                                progress={progress}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="/community" 
                    element={
                        isAuthenticated ? (
                            <Community
                                isSidebarOpen={isSidebarOpen}
                                setIsSidebarOpen={setIsSidebarOpen}
                                setIsAuthenticated={setIsAuthenticated}
                                decks={decks}
                                progress={progress}
                                subjects={subjects}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                <Route 
                    path="*" 
                    element={<Navigate to="/" replace />} 
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;