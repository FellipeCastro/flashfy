import { useState } from "react";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./IaQuestions.module.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const IaQuestions = ({ isSidebarOpen, setIsSidebarOpen }) => {
    // Estado para o formulário de geração
    const [formData, setFormData] = useState({
        theme: "",
        difficulty: "",
        quantity: "",
    });

    // Estado para as questões geradas
    const [questions, setQuestions] = useState([
        // {
        //     id: 1,
        //     text: "Qual foi o principal fator da Revolução Industrial?",
        //     alternatives: [
        //         {
        //             id: "a",
        //             text: "Invenção da máquina a vapor",
        //             isCorrect: true,
        //         },
        //         {
        //             id: "b",
        //             text: "Descoberta da eletricidade",
        //             isCorrect: false,
        //         },
        //         { id: "c", text: "Invenção do computador", isCorrect: false },
        //         { id: "d", text: "Revolução Francesa", isCorrect: false },
        //     ],
        // },
        // {
        //     id: 2,
        //     text: "Em que século começou a Revolução Industrial?",
        //     alternatives: [
        //         { id: "a", text: "Século XVII", isCorrect: false },
        //         { id: "b", text: "Século XVIII", isCorrect: true },
        //         { id: "c", text: "Século XIX", isCorrect: false },
        //         { id: "d", text: "Século XX", isCorrect: false },
        //     ],
        // },
    ]);

    // Estado para as respostas selecionadas
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answersVerified, setAnswersVerified] = useState(false);

    // Manipulador de seleção de alternativa
    const handleSelectAlternative = (questionId, alternativeId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: alternativeId,
        }));
    };

    // Manipulador de mudança no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const generateQuestionsWithAI = async (formData) => {
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            const prompt = `Você é um especialista em criação de questões educacionais. Gere ${formData.quantity} perguntas sobre "${formData.theme}" com dificuldade ${formData.difficulty}.

            REQUISITOS:
            - 4 alternativas por questão (A, B, C, D)
            - Apenas UMA correta por questão
            - Formato JSON estrito conforme exemplo:

            {
                "questions": [
                    {
                        "text": "Pergunta exemplo?",
                        "alternatives": [
                            {"id": "a", "text": "Alternativa A", "isCorrect": false},
                            {"id": "b", "text": "Alternativa B", "isCorrect": true},
                            {"id": "c", "text": "Alternativa C", "isCorrect": false},
                            {"id": "d", "text": "Alternativa D", "isCorrect": false}
                        ],
                        "explanation": "Explicação concisa"
                    }
                ]
            }`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Melhor tratamento da resposta
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Formato de resposta inesperado");

            const parsedData = JSON.parse(jsonMatch[0]);
            return parsedData.questions.map((q, i) => ({
                id: i + 1,
                text: q.text,
                alternatives: q.alternatives,
                explanation: q.explanation,
            }));
        } catch (error) {
            console.error("Erro na geração:", error);
            throw new Error("Erro ao gerar questões. Tente novamente.");
        }
    };

    // Manipulador de envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.theme || !formData.difficulty || !formData.quantity) {
                alert("Preencha todos os campos");
                return;
            }

            const generated = await generateQuestionsWithAI(formData);
            setQuestions(generated);
            setSelectedAnswers({});
            setAnswersVerified(false);
        } catch (error) {
            alert(error.message);
        }
    };

    // Função para verificar as respostas
    const handleVerifyAnswers = () => {
        setAnswersVerified(true);
    };

    // Contador de respostas corretas
    const correctCount = questions.reduce((count, question) => {
        const selectedId = selectedAnswers[question.id];
        if (!selectedId) return count;
        const selectedAlt = question.alternatives.find(
            (alt) => alt.id === selectedId
        );
        return count + (selectedAlt?.isCorrect ? 1 : 0);
    }, 0);

    return (
        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={styles.mainContainer}>
                <h1>Gere perguntas por IA</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="theme">Tema:</label>
                        <input
                            type="text"
                            name="theme"
                            id="theme"
                            placeholder="Digite o tema das questões aqui"
                            value={formData.theme}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.flexContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="difficulty">Dificuldade:</label>
                            <select
                                name="difficulty"
                                id="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">
                                    Selecione a dificuldade
                                </option>
                                <option value="easy">Fácil</option>
                                <option value="medium">Médio</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="quantity">Quantidade:</label>
                            <select
                                name="quantity"
                                id="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione a quantidade</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Button type="submit">Gerar perguntas por IA</Button>
                </form>

                {questions.length > 0 ? (
                    <>
                        <div className={styles.titleContainer}>
                            <h2>{formData.theme || "Revolução Industrial"}</h2>
                            <div className={styles.flexTitle}>
                                <span className={styles.difficulty}>
                                    {formData.difficulty || "Médio"}
                                </span>
                                <span>
                                    {answersVerified ? (
                                        <span>
                                            {correctCount}/{questions.length}
                                        </span>
                                    ) : (
                                        `0/${questions.length}`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div
                            className={`${styles.questionsContainer} ${
                                answersVerified ? styles.showCorrect : ""
                            }`}
                        >
                            {questions.map((question, index) => {
                                const selectedId = selectedAnswers[question.id];
                                const isCorrect = selectedId
                                    ? question.alternatives.find(
                                          (a) => a.id === selectedId
                                      )?.isCorrect
                                    : false;

                                return (
                                    <div key={question.id}>
                                        <div className={styles.question}>
                                            <p>{question.text}</p>
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
                                                        }

                                                        return (
                                                            <label
                                                                key={
                                                                    alternative.id
                                                                }
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
                                                                            question.id,
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
                                        {index < questions.length - 1 && (
                                            <hr className={styles.divider} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {!answersVerified ? (
                            <Button onClick={handleVerifyAnswers}>
                                Verificar respostas
                            </Button>
                        ) : (
                            <div className={styles.resultsFeedback}>
                                Você acertou {correctCount} de{" "}
                                {questions.length} questões!
                            </div>
                        )}
                    </>
                ) : (
                    <strong className={styles.noQuestions}>
                        Gere perguntas de qualquer tema usando Inteligência
                        Artificial
                    </strong>
                )}
            </div>
        </div>
    );
};

export default IaQuestions;
