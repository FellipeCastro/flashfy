import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Profile.module.css";

const Profile = ({ isSidebarOpen, setIsSidebarOpen, setIsAuthenticated }) => {
    const [userData, setUserData] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        const userName = localStorage.getItem('userName') || 'Usuário';
        const userEmail = localStorage.getItem('userEmail') || '';
        
        setUserData({
            name: userName,
            email: userEmail
        });
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setIsAuthenticated={setIsAuthenticated}
            />

            <div className={styles.mainContainer}>
                <div className={styles.profileCard}>
                    <h1>Meu Perfil</h1>
                    
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {userData.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className={styles.details}>
                            <h2>{userData.name}</h2>
                            <p>{userData.email}</p>
                        </div>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <h3>Decks Criados</h3>
                            <span>0</span>
                        </div>
                        
                        <div className={styles.statItem}>
                            <h3>Cartões Estudados</h3>
                            <span>0</span>
                        </div>
                        
                        <div className={styles.statItem}>
                            <h3>Dias de Estudo</h3>
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;