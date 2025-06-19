import { IoMdLink, IoMdClose  } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddCardModal.module.css";

const AddCardModal = () => {
    return (
        <>
            <div className={styles.fade}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainer}>
                    <h2>Criar novo flashcard</h2>

                    <button className={styles.closeBtn}>
                        <IoMdClose />
                    </button>
                </div>

                <form method="post" autoComplete="off" className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="deck">Deck</label>
                        <select name="deck" id="deck">
                            <option value="">Selecione um deck</option>
                            <option value="math">Matemática</option>
                            <option value="port">Português</option>
                            <option value="hist">História</option>
                            <option value="geo">Geografia</option>
                            <option value="bio">Biologia</option>
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="title">Titulo</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Ex. Funções quadráticas"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="question">Pergunta</label>
                            
                            <label htmlFor="fileQuestion" className={styles.file}>
                                <IoMdLink />
                                <input type="file" name="fileQuestion" id="fileQuestion" />
                            </label>
                        </div>
                        <textarea
                            name="question"
                            id="question"
                            placeholder="Digite a pergunta aqui"
                        ></textarea>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="answer">Resposta</label>
                            <label htmlFor="fileAnswer" className={styles.file}>
                                <IoMdLink />
                                <input type="file" name="fileAnswer" id="fileAnswer" />
                            </label>
                        </div>
                        <textarea
                            name="answer"
                            id="answer"
                            placeholder="Digite a resposta aqui"
                        ></textarea>
                    </div>

                    <Button>Criar flashcard</Button>
                </form>
            </div>
        </>
    );
};

export default AddCardModal;
