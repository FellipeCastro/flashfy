import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./IaQuestions.module.css";

const IaQuestions = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={styles.mainContainer}>
                <h1>Olá mundo</h1>
            </div>
        </div>
    );
};

export default IaQuestions;
