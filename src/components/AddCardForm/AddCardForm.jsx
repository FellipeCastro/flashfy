import { useState } from "react";
import { IoMdLink, IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddCardForm.module.css";

const AddCardForm = ({ setIsAddCardFormOpen, createCard }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState({
        question: "",
        answer: "",
        main: "",
    });

    // Função para validar o formulário
    const validateForm = () => {
        const newErrors = {
            question: "",
            answer: "",
            main: "",
        };

        let isValid = true;

        // Validação da pergunta
        if (!question.trim()) {
            newErrors.question = "Pergunta é obrigatória";
            isValid = false;
        } else if (question.trim().length < 3) {
            newErrors.question = "Pergunta deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        // Validação da resposta
        if (!answer.trim()) {
            newErrors.answer = "Resposta é obrigatória";
            isValid = false;
        } else if (answer.trim().length < 3) {
            newErrors.answer = "Resposta deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    // Manipulador de mudança nos inputs - limpa o erro do campo quando o usuário digita
    const handleInputChange = (field, value) => {
        if (field === "question") {
            setQuestion(value);
        } else if (field === "answer") {
            setAnswer(value);
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

    const onSubmit = async (e) => { 
        e.preventDefault();

        // Limpa mensagens de erro anteriores
        setErrorMessage({
            question: "",
            answer: "",
            main: "",
        });

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        setIsLoading(true); 
        
        try {
            await createCard(question, answer); 
            setIsAddCardFormOpen(false); 
        } catch (error) {
            console.error("Erro ao criar card:", error);
            setErrorMessage({ 
                main: "Ocorreu um erro ao criar o card. Tente novamente." 
            }); 
        } finally {
            setIsLoading(false); 
        }
    };

    const closeModal = () => {
        setIsAddCardFormOpen(false);
    };

    return (
        <>
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainerTitle}>
                    <h2>Criar novo Card</h2>

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
                            <label htmlFor="question">Pergunta</label>

                            <label
                                htmlFor="fileQuestion"
                                className={styles.file}
                            >
                                <IoMdLink />
                                <input
                                    type="file"
                                    name="fileQuestion"
                                    id="fileQuestion"
                                />
                            </label>
                        </div>
                        <textarea
                            name="question"
                            id="question"
                            placeholder="Digite a pergunta aqui"
                            onChange={(e) =>
                                handleInputChange("question", e.target.value)
                            }
                            value={question}
                            className={
                                errorMessage.question ? styles.inputError : ""
                            }
                        ></textarea>
                        {errorMessage.question && (
                            <span className={styles.fieldError}>
                                {errorMessage.question}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="answer">Resposta</label>
                            <label htmlFor="fileAnswer" className={styles.file}>
                                <IoMdLink />
                                <input
                                    type="file"
                                    name="fileAnswer"
                                    id="fileAnswer"
                                />
                            </label>
                        </div>
                        <textarea
                            name="answer"
                            id="answer"
                            placeholder="Digite a resposta aqui"
                            onChange={(e) =>
                                handleInputChange("answer", e.target.value)
                            }
                            value={answer}
                            className={
                                errorMessage.answer ? styles.inputError : ""
                            }
                        ></textarea>
                        {errorMessage.answer && (
                            <span className={styles.fieldError}>
                                {errorMessage.answer}
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

                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        loadingText="Criando Card..."
                    >
                        + Criar Card
                    </Button>
                </form>
            </div>
        </>
    );
};

export default AddCardForm;