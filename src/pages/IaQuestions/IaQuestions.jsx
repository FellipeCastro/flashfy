import Button from "../../components/Button/Button";
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
                <h1>Gere perguntas por IA</h1>
                <form method="post" className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="theme">Tema:</label>
                        <input type="text" name="theme" id="theme" placeholder="Digite o tema das questões aqui" />
                    </div>
                    <div className={styles.flexContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="difficulty">Dificuldade:</label>
                            <select name="difficulty" id="difficulty">
                                <option value="">Selecione a dificuldade das perguntas</option>
                                <option value="easy">Fácil</option>
                                <option value="medium">Médio</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="quantity">Quantidade:</label>
                            {/* <input type="number" name="quantity" id="quantity" placeholder="Escolha quantas perguntas serão geradas" /> */}
                            <select name="quantity" id="quantity">
                                <option value="">Escolha quantas perguntas serão geradas</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>
                    <Button>
                        Gerar perguntas por IA
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default IaQuestions;
