import { useNavigate } from "react-router-dom";
import {
    FaBrain,
    FaUsers,
    FaRobot,
    FaChartLine,
    FaBook,
    FaClock,
    FaTrophy,
    FaTimes,
    FaBars,
    FaChevronDown,
    FaRocket,
    FaPlay,
    FaCheck,
    FaStar,
} from "react-icons/fa";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.png";
import CardComponent from "../../components/CardComponent/CardComponent";

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const steps = [
        {
            step: "1",
            title: "Crie Seus Flashcards",
            description:
                "Crie seus cartões de estudo manualmente ou use nossa IA para gerar conteúdo automaticamente em segundos",
            icon: <FaBook />,
        },
        {
            step: "2",
            title: "Revise no Tempo Certo",
            description:
                "Nosso sistema avisa quando revisar cada conteúdo, no momento exato antes de você começar a esquecer",
            icon: <FaClock />,
        },
        {
            step: "3",
            title: "Acompanhe Seu Progresso",
            description:
                "Painel simples com métricas fáceis de entender: veja sua evolução, retenção e desempenho ao longo do tempo",
            icon: <FaChartLine />,
        },
        {
            step: "4",
            title: "Atinga a Maestria",
            description:
                "Domine conteúdos complexos com eficiência comprovada, memorizando 3x mais do que métodos tradicionais",
            icon: <FaTrophy />,
        },
    ];

    const testimonials = [
        {
            name: "Ana Silva",
            role: "Estudante de Medicina",
            text: "Reduzi pela metade meu tempo de estudo com o FlashFy e melhorei quase 50% minhas notas nas provas. A função de criar flashcards com IA é fantástica!",
        },
        {
            name: "Carlos Mendes",
            role: "Concurseiro Aprovado",
            text: "O sistema de revisões me fez memorizar 3x mais conteúdo. Passei em 2º lugar no concurso graças à eficiência da plataforma.",
        },
        {
            name: "Marina Costa",
            role: "Coordenadora de Treinamento",
            text: "Usamos na empresa e reduzimos 60% do tempo de treinamento. A retenção dos funcionários subiu de 25% para 85% com o FlashFy.",
        },
    ];

    const faqData = [
        {
            question: "Como esse método ajuda a memorizar mais?",
            answer: "Nosso sistema identifica o momento exato antes de você esquecer e agenda revisões estratégicas. Estudos mostram que esta técnica ajuda a memorizar até 4x mais comparado a métodos tradicionais, economizando tempo de estudo.",
        },
        {
            question: "A IA realmente cria bons conteúdos?",
            answer: "Sim! Usamos tecnologia de inteligência artificial avançada que gera perguntas e respostas de qualidade em segundos, adaptando-se ao seu nível de conhecimento. A mesma tecnologia é usada por grandes empresas.",
        },
        {
            question: "É seguro usar para estudos importantes?",
            answer: "Completamente seguro! Usamos tecnologia profissional com proteção de dados, backups automáticos e senhas criptografadas. Sua privacidade e conteúdo estão sempre protegidos.",
        },
        {
            question: "Os resultados são comprovados?",
            answer: "Sim! Nossa metodologia é baseada em pesquisas científicas sobre aprendizagem. Testes com usuários mostraram melhoras de até 47% em provas e 3x mais retenção após alguns meses de uso.",
        },
    ];

    const handleLoginClick = () => {
        navigate("/login");
        setIsMenuOpen(false);
    };

    const handleRegisterClick = () => {
        navigate("/register");
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className={styles.landingPage}>
            <header className={styles.header}>
                <div className={styles.navbar}>
                    <div className={styles.logo}>
                        <img
                            src={logo}
                            alt="FlashFy Logo"
                            className={styles.logoImage}
                        />
                        <div className={styles.logoPlaceholder}>FlashFy</div>
                    </div>
                    <nav
                        className={`${styles.nav} ${
                            isMenuOpen ? styles.active : ""
                        }`}
                    >
                        <a
                            href="#how-it-works"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("how-it-works");
                            }}
                        >
                            Como Funciona
                        </a>
                        <a
                            href="#testimonials"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("testimonials");
                            }}
                        >
                            Depoimentos
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("faq");
                            }}
                        >
                            FAQ
                        </a>
                    </nav>
                    <div
                        className={`${styles.authButtons} ${
                            isMenuOpen ? styles.active : ""
                        }`}
                    >
                        <Button secondary onClick={handleLoginClick}>
                            Entrar
                        </Button>
                        <Button onClick={handleRegisterClick}>Cadastrar</Button>
                    </div>
                    <button
                        className={styles.mobileMenuButton}
                        onClick={toggleMenu}
                        aria-label="Menu mobile"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <FaRocket />
                        Transforme sua forma de estudar
                    </div>
                    <h1>
                        Domine qualquer assunto com{" "}
                        <span className={styles.highlight}>
                            flashcards inteligentes
                        </span>
                    </h1>
                    <p>
                        O FlashFy utiliza algoritmos de repetição espaçada e IA
                        avançada para transformar sua forma de estudar e
                        maximizar em 4x sua retenção de conhecimento.
                    </p>
                    <div className={styles.heroButtons}>
                        <Button onClick={handleRegisterClick}>
                            <FaRocket className={styles.buttonIcon} />
                            Começar Agora
                        </Button>
                        <Button secondary onClick={handleLoginClick}>
                            <FaPlay className={styles.buttonIcon} />
                            Ver Demonstração
                        </Button>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <strong>+3.2k</strong>
                            <span>Estudantes</span>
                        </div>
                        <div className={styles.stat}>
                            <strong>94%</strong>
                            <span>Sucesso</span>
                        </div>
                        <div className={styles.stat}>
                            <strong>4.8</strong>
                            <span>Avaliação</span>
                        </div>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.flashcardDemo}>
                        <div
                            className={`${styles.flashcard} ${
                                showAnswer ? styles.showAnswer : ""
                            }`}
                            onClick={() => setShowAnswer(!showAnswer)}
                        >
                            <div className={styles.flashcardFront}>
                                <div className={styles.cardBadge}>Fácil</div>
                                <h3>
                                    O que é a teoria da relatividade de
                                    Einstein?
                                </h3>
                                <div className={styles.cardHint}>
                                    Clique para ver a resposta
                                </div>
                            </div>
                            <div className={styles.flashcardBack}>
                                <div className={styles.cardBadge}>Resposta</div>
                                <p>
                                    É uma teoria que descreve a relação entre
                                    espaço e tempo, onde a gravidade é uma
                                    curvatura no espaço-tempo causada pela massa
                                    e energia.
                                </p>
                                <div className={styles.cardHint}>
                                    Clique para voltar
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.benefits}>
                <div className={styles.container}>
                    <div className={styles.benefitsContent}>
                        <div className={styles.benefitsText}>
                            <h2>
                                Resultados comprovados que fazem a diferença
                            </h2>
                            <div className={styles.benefitItems}>
                                <div className={styles.benefitItem}>
                                    <div className={styles.benefitIcon}>
                                        <FaChartLine />
                                    </div>
                                    <div>
                                        <h4>+47% de desempenho</h4>
                                        <p>
                                            Melhora significativa em provas e
                                            avaliações
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.benefitItem}>
                                    <div className={styles.benefitIcon}>
                                        <FaBrain />
                                    </div>
                                    <div>
                                        <h4>3x mais retenção</h4>
                                        <p>
                                            Memorização de longo prazo garantida
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.benefitItem}>
                                    <div className={styles.benefitIcon}>
                                        <FaClock />
                                    </div>
                                    <div>
                                        <h4>50% menos tempo</h4>
                                        <p>
                                            Estude de forma mais inteligente e
                                            eficiente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.benefitsVisual}>
                            <div className={styles.comparisonChart}>
                                <div className={styles.chartHeader}>
                                    <h4>Comparação de Eficiência</h4>
                                    <p>Retenção de conhecimento após 30 dias</p>
                                </div>
                                <div className={styles.chartBars}>
                                    <div className={styles.chartBarGroup}>
                                        <div className={styles.barLabel}>
                                            FlashFy
                                        </div>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={`${styles.bar} ${styles.flashfyBar}`}
                                                style={{ width: "85%" }}
                                            >
                                                <span
                                                    className={styles.barValue}
                                                >
                                                    85%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.chartBarGroup}>
                                        <div className={styles.barLabel}>
                                            Método Tradicional
                                        </div>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={`${styles.bar} ${styles.traditionalBar}`}
                                                style={{ width: "28%" }}
                                            >
                                                <span
                                                    className={styles.barValue}
                                                >
                                                    28%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.chartLegend}>
                                    <div className={styles.legendItem}>
                                        <div
                                            className={`${styles.legendColor} ${styles.flashfyColor}`}
                                        ></div>
                                        <span>Com FlashFy</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div
                                            className={`${styles.legendColor} ${styles.traditionalColor}`}
                                        ></div>
                                        <span>Método Tradicional</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>Como o FlashFy Funciona</h2>

                    <div className={styles.timeline}>
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`${styles.timelineContainer} ${
                                    index % 2 === 0 ? styles.left : styles.right
                                }`}
                            >
                                <CardComponent
                                    alternativeClass={styles.content}
                                >
                                    <div className={styles.stepHeader}>
                                        <div className={styles.stepNumber}>
                                            {step.step}
                                        </div>
                                        <h3>{step.title}</h3>
                                    </div>
                                    <p>{step.description}</p>
                                </CardComponent>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="testimonials" className={styles.testimonials}>
                <div className={styles.container}>
                    <h2>O que nossos usuários dizem</h2>
                    <div className={styles.testimonialGrid}>
                        {testimonials.map((testimonial, index) => (
                            <CardComponent
                                key={index}
                                alternativeClass={styles.testimonialCard}
                            >
                                <div className={styles.testimonialHeader}>
                                    <div className={styles.testimonialStars}>
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                    </div>
                                </div>
                                <div className={styles.testimonialContent}>
                                    <p>"{testimonial.text}"</p>
                                </div>
                                <div className={styles.testimonialAuthor}>
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.role}</span>
                                </div>
                            </CardComponent>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className={styles.faq}>
                <div className={styles.container}>
                    <h2>Perguntas Frequentes</h2>
                    <div className={styles.faqContainer}>
                        {faqData.map((item, index) => (
                            <details key={index} className={styles.faqItem}>
                                <summary className={styles.faqQuestion}>
                                    {item.question}
                                    <FaChevronDown className={styles.faqIcon} />
                                </summary>
                                <p className={styles.faqAnswer}>
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <h2>Pronto para transformar seus estudos?</h2>
                    <p>
                        Junte-se a milhares de estudantes que já usam o FlashFy
                    </p>
                    <div className={styles.ctaButtonContainer}>
                        <Button onClick={handleRegisterClick}>
                            <FaCheck className={styles.buttonIcon} />
                            Criar Minha Conta Gratuita
                        </Button>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBrand}>
                            <div className={styles.logo}>
                                <img
                                    src={logo}
                                    alt="FlashFy Logo"
                                    className={styles.logoImage}
                                />
                                <div className={styles.logoPlaceholder}>
                                    FlashFy
                                </div>
                            </div>
                            <p>Transformando a maneira como você estuda</p>
                        </div>
                        <div className={styles.footerLinks}>
                            <div className={styles.footerSection}>
                                <h4>Produto</h4>
                                <a
                                    href="#how-it-works"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("how-it-works");
                                    }}
                                >
                                    Como Funciona
                                </a>
                                <a
                                    href="#testimonials"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("testimonials");
                                    }}
                                >
                                    Depoimentos
                                </a>
                                <a
                                    href="#faq"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("faq");
                                    }}
                                >
                                    FAQ
                                </a>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>Suporte</h4>
                                <a href="#">Central de Ajuda</a>
                                <a href="#">Contato</a>
                                <a href="#">Política de Privacidade</a>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>Comunidade</h4>
                                <a href="#">Discord</a>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>
                        <p>
                            &copy; 2025 FlashFy. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
