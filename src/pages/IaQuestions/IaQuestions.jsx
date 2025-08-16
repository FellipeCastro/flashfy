import { useState } from "react";
import Button from "../../components/Button/Button";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./IaQuestions.module.css";

// Componente de Alternativa
const Alternative = ({
    id,
    text,
    isSelected,
    onSelect,
    showCorrect,
    isCorrect,
}) => {
    const getAlternativeStyle = () => {
        if (showCorrect) {
            if (isCorrect) return styles.correct;
            if (isSelected && !isCorrect) return styles.incorrect;
        }
        return isSelected ? styles.selected : "";
    };

    return (
        <div
            className={`${styles.alternative} ${getAlternativeStyle()}`}
            onClick={() => !showCorrect && onSelect(id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex="0"
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    !showCorrect && onSelect(id);
                }
            }}
        >
            <span className={styles.radioIndicator} />
            <span className={styles.alternativeText}>{text}</span>
        </div>
    );
};

// Componente de Questão
const Question = ({
    id,
    text,
    alternatives,
    selectedAlternative,
    onSelectAlternative,
    showCorrect,
}) => {
    return (
        <div className={styles.question}>
            <p>{text}</p>
            <div className={styles.alternativesContainer}>
                {alternatives.map((alternative) => (
                    <Alternative
                        key={alternative.id}
                        id={alternative.id}
                        text={alternative.text}
                        isSelected={selectedAlternative === alternative.id}
                        onSelect={onSelectAlternative}
                        showCorrect={showCorrect}
                        isCorrect={alternative.isCorrect}
                    />
                ))}
            </div>
        </div>
    );
};

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
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

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
        // Aqui você implementaria a lógica para gerar questões com IA
        console.log("Dados para gerar questões:", formData);
        // Simulação de geração de questões
        // setQuestions(novasQuestoesGeradas);
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

                {questions.length > 0 && (
                    <>
                        <div className={styles.titleContainer}>
                            <h2>{formData.theme || "Revolução Industrial"}</h2>
                            <div className={styles.flexTitle}>
                                <span className={styles.difficulty}>
                                    {formData.difficulty || "Médio"}
                                </span>
                                <span>
                                    {/* {correctCount}/{questions.length} */}
                                    0/{questions.length}
                                </span>
                            </div>
                        </div>
                        <div className={styles.questionsContainer}>
                            {questions.map((question, index) => (
                                <>
                                    <div
                                        key={question.id}
                                        className={styles.question}
                                    >
                                        <p>{question.text}</p>
                                        <div
                                            className={
                                                styles.alternativesContainer
                                            }
                                        >
                                            {question.alternatives.map(
                                                (alternative) => (
                                                    <label
                                                        key={alternative.id}
                                                        className={`${
                                                            styles.alternative
                                                        } ${
                                                            selectedAnswers[
                                                                question.id
                                                            ] === alternative.id
                                                                ? styles.selected
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedAnswers[
                                                                    question.id
                                                                ] ===
                                                                alternative.id
                                                            }
                                                            onChange={() =>
                                                                handleSelectAlternative(
                                                                    question.id,
                                                                    alternative.id
                                                                )
                                                            }
                                                        />
                                                        <span
                                                            className={
                                                                styles.alternativeText
                                                            }
                                                        >
                                                            {alternative.text}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {index < questions.length - 1 && (
                                        <hr className={styles.divider} />
                                    )}
                                </>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default IaQuestions;
