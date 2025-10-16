import {
    FaBrain,
    FaRegClock,
    FaChartLine,
    FaQuestionCircle,
    FaListOl,
} from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Methodology.module.css";

const Methodology = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const scientificPillars = [
        {
            icon: <FaChartLine />,
            title: "Curva do Esquecimento",
            description:
                "Baseado nos estudos de Hermann Ebbinghaus, nosso sistema combate a tendência natural de esquecer informações. As revisões são agendadas nos momentos exatos em que sua memória começa a enfraquecer, reforçando o conhecimento de forma duradoura.",
            link: "https://en.wikipedia.org/wiki/Hermann_Ebbinghaus",
        },
        {
            icon: <FaRegClock />,
            title: "Efeito do Espaçamento",
            description:
                "Distribuir as revisões ao longo do tempo é muito mais eficaz do que estudar tudo de uma vez. O FlashFy automatiza esse processo, garantindo que você revise o conteúdo em intervalos otimizados para a máxima retenção.",
            link: "https://pubmed.ncbi.nlm.nih.gov/16893288/",
        },
        {
            icon: <FaBrain />,
            title: "Dificuldade Desejável",
            description:
                "O aprendizado é mais forte quando seu cérebro precisa se esforçar um pouco para lembrar de algo. Nosso algoritmo ajusta os intervalos para criar um desafio na medida certa, fortalecendo suas conexões neurais a cada revisão.",
            link: "https://bjorklab.psych.ucla.edu/research/",
        },
    ];

    return (
        <div className={styles.pageWrapper}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <main className={styles.mainContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        A Ciência Por Trás do Seu Aprendizado
                    </h1>
                    <p className={styles.subtitle}>
                        No FlashFy, não deixamos sua memória ao acaso. Nossa
                        metodologia é construída sobre pilares científicos para
                        otimizar cada minuto do seu estudo.
                    </p>
                </header>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Nossos Pilares Científicos
                    </h2>
                    <div className={styles.pillarsGrid}>
                        {scientificPillars.map((pillar, index) => (
                            <div key={index} className={styles.pillarCard}>
                                <div className={styles.pillarIcon}>
                                    {pillar.icon}
                                </div>
                                <h3 className={styles.pillarTitle}>
                                    {pillar.title}
                                </h3>
                                <p className={styles.pillarDescription}>
                                    {pillar.description}
                                </p>
                                <a
                                    href={pillar.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.pillarLink}
                                >
                                    Saber mais
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Como Funciona na Prática?
                    </h2>
                    <div className={styles.howItWorksCard}>
                        <p>
                            É simples. Ao revisar um flashcard, você informa ao
                            nosso sistema o quão bem você se lembrou da
                            resposta. Com base no seu feedback, nosso algoritmo
                            de Repetição Espaçada (Spaced Repetition System -
                            SRS) calcula o momento ideal para a próxima revisão.
                        </p>
                        <ul className={styles.difficultyList}>
                            <li>
                                <strong>Muito Difícil:</strong> O card retorna
                                em breve para um reforço imediato.
                            </li>
                            <li>
                                <strong>Difícil:</strong> Revisão agendada para
                                o dia seguinte, consolidando a memória recente.
                            </li>
                            <li>
                                <strong>Fácil:</strong> O intervalo aumenta,
                                mostrando que você está começando a dominar o
                                assunto.
                            </li>
                            <li>
                                <strong>Muito Fácil:</strong> O card só
                                aparecerá novamente bem mais tarde, liberando
                                seu tempo para focar no que realmente importa.
                            </li>
                        </ul>
                        <p className={styles.finalParagraph}>
                            Este ciclo inteligente, inspirado em sistemas
                            robustos como o do Anki e SuperMemo, garante que seu
                            tempo de estudo seja sempre investido da forma mais
                            eficiente possível, transformando o esforço em
                            conhecimento sólido.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Methodology;
