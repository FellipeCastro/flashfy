import { useNavigate } from "react-router-dom";
import { FaBrain, FaUsers, FaRobot, FaChartLine, FaBook, FaClock, FaTrophy, FaTimes, FaBars } from "react-icons/fa";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import logo from "../../assets/logo/logo4.png";
import Button from "../../components/Button/Button";

const LandingPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaBrain />,
      title: "Flashcards Inteligentes",
      description: "Sistema de repetição espaçada para maximizar sua retenção de conhecimento"
    },
    {
      icon: <FaRobot />,
      title: "IA Integrada",
      description: "Gere perguntas e respostas automaticamente com nossa inteligência artificial"
    },
    {
      icon: <FaUsers />,
      title: "Comunidade Ativa",
      description: "Compartilhe e descubra decks criados por outros estudantes"
    },
    {
      icon: <FaChartLine />,
      title: "Acompanhe Seu Progresso",
      description: "Métricas detalhadas mostram sua evolução nos estudos"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Crie Seus Decks",
      description: "Organize seu material de estudo em decks por matéria",
      icon: <FaBook />
    },
    {
      step: "2",
      title: "Revise Regularmente",
      description: "Nosso sistema agenda revisões no momento ideal para sua memória",
      icon: <FaClock />
    },
    {
      step: "3",
      title: "Acompanhe Seu Progresso",
      description: "Veja estatísticas detalhadas do seu aprendizado",
      icon: <FaChartLine />
    },
    {
      step: "4",
      title: "Domine o Conteúdo",
      description: "Alcance a maestria nos assuntos que precisa aprender",
      icon: <FaTrophy />
    }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Estudante de Medicina",
      text: "O FlashFy revolucionou minha forma de estudar. Consigo revisar centenas de conceitos em poucos minutos!"
    },
    {
      name: "Carlos Mendes",
      role: "Preparatório para Concursos",
      text: "A IA que gera perguntas me surpreendeu. Perfeito para testar meu conhecimento de forma dinâmica."
    },
    {
      name: "Marina Costa",
      role: "Estudante de Engenharia",
      text: "A comunidade é incrível! Baixei vários decks de cálculo e física que me salvaram nas provas."
    }
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <img src={logo} alt="FlashFy Logo" className={styles.logoImage} />
            FlashFy
          </div>
          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Recursos</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>Como Funciona</a>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Depoimentos</a>
          </nav>
          <div className={`${styles.authButtons} ${isMenuOpen ? styles.active : ''}`}>
            <Button secondary onClick={handleLoginClick}>
              Entrar
            </Button>
            <Button onClick={handleRegisterClick}>
              Cadastrar
            </Button>
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
          <p>O FlashFy utiliza algoritmos de repetição espaçada e IA para transformar sua forma de estudar e maximizar sua retenção de conhecimento.</p>
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
                <h3>O que é a teoria da relatividade de Einstein?</h3>
              </div>
              <div className={styles.flashcardBack}>
                <p>É uma teoria que descreve a relação entre espaço e tempo, onde a gravidade é uma curvatura no espaço-tempo causada pela massa e energia.</p>
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
                <div className={styles.featureIcon}>{feature.icon}</div>
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
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
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

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Pronto para transformar seus estudos?</h2>
          <p>Junte-se a milhares de estudantes que já usam o FlashFy</p>
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
                <img src={logo} alt="FlashFy Logo" className={styles.logoImage} />
                FlashFy
              </div>
              <p>Transformando a maneira como você estuda</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerSection}>
                <h4>Produto</h4>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Recursos</a>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>Como Funciona</a>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Depoimentos</a>
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
            <p>&copy; 2025 FlashFy. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;