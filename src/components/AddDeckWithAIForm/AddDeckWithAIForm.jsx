// src/components/AddDeckWithAIForm/AddDeckWithAIForm.jsx

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import Loading from "../Loading/Loading"; // Vamos precisar do Loading
import styles from "./AddDeckWithAIForm.module.css"; // Use o seu CSS novo/copiado

// MUDANÇA: Renomeie o componente e ajuste as props que ele recebe
const AddDeckWithAIForm = ({
    setIsAddDeckWithAIFormOpen,
    subjects,
    generateDeckWithAI, // Recebe a nova função da Home
    loadData,
}) => {
    const [idSubject, setIdSubject] = useState("");
    const [theme, setTheme] = useState("");
    const [quantity, setQuantity] = useState(5); // Valor inicial padrão
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        idSubject: "",
        theme: "",
        main: "",
    });

    // MUDANÇA: Validar 'theme' em vez de 'title'
    const validateForm = () => {
        const newErrors = {
            idSubject: "",
            theme: "",
            main: "",
        };

        let isValid = true;

        if (!idSubject.trim()) {
            newErrors.idSubject = "Matéria é obrigatória";
            isValid = false;
        }

        if (!theme.trim()) {
            newErrors.theme = "O tema é obrigatório";
            isValid = false;
        } else if (theme.trim().length < 3) {
            newErrors.theme = "O tema deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    // MUDANÇA: Lidar com os novos inputs 'theme' e 'quantity'
    const handleInputChange = (field, value) => {
        if (field === "idSubject") {
            setIdSubject(value);
        } else if (field === "theme") {
            setTheme(value);
        } else if (field === "quantity") {
            setQuantity(value);
        }

        if (errorMessage[field]) {
            setErrorMessage((prev) => ({
                ...prev,
                [field]: "",
                main: "",
            }));
        }
    };

    // MUDANÇA: A lógica de submissão agora chama a IA
    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true); // Ativa o loading
        try {
            // Chama a função que veio da Home para se comunicar com a API
            await generateDeckWithAI(idSubject, theme, quantity);
            
            loadData(); // Atualiza os decks na página principal
            setIsAddDeckWithAIFormOpen(false); // Fecha o modal com sucesso
        } catch (error) {
            console.error("Erro ao gerar deck com IA:", error);
            setErrorMessage({ main: "Ocorreu um erro ao gerar o deck. Tente novamente." });
        } finally {
            setIsLoading(false); // Desativa o loading
        }
    };

    const closeModal = () => {
        setIsAddDeckWithAIFormOpen(false);
    };

    return (
        <>
            {/* Se estiver carregando, mostra o spinner */}
            {isLoading && <Loading />} 
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainer}>
                    <h2>Gerar Deck com IA</h2>
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
                    {/* CAMPO DE TEMA */}
                    <div className={styles.inputContainer}>
                        <label htmlFor="theme">Qual é o tema para a IA?</label>
                        <input
                            type="text"
                            name="theme"
                            id="theme"
                            placeholder="Ex: Revolução Francesa, Fotossíntese..."
                            onChange={(e) =>
                                handleInputChange("theme", e.target.value)
                            }
                            value={theme}
                            className={errorMessage.theme ? styles.inputError : ""}
                        />
                        {errorMessage.theme && (
                            <span className={styles.fieldError}>
                                {errorMessage.theme}
                            </span>
                        )}
                    </div>

                    {/* CAMPO DE MATÉRIA */}
                    <div className={styles.inputContainer}>
                        <label htmlFor="subject">Associar à matéria</label>
                        <select
                            name="subject"
                            id="subject"
                            onChange={(e) =>
                                handleInputChange("idSubject", e.target.value)
                            }
                            value={idSubject}
                            className={errorMessage.idSubject ? styles.inputError : ""}
                        >
                            <option value="">Selecione uma matéria</option>
                            {subjects.map((subject) => (
                                <option key={subject.idSubject} value={subject.idSubject}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                        {errorMessage.idSubject && (
                            <span className={styles.fieldError}>
                                {errorMessage.idSubject}
                            </span>
                        )}
                    </div>

                    {/* CAMPO DE QUANTIDADE */}
                    <div className={styles.inputContainer}>
                        <label htmlFor="quantity">Quantidade de Cards</label>
                        <select
                            name="quantity"
                            id="quantity"
                            onChange={(e) =>
                                handleInputChange("quantity", e.target.value)
                            }
                            value={quantity}
                        >
                            <option value={5}>5 Cards</option>
                            <option value={10}>10 Cards</option>
                            <option value={15}>15 Cards</option>
                        </select>
                    </div>

                    {errorMessage.main && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorText}>
                                <p>{errorMessage.main}</p>
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Gerando...' : 'Gerar Deck'}
                    </Button>
                </form>
            </div>
        </>
    );
};

export default AddDeckWithAIForm;