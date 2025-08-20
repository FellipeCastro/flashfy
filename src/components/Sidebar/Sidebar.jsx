import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardDoubleArrowRight, MdHome, MdLogout } from "react-icons/md";
import { FaUser, FaBookReader } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";
import { MdCalendarToday } from "react-icons/md";


const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove os itens de autenticação do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        
        // Atualiza o estado de autenticação
        setIsAuthenticated(false);
        
        // Redireciona para a página de login
        navigate('/login');
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
                            <div className={styles.logo}>FlashFy</div>
                        </>
                    )}
                </div>
                {isSidebarOpen && (
                    <div className={styles.menu}>
                        <Link
                            to="/"
                            className={
                                location.pathname === "/" ? styles.active : null
                            }
                        >
                            <MdHome /> Página inicial
                        </Link>
                        {/* <Link
                            to="/calendar"
                            className={
                                location.pathname === "/calendar"
                                    ? styles.active
                                    : null
                            }
                        >
                            <MdCalendarToday /> Calendário de Estudos
                        </Link> */}
                        <Link
                            to="/iaquestions"
                            className={
                                location.pathname === "/iaquestions"
                                    ? styles.active
                                    : null
                            }
                        >
                            <RiRobot2Fill /> Perguntas geradas por IA
                        </Link>
                        <Link
                            to="/methodology"
                            className={
                                location.pathname === "/methodology"
                                    ? styles.active
                                    : null
                            }
                        >
                            <FaBookReader /> Nossa metodologia
                        </Link>
                        <Link 
                            to="/profile" 
                            className={location.pathname === "/profile" ? styles.active : null}
                        >
                            <FaUser /> Meu Perfil
                        </Link>
                        
                        {/* Botão de Logout */}
                        <button 
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                        >
                            <MdLogout /> Sair
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;