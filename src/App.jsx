import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Button from "./components/Button/Button";
import Deck from "./components/Deck/Deck";
import styles from "./App.module.css";
import AddCardModal from "./components/AddCardModal/AddCardModal";

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const decks = {
        linguagens: "rgba(179, 179, 179, 0.4)", // normal (hsla(0, 0%, 70%, 0.4))
        redacao: "rgba(220, 80, 50, 0.4)", // fire (hsla(20, 85%, 55%, 0.4))
        matematica: "rgba(51, 144, 191, 0.4)", // water (hsla(200, 75%, 50%, 0.4))
        fisica: "rgba(255, 239, 71, 0.4)", // electric (hsla(50, 95%, 60%, 0.4))
        biologia: "rgba(71, 168, 71, 0.4)", // grass (hsla(120, 60%, 45%, 0.4))
        quimica: "rgba(211, 255, 255, 0.4)", // ice (hsla(190, 100%, 85%, 0.4))
        historia: "rgba(191, 50, 50, 0.4)", // fighting (hsla(0, 75%, 45%, 0.4))
        filosofia: "rgba(168, 71, 168, 0.4)", // poison (hsla(280, 60%, 55%, 0.4))
        geografia: "rgba(140, 117, 89, 0.4)", // ground (hsla(30, 40%, 45%, 0.4))
        sociologia: "rgba(163, 194, 255, 0.4)", // flying (hsla(220, 80%, 80%, 0.4))
        psicologia: "rgba(229, 71, 229, 0.4)", // psychic (hsla(300, 70%, 60%, 0.4))
        ecologia: "rgba(102, 140, 71, 0.4)", // bug (hsla(90, 55%, 40%, 0.4))
        geologia: "rgba(102, 89, 76, 0.4)", // rock (hsla(35, 30%, 35%, 0.4))
        literatura: "rgba(102, 71, 140, 0.4)", // ghost (hsla(260, 55%, 40%, 0.4))
        artes: "rgba(140, 71, 191, 0.4)", // dragon (hsla(270, 65%, 50%, 0.4))
        direito: "rgba(51, 51, 64, 0.4)", // dark (hsla(240, 20%, 20%, 0.4))
        engenharias: "rgba(179, 191, 204, 0.4)", // steel (hsla(210, 20%, 70%, 0.4))
        musica: "rgba(255, 194, 230, 0.4)", // fairy (hsla(330, 80%, 85%, 0.4))
        tecnologia: "rgba(128, 128, 128, 0.4)", // unknown (hsla(0, 0%, 50%, 0.4))
        astronomia: "rgba(51, 71, 255, 0.4)", // stellar (hsla(240, 80%, 50%, 0.4))
    };

    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <div className={styles.titleContainer}>
                        <h1>Meus decks</h1>
                        <div className={styles.btnsContainer}>
                            <Button secondary>+ Novo deck</Button>
                            <Button>+ Novo card</Button>
                        </div>
                    </div>
                    <div className={styles.filterContainer}>
                        <button
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(20, 85%, 55%, 0.4)",
                            }}
                        >
                            História
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(120, 60%, 45%, 0.4)",
                            }}
                        >
                            Ciência
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(20, 85%, 55%, 0.4)",
                            }}
                        >
                            História
                        </button>

                        <button
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(20, 85%, 55%, 0.4)",
                            }}
                        >
                            História
                        </button>
                        <button
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </button>
                    </div>
                    <ul className={styles.decksConatiner}>
                        <Deck
                            color="hsla(200, 75%, 50%, 0.4)"
                            deck="Matemática"
                            title="Expressões numéricas"
                            cards={2}
                        />
                        <Deck
                            color="hsla(120, 60%, 45%, 0.4)"
                            deck="Ciências"
                            title="Cadeia alimentar"
                            cards={4}
                        />
                        <Deck
                            color="hsla(20, 85%, 55%, 0.4)"
                            deck="História"
                            title="Neocolônialismo"
                            cards={3}
                        />
                        <Deck
                            color="hsla(200, 75%, 50%, 0.4)"
                            deck="Matemática"
                            title="Funções quadrádicas"
                            cards={2}
                        />
                    </ul>
                </div>
            </div>

            {/* <AddCardModal /> */}
        </>
    );
};

export default App;
