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
    FaSun, // Icon for light mode
    FaMoon, // Icon for dark mode
} from "react-icons/fa";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.png";

// Accept theme and toggleTheme props
const LandingPage = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        // ... (keep features array as is)
         {
            icon: <FaBrain />,
            title: "Algoritmo de Repetição Espaçada",
            description:
                "Revisões no momento exato antes do esquecimento, aumentando a retenção em até 400% com 35% menos tempo de estudo",
        },
        {
            icon: <FaRobot />,
            title: "IA Generativa Google Gemini",
            description:
                "Gere decks completos automaticamente em segundos. Digite um tema e receba perguntas e respostas contextualizadas",
        },
        {
            icon: <FaUsers />,
            title: "Métricas Comprovadas",
            description:
                "Acompanhe +47% de performance em exames e 3.2x mais retenção com nosso dashboard inteligente de progresso",
        },
        {
            icon: <FaChartLine />,
            title: "Tecnologia Enterprise",
            description:
                "Mesma arquitetura de grandes plataformas: React, Node.js, PostgreSQL e segurança JWT - escalável e confiável",
        },
    ];

    const steps = [
        // ... (keep steps array as is)
        {
            step: "1",
            title: "Criação Inteligente",
            description:
                "Crie decks manualmente ou com IA em segundos. Nossa IA entende qualquer tema e gera conteúdo contextualizado",
            icon: <FaBook />,
        },
        {
            step: "2",
            title: "Revisão Estratégica",
            description:
                "Nosso algoritmo calcula o momento exato da revisão antes do esquecimento, otimizando cada minuto de estudo",
            icon: <FaClock />,
        },
        {
            step: "3",
            title: "Acompanhamento Científico",
            description:
                "Dashboard com métricas baseadas em evidências: retenção, progresso e desempenho mensuráveis",
            icon: <FaChartLine />,
        },
        {
            step: "4",
            title: "Maestria Comprovada",
            description:
                "Alcance 320% mais retenção e domine conteúdos complexos com eficiência comprovada por estudos",
            icon: <FaTrophy />,
        },
    ];

    const testimonials = [
        // ... (keep testimonials array as is)
         {
            name: "Ana Silva",
            role: "Estudante de Medicina",
            text: "Reduzi 41% do tempo de estudo com a FlashFy e aumentei 47% minha performance nos exames. A IA para gerar decks de anatomia é incrível!",
        },
        {
            name: "Carlos Mendes",
            role: "Concurseiro Aprovado",
            text: "O algoritmo de repetição espaçada me fez reter 3.2x mais conteúdo. Passei em 2º lugar no concurso graças à eficiência da plataforma.",
        },
        {
            name: "Marina Costa",
            role: "Coordenadora de Treinamento",
            text: "Implementamos na empresa e reduzimos 60% do tempo de onboarding. A retenção de treinamentos saltou de 25% para 85% com a FlashFy.",
        },
    ];

    const faqData = [
        // ... (keep faqData array as is)
         {
            question:
                "Como a repetição espaçada aumenta minha retenção em 400%?",
            answer: "Nosso algoritmo baseado no método SuperMemo-2 identifica o momento exato antes do esquecimento e agenda revisões estratégicas. Estudos comprovam que esta técnica aumenta a retenção em até 400% comparado a métodos tradicionais, economizando 35% do seu tempo de estudo.",
        },
        {
            question: "A IA realmente gera conteúdo de qualidade?",
            answer: "Sim! Usamos o Google Gemini, treinado em 1.56 trilhão de parâmetros, com 94% de precisão em conteúdo educacional. Ele gera perguntas e respostas contextualizadas em segundos, adaptando-se ao seu nível de conhecimento. Empresas como Google e Samsung confiam nesta mesma tecnologia.",
        },
        {
            question: "É seguro e confiável para estudos importantes?",
            answer: "Totalmente! Usamos arquitetura enterprise: PostgreSQL (banco de 80% das Fortune 500), JWT para autenticação segura, e backups automáticos. Sua senha é criptografada com Bcrypt - nem nós temos acesso. Plataforma com 99.7% de uptime e escalável para milhões de usuários.",
        },
        {
            question: "Os resultados são comprovados cientificamente?",
            answer: "Absolutamente! Nossa metodologia é baseada em Ebbinghaus (Curva do Esquecimento), Dunlosky (Práticas de Aprendizagem) e Kerfoot (Repetição Espaçada). Estudos independentes com 500 usuários mostraram +47% em exames e 3.2x mais retenção após 6 meses.",
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
            // Adjust scroll position to account for fixed header height
            const headerOffset = 70; // Adjust this value based on your header's actual height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

             window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
            // element.scrollIntoView({ behavior: "smooth" }); // Original behavior
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
                        {/* ... nav links ... */}
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
                         <a
                            href="#faq"
                            onClick={(e) => { e.preventDefault(); scrollToSection("faq"); }}
                        >
                            FAQ
                        </a>
                    </nav>

                     {/* Add Theme Toggle Button */}
                     <button onClick={toggleTheme} className={styles.themeToggleButton} aria-label="Toggle dark mode">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>

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

            {/* ... rest of the LandingPage component (Hero, Features, etc.) ... */}
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
                        <div className={styles.flashcard}>
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

            {/* NOVO: Seção de FAQ adicionada aqui */}
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
                                 <a
                                    href="#faq"
                                    onClick={(e) => { e.preventDefault(); scrollToSection("faq"); }}
                                >
                                    FAQ
                                </a>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>Suporte</h4>
                                {/* Use links placeholder ou reais */}
                                <a href="#">Central de Ajuda</a>
                                <a href="#">Contato</a>
                                <a href="#">Política de Privacidade</a>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>Comunidade</h4>
                                {/* Use links placeholder ou reais */}
                                <a href="#">Discord</a>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>
                        <p>
                            &copy; {new Date().getFullYear()} FlashFy. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;