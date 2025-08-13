import { Link, useLocation } from "react-router-dom";
import { MdKeyboardDoubleArrowRight, MdHome } from "react-icons/md";
import { FaUser, FaBookReader } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();

    return (
        <div
            className={`${styles.sidebar} ${isSidebarOpen ? styles.open : null}`}
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
                        <div className={styles.logo}>FlashFy</div>
                    )}
                </div>
                {isSidebarOpen && (
                    <div className={styles.menu}>
                        <Link to="/" className={location.pathname === "/" ? styles.active : null}>
                            <MdHome /> Página inicial
                        </Link>
                        <Link to="/methodology" className={location.pathname === "/methodology" ? styles.active : null}>
                            <FaBookReader /> Nossa metodologia
                        </Link>
                        {/* <Link to="/user" className={location.pathname === "/user" ? styles.active : null}>
                            <FaUser /> Ver Perfil
                        </Link> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
