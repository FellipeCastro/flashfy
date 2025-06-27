const mockDecks = [
    {
        id: 1,
        title: "Expressões numéricas",
        subject: "Matemática",
        toDo: true,
        cards: [
            {
                question: "Qual é a ordem correta das operações matemáticas?",
                answer: "Parênteses, Expoentes, Multiplicação/Divisão (da esquerda para a direita), Adição/Subtração (da esquerda para a direita)",
                difficulty: null,
            },
            {
                question: "Quanto é (5 + 3) × 2?",
                answer: "16",
                difficulty: null,
            },
        ],
    },
    {
        id: 2,
        title: "Cadeia alimentar",
        subject: "Biologia",
        toDo: true,
        cards: [
            {
                question: "O que é um produtor em uma cadeia alimentar?",
                answer: "Organismos que produzem seu próprio alimento através da fotossíntese",
                difficulty: null,
            },
            {
                question:
                    "Qual a diferença entre cadeia alimentar e teia alimentar?",
                answer: "Cadeia alimentar é linear, enquanto teia alimentar mostra múltiplas interconexões",
                difficulty: null,
            },
            {
                question: "O que são decompositores?",
                answer: "Organismos que quebram matéria orgânica morta",
                difficulty: null,
            },
        ],
    },
    {
        id: 3,
        title: "Neocolonialismo",
        subject: "História",
        toDo: false,
        cards: [
            {
                question: "O que foi o neocolonialismo?",
                answer: "Expansão imperialista das potências europeias no século XIX",
                difficulty: null,
            },
            {
                question:
                    "Qual conferência dividiu a África entre as potências europeias?",
                answer: "Conferência de Berlim (1884-1885)",
                difficulty: null,
            },
            {
                question:
                    "Qual era o principal interesse econômico no neocolonialismo?",
                answer: "Obtenção de matéria-prima e novos mercados",
                difficulty: null,
            },
        ],
    },
    {
        id: 4,
        title: "Funções quadráticas",
        subject: "Matemática",
        toDo: false,
        cards: [
            {
                question: "Qual a forma geral de uma função quadrática?",
                answer: "f(x) = ax² + bx + c",
                difficulty: null,
            },
            {
                question: "Como se calcula o vértice de uma parábola?",
                answer: "x = -b/2a, depois substitui na função para encontrar y",
                difficulty: null,
            },
        ],
    },
    {
        id: 5,
        title: "Tabela periódica",
        subject: "Química",
        toDo: true,
        cards: [
            {
                question: "Quem organizou a primeira tabela periódica?",
                answer: "Dmitri Mendeleiev",
                difficulty: null,
            },
            {
                question: "O que são grupos na tabela periódica?",
                answer: "Colunas verticais com propriedades químicas similares",
                difficulty: null,
            },
            {
                question: "Qual a diferença entre metais e não-metais?",
                answer: "Metais são bons condutores, maleáveis; não-metais são geralmente isolantes",
                difficulty: null,
            },
        ],
    },
    {
        id: 6,
        title: "Literatura modernista",
        subject: "Literatura",
        toDo: false,
        cards: [
            {
                question: "Quando ocorreu a Semana de Arte Moderna no Brasil?",
                answer: "1922",
                difficulty: null,
            },
            {
                question: "Quais são as três fases do modernismo brasileiro?",
                answer: "1ª fase (1922-1930): heroica; 2ª fase (1930-1945): regionalista; 3ª fase (1945-): experimentalismo",
                difficulty: null,
            },
        ],
    },
];

export default mockDecks;
