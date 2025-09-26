import { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./AiQuestions.module.css";
import api from "../../constants/api.js";

const AiQuestions = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("formData");
        return saved
            ? JSON.parse(saved)
            : {
                  theme: "",
                  difficulty: "",
                  quantity: "",
              };
    });

    // STATE UNIFICADO para armazenar toda a resposta da API
    const [aiResponse, setAiResponse] = useState(() => {
        const saved = localStorage.getItem("aiResponse");
        return saved
            ? JSON.parse(saved)
            : {
                  theme: "",
                  difficulty: "",
                  quantity: 0,
                  questions: [],
              };
    });

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answersVerified, setAnswersVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        theme: "",
        difficulty: "",
        quantity: "",
        main: "",
    });

    // Salva toda a resposta da API no localStorage
    useEffect(() => {
        if (aiResponse.questions.length > 0) {
            localStorage.setItem("aiResponse", JSON.stringify(aiResponse));
        }
    }, [aiResponse]);

    // Função para validar o formulário
    const validateForm = () => {
        const newErrors = {
            theme: "",
            difficulty: "",
            quantity: "",
            main: "",
        };

        let isValid = true;

        // Validação do tema
        if (!formData.theme.trim()) {
            newErrors.theme = "Tema é obrigatório";
            isValid = false;
        } else if (formData.theme.trim().length < 3) {
            newErrors.theme = "Tema deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        // Validação da dificuldade
        if (!formData.difficulty) {
            newErrors.difficulty = "Selecione a dificuldade";
            isValid = false;
        }

        // Validação da quantidade
        if (!formData.quantity) {
            newErrors.quantity = "Selecione a quantidade";
            isValid = false;
        }

        setErrorMessage(newErrors);
        setAiResponse((prev) => ({ ...prev, questions: [] })); // Limpa apenas as questões
        return isValid;
    };

    // Manipulador de seleção de alternativa
    const handleSelectAlternative = (questionIndex, alternativeId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: alternativeId,
        }));
    };

    // Manipulador de mudança no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errorMessage[name]) {
            setErrorMessage((prev) => ({
                ...prev,
                [name]: "",
                main: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpa mensagens de erro anteriores
        setErrorMessage({
            theme: "",
            difficulty: "",
            quantity: "",
            main: "",
        });

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        localStorage.setItem("formData", JSON.stringify(formData));

        // Limpa respostas anteriores
        setSelectedAnswers({});
        setAnswersVerified(false);

        try {
            setIsLoading(true);
            const response = await api.post("/ai-questions", {
                theme: formData.theme,
                difficulty: formData.difficulty,
                quantity: formData.quantity,
            });

            const generated = response.data;

            if (
                !generated ||
                !generated.questions ||
                generated.questions.length === 0
            ) {
                throw new Error("Nenhuma questão foi gerada");
            }

            // SALVA TODA A RESPOSTA DA API NO STATE
            setAiResponse({
                theme: generated.theme || formData.theme,
                difficulty: generated.difficulty || formData.difficulty,
                quantity: generated.quantity || parseInt(formData.quantity),
                questions: generated.questions,
            });
        } catch (error) {
            console.error("Erro no submit:", error);
            setErrorMessage((prev) => ({
                ...prev,
                main:
                    error.response?.data?.error ||
                    "Tente gerar as questões novamente!",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    // Contador de respostas corretas (agora usa aiResponse.questions)
    const correctCount = aiResponse.questions.reduce(
        (count, question, index) => {
            const selectedId = selectedAnswers[index];
            if (!selectedId) return count;

            const selectedAlt = question.alternatives.find(
                (alt) => alt.id === selectedId
            );
            return count + (selectedAlt?.isCorrect ? 1 : 0);
        },
        0
    );

    // Função para verificar se todas as questões foram respondidas
    const allQuestionsAnswered =
        aiResponse.questions.length > 0 &&
        Object.keys(selectedAnswers).length === aiResponse.questions.length;

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={styles.mainContainer}>
                <div className={styles.titleContainer}>
                    <h1>Gere perguntas por IA</h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                    autoComplete="off"
                >
                    <div className={styles.inputContainer}>
                        <label htmlFor="theme">Tema:</label>
                        <input
                            type="text"
                            name="theme"
                            id="theme"
                            placeholder="Digite o tema das questões aqui"
                            value={formData.theme}
                            onChange={handleInputChange}
                            className={
                                errorMessage.theme ? styles.inputError : ""
                            }
                        />
                        {errorMessage.theme && (
                            <span className={styles.fieldError}>
                                {errorMessage.theme}
                            </span>
                        )}
                    </div>

                    <div className={styles.flexContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="difficulty">Dificuldade:</label>
                            <select
                                name="difficulty"
                                id="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className={
                                    errorMessage.difficulty
                                        ? styles.inputError
                                        : ""
                                }
                            >
                                <option value="">
                                    Selecione a dificuldade
                                </option>
                                <option value="Fácil">Fácil</option>
                                <option value="Médio">Médio</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                            {errorMessage.difficulty && (
                                <span className={styles.fieldError}>
                                    {errorMessage.difficulty}
                                </span>
                            )}
                        </div>

                        <div className={styles.inputContainer}>
                            <label htmlFor="quantity">Quantidade:</label>
                            <select
                                name="quantity"
                                id="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className={
                                    errorMessage.quantity
                                        ? styles.inputError
                                        : ""
                                }
                            >
                                <option value="">Selecione a quantidade</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            {errorMessage.quantity && (
                                <span className={styles.fieldError}>
                                    {errorMessage.quantity}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Gerando..." : "Gerar perguntas por IA"}
                    </Button>
                </form>

                {errorMessage.main &&
                    !isLoading &&
                    aiResponse.questions.length === 0 && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorIcon}>
                                <GoAlertFill />
                            </div>
                            <div className={styles.errorText}>
                                <h3>Não foi possível gerar as questões</h3>
                                <p>{errorMessage.main}</p>
                            </div>
                        </div>
                    )}

                {aiResponse.questions.length > 0 ? (
                    <>
                        <div className={styles.titleContainer}>
                            {/* USA OS DADOS DA RESPOSTA DA API */}
                            <h2>{aiResponse.theme}</h2>
                            <div className={styles.flexTitle}>
                                <span
                                    className={`${styles.difficulty} ${
                                        styles[aiResponse.difficulty]
                                    }`}
                                >
                                    {aiResponse.difficulty}
                                </span>
                                <span>
                                    {answersVerified ? (
                                        <span
                                            className={
                                                correctCount ===
                                                aiResponse.questions.length
                                                    ? styles.perfectScore
                                                    : styles.normalScore
                                            }
                                        >
                                            {correctCount}/
                                            {aiResponse.questions.length}
                                        </span>
                                    ) : (
                                        `${
                                            Object.keys(selectedAnswers).length
                                        }/${aiResponse.questions.length}`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className={styles.questionsContainer}>
                            {aiResponse.questions.map(
                                (question, questionIndex) => {
                                    const selectedId =
                                        selectedAnswers[questionIndex];
                                    const isCorrect = selectedId
                                        ? question.alternatives.find(
                                              (a) => a.id === selectedId
                                          )?.isCorrect
                                        : false;

                                    return (
                                        <div
                                            key={`question-${questionIndex}`}
                                            className={styles.questionItem}
                                        >
                                            <div className={styles.question}>
                                                <p
                                                    className={
                                                        styles.questionText
                                                    }
                                                >
                                                    {question.text}
                                                </p>
                                                <div
                                                    className={
                                                        styles.alternativesContainer
                                                    }
                                                >
                                                    {question.alternatives.map(
                                                        (alternative) => {
                                                            const isSelected =
                                                                selectedId ===
                                                                alternative.id;
                                                            let alternativeClass =
                                                                "";

                                                            if (
                                                                answersVerified
                                                            ) {
                                                                if (
                                                                    alternative.isCorrect
                                                                ) {
                                                                    alternativeClass =
                                                                        styles.correct;
                                                                } else if (
                                                                    isSelected &&
                                                                    !alternative.isCorrect
                                                                ) {
                                                                    alternativeClass =
                                                                        styles.incorrect;
                                                                }
                                                            } else if (
                                                                isSelected
                                                            ) {
                                                                alternativeClass =
                                                                    styles.selected;
                                                            }

                                                            return (
                                                                <label
                                                                    key={`alt-${questionIndex}-${alternative.id}`}
                                                                    className={`${
                                                                        styles.alternative
                                                                    } ${alternativeClass} ${
                                                                        answersVerified
                                                                            ? styles.verified
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            isSelected
                                                                        }
                                                                        onChange={() =>
                                                                            !answersVerified &&
                                                                            handleSelectAlternative(
                                                                                questionIndex,
                                                                                alternative.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            answersVerified
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            styles.alternativeText
                                                                        }
                                                                    >
                                                                        {
                                                                            alternative.text
                                                                        }
                                                                        {answersVerified &&
                                                                            alternative.isCorrect && (
                                                                                <span
                                                                                    className={
                                                                                        styles.correctMarker
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    (Correta)
                                                                                </span>
                                                                            )}
                                                                    </span>
                                                                </label>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                            {questionIndex <
                                                aiResponse.questions.length -
                                                    1 && (
                                                <hr
                                                    className={styles.divider}
                                                />
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {!answersVerified ? (
                            <>
                                <Button
                                    onClick={() => setAnswersVerified(true)}
                                    disabled={!allQuestionsAnswered}
                                >
                                    Verificar respostas
                                </Button>
                            </>
                        ) : (
                            <div className={styles.resultsFeedback}>
                                <p>
                                    Você acertou <strong>{correctCount}</strong>{" "}
                                    de{" "}
                                    <strong>
                                        {aiResponse.questions.length}
                                    </strong>{" "}
                                    questões!
                                </p>
                                {correctCount ===
                                aiResponse.questions.length ? (
                                    <p className={styles.resultMsg}>
                                        Excelente! Parabéns!
                                    </p>
                                ) : correctCount >=
                                  aiResponse.questions.length / 2 ? (
                                    <p className={styles.resultMsg}>
                                        Bom trabalho!
                                    </p>
                                ) : (
                                    <p className={styles.resultMsg}>
                                        Continue estudando!
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    !errorMessage.main &&
                    !isLoading && (
                        <div className={styles.emptyState}>
                            {/* Conteúdo do empty state */}
                        </div>
                    )
                )}

                {isLoading && (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p id="loader">Gerando questões...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiQuestions;
