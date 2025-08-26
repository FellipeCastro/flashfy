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
                            iniciadas por Hermann Ebbinghaus (1885) demonstraram
                            que a memória humana tende a decair rapidamente logo
                            após o aprendizado. Ao revisar antes que o
                            esquecimento seja total, o conhecimento é reforçado
                            e consolidado.
                        </li>
                        <li>
                            <strong>Efeito do Espaçamento</strong> – Estudos
                            posteriores (Cepeda et al., 2006) mostraram que
                            distribuir as revisões ao longo do tempo é muito
                            mais eficaz do que estudar tudo de uma só vez
                            (cramming).
                        </li>
                        <li>
                            <strong>Dificuldade Desejável</strong> – De acordo
                            com Robert Bjork (1994), revisões que exigem certo
                            esforço cognitivo aumentam a fixação do conteúdo a
                            longo prazo. Isso significa que dificuldades não são
                            um obstáculo, mas parte essencial do processo de
                            aprendizagem.
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
                        espaçada mundialmente reconhecidos, como o SM2
                        (SuperMemo) e o utilizado pelo Anki, que ao longo de
                        décadas provaram sua eficácia em milhões de estudantes.
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

                    <h2>Referências</h2>
                    <ul>
                        <li>
                            <strong>Ebbinghaus, H. (1885).</strong>{" "}
                            <em>
                                Memory: A Contribution to Experimental
                                Psychology
                            </em>
                            .
                        </li>
                        <li>
                            <strong>
                                Cepeda, N. J., Pashler, H., Vul, E., Wixted, J.
                                T., & Rohrer, D. (2006).
                            </strong>{" "}
                            <em>
                                Distributed practice in verbal recall tasks: A
                                review and quantitative synthesis
                            </em>
                            . Psychological Bulletin.
                        </li>
                        <li>
                            <strong>Bjork, R. A. (1994).</strong>{" "}
                            <em>
                                Memory and metamemory considerations in the
                                training of human beings
                            </em>
                            .
                        </li>
                        <li>
                            <strong>Wozniak, P. A. (1990).</strong>{" "}
                            <em>Optimization of Learning</em>. University of
                            Poznań.
                        </li>
                        <li>
                            Anki Manual. Disponível em:{" "}
                            <a
                                href="https://docs.ankiweb.net"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://docs.ankiweb.net
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Methodology;
