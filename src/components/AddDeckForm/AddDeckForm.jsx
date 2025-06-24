import { IoMdLink, IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddDeckForm.module.css";

const AddDeckForm = ({ setIsAddDeckFormOpen }) => {
    const closeModal = () => {
        setIsAddDeckFormOpen(false);
    };

    return (
        <>
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainer}>
                    <h2>Criar novo Deck</h2>

                    <button className={styles.closeBtn} onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </div>

                <form method="post" autoComplete="off" className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="subject">Matéria</label>
                        <select name="subject" id="subject">
                            <option value="">Selecione uma matéria</option>
                            <option value="math">Matemática</option>
                            <option value="port">Português</option>
                            <option value="hist">História</option>
                            <option value="geo">Geografia</option>
                            <option value="bio">Biologia</option>
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="title">Título</label>
                        <input type="text" name="title" id="title" placeholder="Digite o título do deck aqui" />
                    </div>

                    <Button>Criar Card</Button>
                </form>
            </div>
        </>
    );
};

export default AddDeckForm;
