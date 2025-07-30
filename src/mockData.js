const mockData = {
    id: 1,
    email: "fehcastru@gmail.com",
    name: "Fellipe Castro",
    password: "1234",
    progress: {
        consecutiveDays: 0,
        decksToStudy: 0,
        studiedDecks: 0,
    },
    decks: [    
        {
            id: 1,
            title: "Expressões numéricas",
            subject: "Matemática",
            nextReview: "", 
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
                {
                    question: "Como resolver 10 - 2 × 3 + 5?",
                    answer: "Primeiro multiplicação (2×3=6), depois subtração e adição: 10-6+5=9",
                    difficulty: null,
                },
                {
                    question: "Qual o resultado de 4² + (10 ÷ 2)?",
                    answer: "16 + 5 = 21",
                    difficulty: null,
                },
                {
                    question: "Resolva: [15 - (2×3)] × 4",
                    answer: "[15-6]×4 = 9×4 = 36",
                    difficulty: null,
                },
                {
                    question: "Por que a ordem das operações é importante?",
                    answer: "Para garantir que todos cheguem ao mesmo resultado em cálculos complexos",
                    difficulty: null,
                },
            ],
        },
        {
            id: 2,
            title: "Cadeia alimentar",
            subject: "Biologia",
            nextReview: "", 
            cards: [
                {
                    question: "O que é um produtor em uma cadeia alimentar?",
                    answer: "Organismos que produzem seu próprio alimento através da fotossíntese",
                    difficulty: null,
                },
                {
                    question: "Qual a diferença entre cadeia alimentar e teia alimentar?",
                    answer: "Cadeia alimentar é linear, enquanto teia alimentar mostra múltiplas interconexões",
                    difficulty: null,
                },
                {
                    question: "O que são decompositores?",
                    answer: "Organismos que quebram matéria orgânica morta",
                    difficulty: null,
                },
                {
                    question: "Dê um exemplo de consumidor primário",
                    answer: "Coelho (que come plantas)",
                    difficulty: null,
                },
                {
                    question: "O que acontece se um elo da cadeia alimentar desaparecer?",
                    answer: "Pode desequilibrar todo o ecossistema, afetando outros organismos",
                    difficulty: null,
                },
                {
                    question: "Qual a importância dos produtores na cadeia alimentar?",
                    answer: "São a base, convertendo energia solar em energia química para outros organismos",
                    difficulty: null,
                },
            ],
        },
        {
            id: 3,
            title: "Neocolonialismo",
            subject: "História",
            nextReview: "", 
            cards: [
                {
                    question: "O que foi o neocolonialismo?",
                    answer: "Expansão imperialista das potências europeias no século XIX",
                    difficulty: null,
                },
                {
                    question: "Qual conferência dividiu a África entre as potências europeias?",
                    answer: "Conferência de Berlim (1884-1885)",
                    difficulty: null,
                },
                {
                    question: "Qual era o principal interesse econômico no neocolonialismo?",
                    answer: "Obtenção de matéria-prima e novos mercados",
                    difficulty: null,
                },
                {
                    question: "Cite duas justificativas usadas para o neocolonialismo",
                    answer: "'Missão civilizadora' e 'fardo do homem branco'",
                    difficulty: null,
                },
                {
                    question: "Qual país europeu dominou grande parte da África?",
                    answer: "Reino Unido",
                    difficulty: null,
                },
                {
                    question: "Como o neocolonialismo afetou as colônias após a independência?",
                    answer: "Deixou heranças de fronteiras artificiais e economias dependentes",
                    difficulty: null,
                },
            ],
        },
        {
            id: 4,
            title: "Funções quadráticas",
            subject: "Matemática",
            nextReview: "", 
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
                {
                    question: "O que o coeficiente 'a' determina na função quadrática?",
                    answer: "Se a parábola é côncava para cima (a>0) ou para baixo (a<0)",
                    difficulty: null,
                },
                {
                    question: "Como calcular as raízes de uma função quadrática?",
                    answer: "Fórmula de Bhaskara: x = [-b ± √(b²-4ac)]/(2a)",
                    difficulty: null,
                },
                {
                    question: "O que é o discriminante (Δ) na fórmula de Bhaskara?",
                    answer: "Δ = b² - 4ac, determina o número de raízes reais",
                    difficulty: null,
                },
                {
                    question: "Qual a aplicação prática das funções quadráticas?",
                    answer: "Modelar trajetórias, maximizar áreas, cálculos de lucro máximo, etc.",
                    difficulty: null,
                },
            ],
        },
        {
            id: 5,
            title: "Tabela periódica",
            subject: "Química",
            nextReview: "", 
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
                {
                    question: "O que são elementos de transição?",
                    answer: "Elementos dos grupos 3-12 que formam compostos coloridos",
                    difficulty: null,
                },
                {
                    question: "Qual família contém os gases nobres?",
                    answer: "Grupo 18 (VIII A)",
                    difficulty: null,
                },
                {
                    question: "Como a eletronegatividade varia na tabela periódica?",
                    answer: "Aumenta da esquerda para direita e de baixo para cima",
                    difficulty: null,
                },
            ],
        },
        {
            id: 6,
            title: "Literatura modernista",
            subject: "Literatura",
            nextReview: "", 
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
                {
                    question: "Nomeie dois autores da primeira fase do modernismo",
                    answer: "Mário de Andrade e Oswald de Andrade",
                    difficulty: null,
                },
                {
                    question: "Qual obra marcou a poesia modernista?",
                    answer: "'Pauliceia Desvairada' de Mário de Andrade",
                    difficulty: null,
                },
                {
                    question: "O que caracterizava a linguagem modernista?",
                    answer: "Ruptura com padrões formais, uso de linguagem coloquial",
                    difficulty: null,
                },
                {
                    question: "Qual a importância da Semana de 22?",
                    answer: "Marco inicial do modernismo brasileiro, rompendo com tradições acadêmicas",
                    difficulty: null,
                },
            ],
        },
    ]
}

export default mockData;
