import { useEffect, useState } from "react";
import {
    RiRobot2Fill,
    RiLightbulbFlashLine,
    RiHistoryLine,
    RiDownload2Line,
} from "react-icons/ri";
import { GoAlertFill } from "react-icons/go";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./AiQuestions.module.css";
import api from "../../constants/api.js";

const AiQuestions = ({ isSidebarOpen, setIsSidebarOpen, theme, toggleTheme }) => {
    const [formData, setFormData] = useState({
        theme: "",
        difficulty: "",
        quantity: "",
    });

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

    // Estado para o histórico
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const [clearHistoryModal, setClearHistoryModal] = useState(false);
    const [deleteHistoryItemModal, setDeleteHistoryItemModal] = useState({
        isOpen: false,
        itemId: null,
        itemTheme: "",
    });

    // Carrega o histórico do localStorage quando o componente monta
    useEffect(() => {
        const savedHistory = localStorage.getItem("aiQuestionsHistory");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Salva toda a resposta da API no localStorage
    useEffect(() => {
        if (aiResponse.questions.length > 0) {
            localStorage.setItem("aiResponse", JSON.stringify(aiResponse));
        }
    }, [aiResponse]);

    // Função para adicionar ao histórico
    const addToHistory = (response) => {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            theme: response.theme,
            difficulty: response.difficulty,
            quantity: response.quantity,
            questions: response.questions,
            score: answersVerified ? correctCount : null,
            totalQuestions: response.questions.length,
        };

        const newHistory = [historyItem, ...history.slice(0, 49)]; // Mantém apenas os 50 mais recentes
        setHistory(newHistory);
        localStorage.setItem("aiQuestionsHistory", JSON.stringify(newHistory));
    };

    // Função para carregar questão do histórico
    const loadFromHistory = (historyItem) => {
        setAiResponse({
            theme: historyItem.theme,
            difficulty: historyItem.difficulty,
            quantity: historyItem.quantity,
            questions: historyItem.questions,
        });
        setSelectedAnswers({});
        setAnswersVerified(false);
        setShowHistory(false);

        // Preenche o formulário com os dados do histórico
        setFormData({
            theme: historyItem.theme,
            difficulty: historyItem.difficulty,
            quantity: historyItem.quantity.toString(),
        });
    };

    // Função para limpar o histórico
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("aiQuestionsHistory");
        setClearHistoryModal(false);
    };

    // Função para excluir um item do histórico
    const deleteHistoryItem = (id) => {
        const newHistory = history.filter((item) => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem("aiQuestionsHistory", JSON.stringify(newHistory));
        setDeleteHistoryItemModal({
            isOpen: false,
            itemId: null,
            itemTheme: "",
        });
    };

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
            const response = await api.post("/ai/questions", {
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
            const newAiResponse = {
                theme: generated.theme || formData.theme,
                difficulty: generated.difficulty || formData.difficulty,
                quantity: generated.quantity || parseInt(formData.quantity),
                questions: generated.questions,
            };

            setAiResponse(newAiResponse);

            // Adiciona ao histórico
            addToHistory(newAiResponse);
        } catch (error) {
            console.error("Erro no submit:", error);
            setErrorMessage((prev) => ({
                ...prev,
                main: "Tente gerar as questões novamente!",
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

    // Formata a data para exibição
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return (
            date.toLocaleDateString("pt-BR") +
            " " +
            date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };

    return (
        <>
            {clearHistoryModal && (
                <ConfirmModal
                    title="Limpar histórico"
                    description="Suas questões salvas serão removidas. Tem certeza disso?"
                    btnText="Confirmar"
                    onClick={clearHistory}
                    onCancel={() => setClearHistoryModal(false)}
                />
            )}

            {deleteHistoryItemModal.isOpen && (
                <ConfirmModal
                    title="Excluir item do histórico"
                    description="Tem certeza que deseja excluir esse item do seu histórico?"
                    btnText="Confirmar"
                    onClick={() =>
                        deleteHistoryItem(deleteHistoryItemModal.itemId)
                    }
                    onCancel={() =>
                        setDeleteHistoryItemModal({
                            isOpen: false,
                            itemId: null,
                            itemTheme: "",
                        })
                    }
                />
            )}

            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                <div className={styles.mainContainer}>
                    <div className={styles.header}>
                        <div className={styles.headerTop}>
                            <div>
                                <h1>Perguntas com IA</h1>
                                <p>
                                    Gere perguntas usando Inteligência
                                    Artificial
                                </p>
                            </div>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className={styles.historyButton}
                            >
                                <RiHistoryLine />
                                {!showHistory
                                    ? `Histórico (${history.length})`
                                    : `Fechar (${history.length})`}
                            </button>
                        </div>
                    </div>

                    {showHistory ? (
                        <div className={styles.historyContainer}>
                            <div className={styles.historyHeader}>
                                <h2>Histórico de Questões</h2>
                                {history.length > 0 && (
                                    <Button
                                        onClick={() =>
                                            setClearHistoryModal(true)
                                        }
                                    >
                                        Limpar Histórico
                                    </Button>
                                )}
                            </div>

                            {history.length === 0 ? (
                                <div className={styles.emptyHistory}>
                                    <RiHistoryLine size={48} />
                                    <p>Nenhum questionário no histórico</p>
                                    <span>
                                        As questões geradas aparecerão aqui
                                    </span>
                                </div>
                            ) : (
                                <div className={styles.historyList}>
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            className={styles.historyItem}
                                            onClick={() =>
                                                loadFromHistory(item)
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.historyItemContent
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.historyItemHeader
                                                    }
                                                >
                                                    <h3>{item.theme}</h3>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteHistoryItemModal(
                                                                {
                                                                    isOpen: true,
                                                                    itemId: item.id,
                                                                    itemTheme:
                                                                        item.theme,
                                                                }
                                                            );
                                                        }}
                                                        className={
                                                            styles.deleteHistoryButton
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div
                                                    className={
                                                        styles.historyItemDetails
                                                    }
                                                >
                                                    <span
                                                        className={`${
                                                            styles.difficulty
                                                        } ${
                                                            styles[
                                                                item.difficulty
                                                            ]
                                                        }`}
                                                    >
                                                        {item.difficulty}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.quantity
                                                        }
                                                    >
                                                        {item.quantity}{" "}
                                                        {item.quantity > 1
                                                            ? "questões"
                                                            : "questão"}
                                                    </span>
                                                    {item.score !== null && (
                                                        <span
                                                            className={
                                                                styles.score
                                                            }
                                                        >
                                                            Pontuação:{" "}
                                                            {item.score}/
                                                            {
                                                                item.totalQuestions
                                                            }
                                                        </span>
                                                    )}
                                                    <span
                                                        className={styles.date}
                                                    >
                                                        {formatDate(
                                                            item.timestamp
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
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
                                            errorMessage.theme
                                                ? styles.inputError
                                                : ""
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
                                        <label htmlFor="difficulty">
                                            Dificuldade:
                                        </label>
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
                                            <option value="Difícil">
                                                Difícil
                                            </option>
                                        </select>
                                        {errorMessage.difficulty && (
                                            <span className={styles.fieldError}>
                                                {errorMessage.difficulty}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.inputContainer}>
                                        <label htmlFor="quantity">
                                            Quantidade:
                                        </label>
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
                                            <option value="">
                                                Selecione a quantidade
                                            </option>
                                            {[
                                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                            ].map((num) => (
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

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    loadingText="Gerando questões..."
                                >
                                    Gerar questões
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
                                            <h3>
                                                Não foi possível gerar as
                                                questões
                                            </h3>
                                            <p>{errorMessage.main}</p>
                                        </div>
                                    </div>
                                )}

                            {aiResponse.questions.length > 0 && (
                                <>
                                    <div className={styles.titleContainer}>
                                        <h2>{aiResponse.theme}</h2>
                                        <div className={styles.flexTitle}>
                                            <span
                                                className={`${
                                                    styles.difficulty
                                                } ${
                                                    styles[
                                                        aiResponse.difficulty
                                                    ]
                                                }`}
                                            >
                                                {aiResponse.difficulty}
                                            </span>
                                            <span>
                                                {answersVerified ? (
                                                    <span
                                                        className={
                                                            correctCount ===
                                                            aiResponse.questions
                                                                .length
                                                                ? styles.perfectScore
                                                                : styles.normalScore
                                                        }
                                                    >
                                                        {correctCount}/
                                                        {
                                                            aiResponse.questions
                                                                .length
                                                        }
                                                    </span>
                                                ) : (
                                                    `${
                                                        Object.keys(
                                                            selectedAnswers
                                                        ).length
                                                    }/${
                                                        aiResponse.questions
                                                            .length
                                                    }`
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.questionsContainer}>
                                        {aiResponse.questions.map(
                                            (question, questionIndex) => {
                                                const selectedId =
                                                    selectedAnswers[
                                                        questionIndex
                                                    ];
                                                const isCorrect = selectedId
                                                    ? question.alternatives.find(
                                                          (a) =>
                                                              a.id ===
                                                              selectedId
                                                      )?.isCorrect
                                                    : false;

                                                return (
                                                    <div
                                                        key={`question-${questionIndex}`}
                                                        className={
                                                            styles.questionItem
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.question
                                                            }
                                                        >
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
                                                                    (
                                                                        alternative
                                                                    ) => {
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
                                                            aiResponse.questions
                                                                .length -
                                                                1 && (
                                                            <hr
                                                                className={
                                                                    styles.divider
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                    {!answersVerified ? (
                                        <Button
                                            onClick={() => {
                                                setAnswersVerified(true);
                                                // Atualiza o histórico com a pontuação
                                                const updatedHistory =
                                                    history.map((item) => {
                                                        if (
                                                            item.theme ===
                                                                aiResponse.theme &&
                                                            item.difficulty ===
                                                                aiResponse.difficulty &&
                                                            item.quantity ===
                                                                aiResponse.quantity
                                                        ) {
                                                            return {
                                                                ...item,
                                                                score: correctCount,
                                                            };
                                                        }
                                                        return item;
                                                    });
                                                setHistory(updatedHistory);
                                                localStorage.setItem(
                                                    "aiQuestionsHistory",
                                                    JSON.stringify(
                                                        updatedHistory
                                                    )
                                                );
                                            }}
                                            disabled={!allQuestionsAnswered}
                                        >
                                            Verificar respostas
                                        </Button>
                                    ) : (
                                        <div className={styles.resultsFeedback}>
                                            <p>
                                                Você acertou{" "}
                                                <strong>{correctCount}</strong>{" "}
                                                de{" "}
                                                <strong>
                                                    {
                                                        aiResponse.questions
                                                            .length
                                                    }
                                                </strong>{" "}
                                                questões -{" "}
                                            </p>
                                            {correctCount ===
                                            aiResponse.questions.length ? (
                                                <span
                                                    className={styles.resultMsg}
                                                >
                                                    Excelente! Parabéns!
                                                </span>
                                            ) : correctCount >=
                                              aiResponse.questions.length /
                                                  2 ? (
                                                <span
                                                    className={styles.resultMsg}
                                                >
                                                    Bom trabalho!
                                                </span>
                                            ) : (
                                                <span
                                                    className={styles.resultMsg}
                                                >
                                                    Continue estudando!
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                            {!errorMessage.main &&
                                !isLoading &&
                                aiResponse.questions.length === 0 && (
                                    <div className={styles.tips}>
                                        <div className={styles.tipsHeader}>
                                            <div className={styles.tipsIcon}>
                                                <RiLightbulbFlashLine />
                                            </div>
                                            <h4>
                                                Dicas para melhores resultados:
                                            </h4>
                                        </div>
                                        <ul className={styles.tipsList}>
                                            <li>
                                                Seja específico no tema (ex:
                                                "Fotossíntese" em vez de
                                                "Biologia")
                                            </li>
                                            <li>
                                                Comece com dificuldade fácil e
                                                aumente gradualmente
                                            </li>
                                            <li>
                                                Use temas que você está
                                                estudando atualmente
                                            </li>
                                        </ul>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AiQuestions;