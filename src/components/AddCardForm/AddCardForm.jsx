import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import ModalComponent from "../ModalComponent/ModalComponent";
import ErrorComponent from "../ErrorComponent/ErrorComponent";
import TextareaComponent from "../TextareaComponent/TextareaComponent";
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
                main: "Ocorreu um erro ao criar o card. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsAddCardFormOpen(false);
    };

    return (
        <ModalComponent closeModal={closeModal}>
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
                <ErrorComponent error={errorMessage.main} />

                <TextareaComponent
                    label="Pergunta"
                    name="question"
                    value={question}
                    onChange={(value) => handleInputChange("question", value)}
                    placeholder="Digite a pergunta aqui"
                    error={errorMessage.question}
                    disabled={isLoading}
                    required
                    rows={4}
                    maxLength={500}
                    showCharCount={true}
                />

                <TextareaComponent
                    label="Resposta"
                    name="answer"
                    value={answer}
                    onChange={(value) => handleInputChange("answer", value)}
                    placeholder="Digite a resposta aqui"
                    error={errorMessage.answer}
                    disabled={isLoading}
                    required
                    rows={6}
                    maxLength={1000}
                    showCharCount={true}
                />

                <Button
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Criando Card..."
                >
                    + Criar Card
                </Button>
            </form>
        </ModalComponent>
    );
};

export default AddCardForm;
