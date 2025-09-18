import { useState } from "react";
import { IoMdLink, IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddDeckForm.module.css";

const AddDeckForm = ({
    setIsAddDeckFormOpen,
    setIsAddSubjectFormOpen,
    subjects,
    createDeck,
}) => {
    const [idSubject, setIdSubject] = useState("");
    const [title, setTitle] = useState("");

    const openAddSubjectForm = () => {
        setIsAddDeckFormOpen(false);
        setIsAddSubjectFormOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        createDeck(idSubject, title);
    };

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

                <form
                    method="post"
                    autoComplete="off"
                    onSubmit={onSubmit}
                    className={styles.form}
                >
                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="subject">Matéria</label>
                            <button
                                className={styles.addSubject}
                                onClick={openAddSubjectForm}
                            >
                                Adicionar matéria
                            </button>
                        </div>
                        <select
                            name="subject"
                            id="subject"
                            onChange={(e) => setIdSubject(e.target.value)}
                            value={idSubject}
                        >
                            <option value="">Selecione uma matéria</option>
                            {subjects.map((subject) => {
                                return (
                                    <option
                                        key={subject.name}
                                        value={subject.idSubject}
                                    >
                                        {subject.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Digite o título do deck aqui"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <Button>Criar Card</Button>
                </form>
            </div>
        </>
    );
};

export default AddDeckForm;
