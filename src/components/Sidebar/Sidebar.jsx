import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardDoubleArrowRight, MdHome, MdLogout } from "react-icons/md";
import { FaUser, FaBookReader } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import styles from "./Sidebar.module.css";
import { FaUsers } from "react-icons/fa";
import logo from "../../assets/logo/logo4.png";
import { useState } from "react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeAnimation, setActiveAnimation] = useState("");

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const handleLinkClick = (path) => {
        // Se já estamos na página, não faz nada
        if (location.pathname === path) return;
        
        // Ativa a animação
        setActiveAnimation(path);
        
        // Remove a animação após 500ms
        setTimeout(() => {
            setActiveAnimation("");
        }, 500);
    };

    return (
        <div
            className={`${styles.sidebar} ${
                isSidebarOpen ? styles.open : null
            }`}
        >
            <div className={styles.topContainer}>
                <div className={styles.flexContainer}>
                    <button
                        className={styles.sidebarBtn}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <MdKeyboardDoubleArrowRight />
                    </button>
                    {isSidebarOpen && (
                        <>
                            <div className={styles.logoContainer}>
                                <img src={logo} alt="FlashFy Logo" className={styles.logoImg} />
                                <div className={styles.logoText}>FlashFy</div>
                            </div>
                        </>
                    )}
                </div>
                {isSidebarOpen && (
                    <div className={styles.menu}>
                        <Link
                            to="/home"
                            className={`${location.pathname === "/home" ? styles.active : ""} ${
                                activeAnimation === "/home" ? styles.clickAnimation : ""
                            }`}
                            onClick={() => handleLinkClick("/home")}
                        >
                            <MdHome /> Página inicial
                        </Link>
                        <Link
                            to="/iaquestions"
                            className={`${location.pathname === "/iaquestions" ? styles.active : ""} ${
                                activeAnimation === "/iaquestions" ? styles.clickAnimation : ""
                            }`}
                            onClick={() => handleLinkClick("/iaquestions")}
                        >
                            <RiRobot2Fill /> Perguntas geradas por IA
                        </Link>
                        <Link
                            to="/methodology"
                            className={`${location.pathname === "/methodology" ? styles.active : ""} ${
                                activeAnimation === "/methodology" ? styles.clickAnimation : ""
                            }`}
                            onClick={() => handleLinkClick("/methodology")}
                        >
                            <FaBookReader /> Nossa metodologia
                        </Link>
                        <Link
                            to="/community"
                            className={`${location.pathname === "/community" ? styles.active : ""} ${
                                activeAnimation === "/community" ? styles.clickAnimation : ""
                            }`}
                            onClick={() => handleLinkClick("/community")}
                        >
                            <FaUsers /> Comunidade
                        </Link>

                        <Link 
                            to="/profile" 
                            className={`${location.pathname === "/profile" ? styles.active : ""} ${
                                activeAnimation === "/profile" ? styles.clickAnimation : ""
                            }`}
                            onClick={() => handleLinkClick("/profile")}
                        >
                            <FaUser /> Meu Perfil
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;