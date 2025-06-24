import { useState } from "react";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import Sidebar from "./components/Sidebar/Sidebar";
import Button from "./components/Button/Button";
import Deck from "./components/Deck/Deck";
import AddCardForm from "./components/AddCardForm/AddCardForm";
import styles from "./App.module.css";
import AddDeckForm from "./components/AddDeckForm/AddDeckForm";

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddCardFormOpen, setIsAddCardFormOpen] = useState(false);
    const [isAddDeckFormOpen, setIsAddDeckFormOpen] = useState(false);

    const subjects = [
        { name: "Português", color: "rgba(255, 193, 7, 0.4)" },
        { name: "Literatura", color: "rgba(156, 39, 176, 0.4)" },
        { name: "Inglês", color: "rgba(229, 57, 53, 0.4)" },
        { name: "Espanhol", color: "rgba(255, 152, 0, 0.4)" },
        { name: "Artes", color: "rgba(255, 235, 59, 0.4)" },
        { name: "Matemática", color: "rgba(33, 150, 243, 0.4)" },
        { name: "Biologia", color: "rgba(76, 175, 80, 0.4)" },
        { name: "Física", color: "rgba(158, 158, 158, 0.4)" },
        { name: "Química", color: "rgba(56, 142, 60, 0.4)" },
        { name: "História", color: "rgba(239, 154, 154, 0.4)" },
        { name: "Geografia", color: "rgba(171, 71, 188, 0.4)" },
        { name: "Filosofia", color: "rgba(0, 188, 212, 0.4)" },
        { name: "Sociologia", color: "rgba(255, 87, 34, 0.4)" },
    ];

    const decks = [
        {
            title: "Expressões numéricas",
            subject: "Matemática",
            cards: [
                {
                    question:
                        "Qual é a ordem correta das operações matemáticas?",
                    answer: "Parênteses, Expoentes, Multiplicação/Divisão (da esquerda para a direita), Adição/Subtração (da esquerda para a direita)",
                },
                { question: "Quanto é (5 + 3) × 2?", answer: "16" },
            ],
            toDo: true,
        },
        {
            title: "Cadeia alimentar",
            subject: "Biologia",
            cards: [
                {
                    question: "O que é um produtor em uma cadeia alimentar?",
                    answer: "Organismos que produzem seu próprio alimento através da fotossíntese",
                },
                {
                    question:
                        "Qual a diferença entre cadeia alimentar e teia alimentar?",
                    answer: "Cadeia alimentar é linear, enquanto teia alimentar mostra múltiplas interconexões",
                },
                {
                    question: "O que são decompositores?",
                    answer: "Organismos que quebram matéria orgânica morta",
                },
            ],
            toDo: true,
        },
        {
            title: "Neocolonialismo",
            subject: "História",
            cards: [
                {
                    question: "O que foi o neocolonialismo?",
                    answer: "Expansão imperialista das potências europeias no século XIX",
                },
                {
                    question:
                        "Qual conferência dividiu a África entre as potências europeias?",
                    answer: "Conferência de Berlim (1884-1885)",
                },
                {
                    question:
                        "Qual era o principal interesse econômico no neocolonialismo?",
                    answer: "Obtenção de matéria-prima e novos mercados",
                },
            ],
            toDo: false,
        },
        {
            title: "Funções quadráticas",
            subject: "Matemática",
            cards: [
                {
                    question: "Qual a forma geral de uma função quadrática?",
                    answer: "f(x) = ax² + bx + c",
                },
                {
                    question: "Como se calcula o vértice de uma parábola?",
                    answer: "x = -b/2a, depois substitui na função para encontrar y",
                },
            ],
            toDo: false,
        },
        {
            title: "Tabela periódica",
            subject: "Química",
            cards: [
                {
                    question: "Quem organizou a primeira tabela periódica?",
                    answer: "Dmitri Mendeleiev",
                },
                {
                    question: "O que são grupos na tabela periódica?",
                    answer: "Colunas verticais com propriedades químicas similares",
                },
                {
                    question: "Qual a diferença entre metais e não-metais?",
                    answer: "Metais são bons condutores, maleáveis; não-metais são geralmente isolantes",
                },
            ],
            toDo: true,
        },
        {
            title: "Literatura modernista",
            subject: "Literatura",
            cards: [
                {
                    question:
                        "Quando ocorreu a Semana de Arte Moderna no Brasil?",
                    answer: "1922",
                },
                {
                    question:
                        "Quais são as três fases do modernismo brasileiro?",
                    answer: "1ª fase (1922-1930): heroica; 2ª fase (1930-1945): regionalista; 3ª fase (1945-): experimentalismo",
                },
            ],
            toDo: false,
        },
    ];

    const subjectColors = subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.color;
        return acc;
    }, {});

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <ProgressBar />

                    <div className={styles.titleContainer}>
                        <h1>Meus decks</h1>
                        <div className={styles.btnsContainer}>
                            <Button
                                secondary
                                onClick={() => setIsAddDeckFormOpen(true)}
                            >
                                + Novo deck
                            </Button>
                            <Button onClick={() => setIsAddCardFormOpen(true)}>
                                + Novo card
                            </Button>
                        </div>
                    </div>
                    <div className={styles.filterContainer}>
                        {subjects.map((subject) => {
                            return (
                                <button
                                    style={{
                                        backgroundColor: subject.color,
                                    }}
                                >
                                    {subject.name}
                                </button>
                            );
                        })}
                    </div>
                    <ul className={styles.decksConatiner}>
                        {decks
                            // Ordena: decks com toDo=true vêm primeiro
                            .sort((a, b) => {
                                if (a.toDo === b.toDo) return 0; // mesma categoria, mantém ordem
                                return a.toDo ? -1 : 1; // toDo=true vem antes
                            })
                            .map((deck) => (
                                <Deck
                                    key={deck.title}
                                    color={subjectColors[deck.subject]}
                                    subject={deck.subject}
                                    title={deck.title}
                                    cards={deck.cards.length}
                                    toDo={deck.toDo}
                                />
                            ))}
                    </ul>
                </div>
            </div>

            {isAddCardFormOpen && (
                <AddCardForm setIsAddCardFormOpen={setIsAddCardFormOpen} />
            )}
            {isAddDeckFormOpen && (
                <AddDeckForm setIsAddDeckFormOpen={setIsAddDeckFormOpen} />
            )}
        </>
    );
};

export default App;
