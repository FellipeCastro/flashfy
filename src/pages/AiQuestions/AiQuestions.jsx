import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoAlertFill } from "react-icons/go";
import { RiRobot2Fill } from "react-icons/ri";
import { IoTicket } from "react-icons/io5";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./AiQuestions.module.css";

const AiQuestions = ({
    isSidebarOpen,
    setIsSidebarOpen,
    aiCredits,
    subtractAiCredits,
}) => {
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

    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem("questions");
        return saved ? JSON.parse(saved) : [];
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

    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem("questions", JSON.stringify(questions));
        }
    }, [questions]);

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

        if (aiCredits === 0) {
            newErrors.main = "Seus créditos acabaram!";
            isValid = false;
        }

        setErrorMessage(newErrors);
        setQuestions([]);
        return isValid;
    };

    // Manipulador de seleção de alternativa - CORRIGIDO
    const handleSelectAlternative = (questionIndex, alternativeId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: alternativeId, // Usa o índice da questão como chave
        }));
    };

    // Manipulador de mudança no formulário - limpa o erro do campo quando o usuário digita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpa o erro específico do campo quando o usuário começa a digitar
        if (errorMessage[name]) {
            setErrorMessage((prev) => ({
                ...prev,
                [name]: "",
                main: "",
            }));
        }
    };

    const generateQuestionsWithAI = async (formData) => {
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API;
            if (!apiKey) {
                throw new Error("Chave API não configurada");
            }
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            const prompt = `Você é um gerador especializado de questões educacionais em formato JSON.
            Gere EXATAMENTE ${formData.quantity} perguntas sobre "${formData.theme}" com dificuldade ${formData.difficulty}.
            
            FORMATO EXATO OBRIGATÓRIO (APENAS JSON PURO):
            {
                "questions": [
                    {
                        "text": "Texto completo da pergunta?",
                        "alternatives": [
                            {"id": "a", "text": "Alternativa A", "isCorrect": false},
                            {"id": "b", "text": "Alternativa B", "isCorrect": true},
                            {"id": "c", "text": "Alternativa C", "isCorrect": false},
                            {"id": "d", "text": "Alternativa D", "isCorrect": false}
                        ],
                        "explanation": "Explicação concisa da resposta correta"
                    }
                ]
            }
            
            REGRAS ESTRITAS DE FORMATAÇÃO:
            1. JSON VÁLIDO: Apenas o objeto JSON, sem texto adicional, comentários ou markdown
            2. ASPAS DUPLAS: Use exclusivamente aspas duplas (") para strings e propriedades
            3. SEM CARACTERES ESPECIAIS: 
               - Proibido: aspas simples ('), crases, barras invertidas, caracteres Unicode
               - Use apenas: letras A-Z, números 0-9, pontuação básica (. , ? !), espaços
            4. ESCAPE OBRIGATÓRIO: Se necessário, use \\" para aspas dentro de textos
            5. ESTRUTURA FIXA: 
               - Array "questions" com exatamente ${formData.quantity} objetos
               - Cada questão deve ter "text", "alternatives" (array com 4 objetos) e "explanation"
               - Cada alternativa deve ter "id" (a-d), "text" e "isCorrect" (boolean)
            6. VALIDAÇÃO BOOLEANA: "isCorrect" deve ser true ou false (não 0/1, não strings)
            
            REGRAS DE CONTEÚDO:
            - Apenas UMA alternativa correta por questão (isCorrect: true)
            - Textos claros, objetivos e autocontidos
            - Dificuldade proporcional: 
              * "Fácil": fatos básicos, reconhecimento
              * "Médio": aplicação de conceitos, relações simples
              * "Difícil": análise, síntese, múltiplos conceitos
            
            EXEMPLO DE TEXTO VÁLIDO:
            "text": "Qual a capital da França?"
            "text": "Em que ano ocorreu a Revolução Francesa?"
            "text": "Explique o conceito de fotossíntese."
            
            EXEMPLO DE TEXTO INVÁLIDO:
            "text": "Qual a capital da França? (dica: começa com 'P')"
            "text": "Em que ano ocorreu a Revolução Francesa? - considere o século XVIII"
            "text": "Explique o conceito de fotossíntese usando os termos 'clorofila' e 'CO2'"
            
            RETORNE APENAS O JSON VÁLIDO, SEM QUALQUER TEXTO ADICIONAL, COMENTÁRIOS OU EXPLICAÇÕES.`;

            console.log("Enviando prompt para Gemini...");
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            console.log("Resposta bruta:", responseText);

            // Função robusta para limpar e validar JSON
            const cleanAndParseJSON = (jsonString) => {
                let cleaned = jsonString.trim();

                // Remove qualquer texto antes do primeiro { e depois do último }
                const firstBrace = cleaned.indexOf("{");
                const lastBrace = cleaned.lastIndexOf("}");

                if (firstBrace === -1 || lastBrace === -1) {
                    throw new Error("JSON não encontrado na resposta");
                }

                cleaned = cleaned.substring(firstBrace, lastBrace + 1);

                // Remove code blocks
                cleaned = cleaned.replace(/```(json)?/g, "");

                // Substitui aspas simples por duplas
                cleaned = cleaned.replace(/'/g, '"');

                // Corrige vírgulas trailing
                cleaned = cleaned.replace(/,\s*}/g, "}");
                cleaned = cleaned.replace(/,\s*]/g, "]");

                // Remove quebras de linha e tabs
                cleaned = cleaned.replace(/[\n\t]/g, " ");

                // Remove múltiplos espaços
                cleaned = cleaned.replace(/\s+/g, " ");

                // Corrige chaves sem aspas
                cleaned = cleaned.replace(
                    /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$])(\s:)/g,
                    '$1"$2"$3'
                );

                // Corrige valores booleanos
                cleaned = cleaned.replace(/:(\s*)'(true|false)'/g, ":$1$2");
                cleaned = cleaned.replace(/:(\s*)"(true|false)"/g, ":$1$2");

                console.log("JSON limpo:", cleaned);

                return JSON.parse(cleaned);
            };

            const parsedData = cleanAndParseJSON(responseText);

            // Garantir que cada questão tenha um ID único baseado no índice
            return parsedData.questions.map((question, index) => ({
                ...question,
                id: index + 1, // ID único para cada questão
                alternatives: question.alternatives || [], // Garantir que alternatives exista
            }));
        } catch (error) {
            console.error("Erro detalhado na geração:", error);
            throw new Error(
                error.message || "Erro ao gerar questões. Tente novamente."
            );
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

        setQuestions([]);
        setSelectedAnswers({}); // Limpa respostas anteriores
        setAnswersVerified(false);

        try {
            setIsLoading(true);
            const generated = await generateQuestionsWithAI(formData);

            if (!generated || generated.length === 0) {
                throw new Error("Nenhuma questão foi gerada");
            }

            setQuestions(generated);
            subtractAiCredits();
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

    // Contador de respostas corretas
    const correctCount = questions.reduce((count, question, index) => {
        const selectedId = selectedAnswers[index]; // Usa o índice da questão
        if (!selectedId) return count;

        const selectedAlt = question.alternatives.find(
            (alt) => alt.id === selectedId
        );
        return count + (selectedAlt?.isCorrect ? 1 : 0);
    }, 0);

    // Função para verificar se todas as questões foram respondidas
    const allQuestionsAnswered =
        questions.length > 0 &&
        Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={styles.mainContainer}>
                <div className={styles.titleContainer}>
                    <h1>Gere perguntas por IA</h1>
                    <span className={styles.credits}>
                        {aiCredits}
                        <IoTicket />
                    </span>
                </div>

                {/* <p className={styles.paragraph}>
                    Gere perguntas personalizadas de qualquer tema usando
                    inteligência artificial. Você tem 3 créditos diários para
                    criar formulários com quantidade e dificuldade
                    personalizadas para seus estudos.
                </p> */}

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

                {errorMessage.main && !isLoading && questions.length === 0 && (
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

                {questions.length > 0 ? (
                    <>
                        <div className={styles.titleContainer}>
                            <h2>{formData.theme}</h2>
                            <div className={styles.flexTitle}>
                                <span
                                    className={`${styles.difficulty} ${
                                        styles[formData.difficulty]
                                    }`}
                                >
                                    {formData.difficulty}
                                </span>
                                <span>
                                    {answersVerified ? (
                                        <span
                                            className={
                                                correctCount ===
                                                questions.length
                                                    ? styles.perfectScore
                                                    : styles.normalScore
                                            }
                                        >
                                            {correctCount}/{questions.length}
                                        </span>
                                    ) : (
                                        `${
                                            Object.keys(selectedAnswers).length
                                        }/${questions.length}`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className={styles.questionsContainer}>
                            {questions.map((question, questionIndex) => {
                                const selectedId =
                                    selectedAnswers[questionIndex]; // Usa o índice da questão
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
                                            <p className={styles.questionText}>
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

                                                        if (answersVerified) {
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
                                                        } else if (isSelected) {
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
                                            questions.length - 1 && (
                                            <hr className={styles.divider} />
                                        )}
                                    </div>
                                );
                            })}
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
                                    de <strong>{questions.length}</strong>{" "}
                                    questões!
                                </p>
                                {correctCount === questions.length ? (
                                    <p className={styles.resultMsg}>
                                        Excelente! Parabéns!
                                    </p>
                                ) : correctCount >= questions.length / 2 ? (
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
                            {/* <RiRobot2Fill />
                            <strong className={styles.noQuestions}>
                                Gere perguntas de qualquer tema usando
                                Inteligência Artificial
                            </strong> */}
                        </div>
                    )
                )}

                {isLoading && (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Gerando questões...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiQuestions;
