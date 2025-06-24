import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Methodology.module.css";

const Methodology = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <h1>Metodologia</h1>
                </div>
            </div>
        </>
    );
};

export default Methodology;
