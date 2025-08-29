import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import { IoShareOutline, IoBookOutline, IoExitOutline } from "react-icons/io5";
import styles from "./Profile.module.css";

const Profile = ({ isSidebarOpen, setIsSidebarOpen, setIsAuthenticated, decks = [] }) => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        joinDate: ""
    });

    useEffect(() => {
        const userName = localStorage.getItem('userName') || 'Usuário';
        const userEmail = localStorage.getItem('userEmail') || '';
        const joinDate = localStorage.getItem('joinDate') || new Date().toLocaleDateString('pt-BR');
        
        if (!localStorage.getItem('joinDate')) {
            localStorage.setItem('joinDate', joinDate);
        }

        setUserData({
            name: userName,
            email: userEmail,
            joinDate: joinDate
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('joinDate');
        setIsAuthenticated(false);
    };

    const safeDecks = Array.isArray(decks) ? decks : [];

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setIsAuthenticated={setIsAuthenticated}
            />

            <div className={styles.mainContainer}>
                <div className={styles.profileHeader}>
                    <h1>Meu Perfil</h1>
                    <Button onClick={handleLogout} className={styles.logoutBtn}>
                        <IoExitOutline /> Sair
                    </Button>
                </div>

                <div className={styles.profileContent}>
                    <div className={styles.userProfileCard}>
                        <div className={styles.userHeader}>
                            <div className={styles.avatar}>
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userInfo}>
                                <h2>{userData.name}</h2>
                                <p>{userData.email}</p>
                                <span className={styles.joinDate}>Membro desde {userData.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default Profile;