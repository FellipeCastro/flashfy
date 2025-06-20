import { MdKeyboardDoubleArrowRight, MdHome } from "react-icons/md";
import { FaUser, FaBookReader } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <div
            className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
        >
            <div className={styles.topContainer}>
                <div className={styles.flexContainer}>
                    <button
                        className={styles.sidebarBtn}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <MdKeyboardDoubleArrowRight />
                    </button>
                    {isSidebarOpen && <div className={styles.logo}>FlashFy</div>}
                </div>
                {isSidebarOpen && (
                    <div className={styles.menu}>
                        <button className={styles.active}>
                            <MdHome /> Página inicial
                        </button>
                        <button>
                            <FaBookReader /> Nossa metodologia
                        </button>
                    </div>
                )}
            </div>

            {isSidebarOpen && (
                <div className={styles.btnsContainerColumn}>
                    {/* <Button secondary>Botão teste</Button> */}
                    <Button>
                        <FaUser /> Ver Perfil
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
