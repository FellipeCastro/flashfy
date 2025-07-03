const mockDecks = [
    {
        id: 1,
        title: "Expressões numéricas",
        subject: "Matemática",
        toDo: false,
        nextReview: "2025-07-03T22:00:00", // Amanhã de manhã
        cards: [
            {
                question: "Qual é a ordem correta das operações matemáticas?",
                answer: "Parênteses, Expoentes, Multiplicação/Divisão, Adição/Subtração",
                difficulty: null,
            },
            {
                question: "Quanto é (5 + 3) × 2?",
                answer: "16",
                difficulty: null,
            }
        ]
    },
    {
        id: 2,
        title: "Cadeia alimentar",
        subject: "Biologia",
        toDo: false,
        nextReview: "2025-07-02T18:00:00", // 2 dias depois, fim de tarde
        cards: [
            {
                question: "O que é um produtor em uma cadeia alimentar?",
                answer: "Organismos que produzem alimento via fotossíntese",
                difficulty: null,
            },
            {
                question: "Qual a diferença entre cadeia e teia alimentar?",
                answer: "Cadeia é linear, teia mostra interconexões múltiplas",
                difficulty: null,
            }
        ]
    },
    {
        id: 3,
        title: "Neocolonialismo",
        subject: "História",
        toDo: false,
        nextReview: "2025-07-05T14:00:00", // 4 dias depois, tarde
        cards: [
            {
                question: "O que foi o neocolonialismo?",
                answer: "Expansão imperialista europeia no século XIX",
                difficulty: null,
            },
            {
                question: "Qual conferência dividiu a África?",
                answer: "Conferência de Berlim (1884-1885)",
                difficulty: null,
            }
        ]
    },
    {
        id: 4,
        title: "Funções quadráticas",
        subject: "Matemática",
        toDo: false,
        nextReview: "2025-07-08T10:30:00", // 1 semana depois, manhã
        cards: [
            {
                question: "Qual a forma geral de uma função quadrática?",
                answer: "f(x) = ax² + bx + c",
                difficulty: null,
            },
            {
                question: "Como calcular o vértice?",
                answer: "x = -b/2a, depois calcular y",
                difficulty: null,
            }
        ]
    },
    {
        id: 5,
        title: "Tabela periódica",
        subject: "Química",
        toDo: false,
        nextReview: "2025-07-01T20:00:00", // Hoje mesmo, à noite
        cards: [
            {
                question: "Quem organizou a primeira tabela periódica?",
                answer: "Dmitri Mendeleiev",
                difficulty: null,
            },
            {
                question: "O que são grupos na tabela periódica?",
                answer: "Colunas com propriedades químicas similares",
                difficulty: null,
            }
        ]
    },
    {
        id: 6,
        title: "Literatura modernista",
        subject: "Literatura",
        toDo: false,
        nextReview: "2025-07-15T16:00:00", // 2 semanas depois
        cards: [
            {
                question: "Quando ocorreu a Semana de Arte Moderna?",
                answer: "1922",
                difficulty: null,
            },
            {
                question: "Quais são as três fases do modernismo?",
                answer: "1ª fase (1922-30), 2ª fase (1930-45), 3ª fase (pós-45)",
                difficulty: null,
            }
        ]
    }
];

export default mockDecks;