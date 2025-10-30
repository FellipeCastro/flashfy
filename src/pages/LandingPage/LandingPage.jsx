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
} from "react-icons/fa";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.png";

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAnswer, setShoeAnswer] = useState(false);

    const features = [
        {
            icon: <FaBrain />,
            title: "Revisão no Momento Certo",
            description:
                "Revisões inteligentes no momento exato antes de você esquecer, ajudando a memorizar até 4x mais com menos tempo de estudo",
        },
        {
            icon: <FaRobot />,
            title: "Criação com Inteligência Artificial",
            description:
                "Crie flashcards automaticamente em segundos. Digite um assunto e receba perguntas e respostas prontas sobre qualquer tema",
        },
        {
            icon: <FaUsers />,
            title: "Acompanhamento de Progresso",
            description:
                "Veja seu progresso com dados claros: +47% de desempenho em provas e 3x mais retenção com nosso painel inteligente",
        },
        {
            icon: <FaChartLine />,
            title: "Tecnologia Avançada",
            description:
                "Plataforma segura e confiável, usando as mesmas tecnologias de grandes empresas, garantindo velocidade e proteção dos seus dados",
        },
    ];

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
                            href="#features"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("features");
                            }}
                        >
                            Recursos
                        </a>
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
                    <h1>Domine qualquer assunto com flashcards inteligentes</h1>
                    <p>
                        O FlashFy utiliza algoritmos de repetição espaçada e IA
                        para transformar sua forma de estudar e maximizar sua
                        retenção de conhecimento.
                    </p>
                    <div className={styles.heroButtons}>
                        <Button onClick={handleRegisterClick}>
                            Começar Agora
                        </Button>
                        <Button secondary onClick={handleLoginClick}>
                            Fazer Login
                        </Button>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.flashcardDemo}>
                        <div className={`${styles.flashcard} ${showAnswer ? styles.showAnswer : null}`} onClick={() => setShoeAnswer(!showAnswer)}>
                            <div className={styles.flashcardFront}>
                                <h3>
                                    O que é a teoria da relatividade de
                                    Einstein?
                                </h3>
                            </div>
                            <div className={styles.flashcardBack}>
                                <p>
                                    É uma teoria que descreve a relação entre
                                    espaço e tempo, onde a gravidade é uma
                                    curvatura no espaço-tempo causada pela massa
                                    e energia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className={styles.features}>
                <div className={styles.container}>
                    <h2>Recursos Poderosos</h2>
                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>Como o FlashFy Funciona</h2>
                    <div className={styles.steps}>
                        {steps.map((step, index) => (
                            <div key={index} className={styles.step}>
                                <div className={styles.stepNumber}>
                                    {step.step}
                                </div>
                                <div className={styles.stepIcon}>
                                    {step.icon}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
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
                            <div key={index} className={styles.testimonialCard}>
                                <div className={styles.testimonialContent}>
                                    <p>"{testimonial.text}"</p>
                                </div>
                                <div className={styles.testimonialAuthor}>
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
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
                                    href="#features"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("features");
                                    }}
                                >
                                    Recursos
                                </a>
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
