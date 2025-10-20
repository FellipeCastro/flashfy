import { useState } from "react";
import { IoMdClose } from "react-icons/io";
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
    const [errorMessage, setErrorMessage] = useState({
        idSubject: "",
        title: "",
        main: "",
    });

    // Função para validar o formulário
    const validateForm = () => {
        const newErrors = {
            idSubject: "",
            title: "",
            main: "",
        };

        let isValid = true;

        // Validação da matéria
        if (!idSubject.trim()) {
            newErrors.idSubject = "Matéria é obrigatória";
            isValid = false;
        }

        // Validação do título
        if (!title.trim()) {
            newErrors.title = "Título é obrigatório";
            isValid = false;
        } else if (title.trim().length < 3) {
            newErrors.title = "Título deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    // Manipulador de mudança nos inputs - limpa o erro do campo quando o usuário digita
    const handleInputChange = (field, value) => {
        if (field === "idSubject") {
            setIdSubject(value);
        } else if (field === "title") {
            setTitle(value);
        }

        // Limpa o erro específico do campo quando o usuário começa a digitar
        if (errorMessage[field]) {
            setErrorMessage((prev) => ({
                ...prev,
                [field]: "",
                main: "",
            }));
        }
    };

    const openAddSubjectForm = () => {
        setIsAddDeckFormOpen(false);
        setIsAddSubjectFormOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // Limpa mensagens de erro anteriores
        setErrorMessage({
            idSubject: "",
            title: "",
            main: "",
        });

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

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
                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Digite o título do deck aqui"
                            onChange={(e) =>
                                handleInputChange("title", e.target.value)
                            }
                            value={title}
                            className={
                                errorMessage.title ? styles.inputError : ""
                            }
                        />
                        {errorMessage.title && (
                            <span className={styles.fieldError}>
                                {errorMessage.title}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.addSubjectContainer}>
                            <label htmlFor="subject">Matéria</label>
                            <button
                                type="button"
                                className={styles.addSubject}
                                onClick={openAddSubjectForm}
                            >
                                Adicionar matéria
                            </button>
                        </div>
                        <select
                            name="subject"
                            id="subject"
                            onChange={(e) =>
                                handleInputChange("idSubject", e.target.value)
                            }
                            value={idSubject}
                            className={
                                errorMessage.idSubject ? styles.inputError : ""
                            }
                        >
                            <option value="">Selecione uma matéria</option>
                            {subjects.map((subject) => {
                                return (
                                    <option
                                        key={subject.idSubject}
                                        value={subject.idSubject}
                                    >
                                        {subject.name}
                                    </option>
                                );
                            })}
                        </select>
                        {errorMessage.idSubject && (
                            <span className={styles.fieldError}>
                                {errorMessage.idSubject}
                            </span>
                        )}
                    </div>

                    {errorMessage.main && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorText}>
                                <p>{errorMessage.main}</p>
                            </div>
                        </div>
                    )}

                    <Button type="submit">+ Criar Deck</Button>
                </form>
            </div>
        </>
    );
};

export default AddDeckForm;
