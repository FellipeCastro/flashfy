import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Methodology.module.css";

const Methodology = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <h1>Nossa Metodologia</h1>
                    <p>
                        No FlashFy, acreditamos que aprender de forma eficiente
                        vai muito além da simples repetição. Nossa metodologia é
                        baseada em princípios científicos de
                        <strong>
                            {" "}
                            memória, aprendizagem e repetição espaçada
                        </strong>
                        , que garantem uma retenção mais duradoura dos conteúdos
                        estudados.
                    </p>

                    <h2>Base científica</h2>
                    <p>Nosso sistema se apoia em três pilares fundamentais:</p>
                    <ol>
                        <li>
                            <strong>Curva do Esquecimento</strong> – Pesquisas
                            iniciadas por{" "}
                            <a
                                href="https://en.wikipedia.org/wiki/Hermann_Ebbinghaus"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hermann Ebbinghaus (1885)
                            </a>{" "}
                            demonstraram que a memória humana tende a decair
                            rapidamente logo após o aprendizado. Ao revisar
                            antes que o esquecimento seja total, o conhecimento
                            é reforçado e consolidado.
                        </li>
                        <li>
                            <strong>Efeito do Espaçamento</strong> – Estudos
                            posteriores{" "}
                            <a
                                href="https://pubmed.ncbi.nlm.nih.gov/16893288/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (Cepeda et al., 2006)
                            </a>{" "}
                            mostraram que distribuir as revisões ao longo do
                            tempo é muito mais eficaz do que estudar tudo de uma
                            só vez (cramming).
                        </li>
                        <li>
                            <strong>Dificuldade Desejável</strong> – De acordo
                            com{" "}
                            <a
                                href="https://bjorklab.psych.ucla.edu/research/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Robert Bjork (1994)
                            </a>
                            , revisões que exigem certo esforço cognitivo
                            aumentam a fixação do conteúdo a longo prazo. Isso
                            significa que dificuldades não são um obstáculo, mas
                            parte essencial do processo de aprendizagem.
                        </li>
                    </ol>

                    <h2>Como funciona na prática</h2>
                    <p>
                        Em nosso sistema, cada usuário pode criar decks com seus
                        próprios flashcards. Durante os estudos, a cada cartão
                        revisado, o usuário classifica a dificuldade do conteúdo
                        em uma escala de 1 (muito fácil) a 4 (muito difícil).
                    </p>
                    <p>
                        Com base nessa avaliação, a data da próxima revisão é
                        ajustada automaticamente:
                    </p>
                    <ul>
                        <li>
                            <strong>Muito difícil (4):</strong> o card será
                            revisado novamente no mesmo dia, para evitar o
                            esquecimento imediato.
                        </li>
                        <li>
                            <strong>Difícil (3):</strong> será revisado no dia
                            seguinte, garantindo reforço rápido da memória.
                        </li>
                        <li>
                            <strong>Fácil (2):</strong> reaparece após 3 dias,
                            equilibrando esforço e retenção.
                        </li>
                        <li>
                            <strong>Muito fácil (1):</strong> será revisado após
                            7 dias, podendo evoluir para intervalos
                            progressivamente maiores (15, 30, 60 dias), conforme
                            o domínio do usuário aumenta.
                        </li>
                    </ul>
                    <p>
                        Esse modelo é inspirado em algoritmos de repetição
                        espaçada mundialmente reconhecidos, como o SM2{" "}
                        <a
                            href="https://www.supermemo.com/en/archives1990-2015/english/ol/sm2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            (SuperMemo)
                        </a>{" "}
                        e o utilizado pelo{" "}
                        <a
                            href="https://docs.ankiweb.net"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Anki
                        </a>
                        , que ao longo de décadas provaram sua eficácia em
                        milhões de estudantes.
                    </p>

                    <h2>Por que escolher essa metodologia?</h2>
                    <p>
                        Nosso objetivo é proporcionar uma experiência de estudo
                        que respeite o ritmo individual, tornando o aprendizado
                        mais eficiente, personalizado e duradouro. Cada
                        dificuldade registrada pelo usuário não é apenas um
                        feedback, mas um dado que alimenta um sistema
                        inteligente de revisões, construído com base em
                        evidências científicas.
                    </p>
                    <p>
                        Assim, garantimos que o tempo investido em cada sessão
                        de estudo tenha o máximo impacto na fixação do
                        conhecimento.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Methodology;
