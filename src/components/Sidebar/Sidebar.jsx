import { Link, useLocation } from "react-router-dom";
import { MdKeyboardDoubleArrowRight, MdHome } from "react-icons/md";
import { FaUser, FaBookReader } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import styles from "./Sidebar.module.css";
import logo from "../../assets/logo.png";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();

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
                                <img
                                    src={logo}
                                    alt="FlashFy Logo"
                                    className={styles.logoImg}
                                />
                                <div className={styles.logoText}>FlashFy</div>
                            </div>
                        </>
                    )}
                </div>
                {isSidebarOpen && (
                    <div className={styles.menu}>
                        <Link
                            to="/home"
                            className={
                                location.pathname === "/home"
                                    ? styles.active
                                    : null
                            }
                        >
                            <MdHome /> Página inicial
                        </Link>
                        <Link
                            to="/aiquestions"
                            className={
                                location.pathname === "/aiquestions"
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
                        <Link to="/profile" className={location.pathname === "/profile" ? styles.active : null}>
                            <FaUser /> Ver Perfil
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
