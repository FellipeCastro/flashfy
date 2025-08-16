import { useState } from "react";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./IaQuestions.module.css";

const IaQuestions = ({ isSidebarOpen, setIsSidebarOpen }) => {
    // Estado para o formulário de geração
    const [formData, setFormData] = useState({
        theme: "",
        difficulty: "",
        quantity: "",
    });

    // Estado para as questões geradas
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: "Qual foi o principal fator da Revolução Industrial?",
            alternatives: [
                {
                    id: "a",
                    text: "Invenção da máquina a vapor",
                    isCorrect: true,
                },
                {
                    id: "b",
                    text: "Descoberta da eletricidade",
                    isCorrect: false,
                },
                { id: "c", text: "Invenção do computador", isCorrect: false },
                { id: "d", text: "Revolução Francesa", isCorrect: false },
            ],
        },
        {
            id: 2,
            text: "Em que século começou a Revolução Industrial?",
            alternatives: [
                { id: "a", text: "Século XVII", isCorrect: false },
                { id: "b", text: "Século XVIII", isCorrect: true },
                { id: "c", text: "Século XIX", isCorrect: false },
                { id: "d", text: "Século XX", isCorrect: false },
            ],
        },
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

    // Manipulador de envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para gerar questões com IA
        console.log("Dados para gerar questões:", formData);
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
                            <Button
                                onClick={handleVerifyAnswers}
                            >
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
                        Gere perguntas de qualquer tema usando Inteligência Artificial
                    </strong>
                )}
            </div>
        </div>
    );
};

export default IaQuestions;
