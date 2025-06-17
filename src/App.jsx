import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const App = () => {
    return (
        <div className="container open">
            <div className="sidebar">
                <div className="flexContainer">
                    <button className="sidebarBtn">
                        <MdKeyboardDoubleArrowRight />
                    </button>
                    <div className="logo">FlashFy</div>
                </div>
            </div>

            <div className="mainContainer">
                <div className="titleContainer">
                    <h1>Meus decks</h1>
                    <div className="btnsContainer">
                        <button className="btn secondary">+ Novo deck</button>
                        <button className="btn">+ Novo card</button>
                    </div>
                </div>
                <div className="filterContainer">
                    <button
                        style={{ backgroundColor: "hsla(200, 75%, 50%, 0.4)" }}
                    >
                        Matemática
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(20, 85%, 55%, 0.4)" }}
                    >
                        História
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(120, 60%, 45%, 0.4)" }}
                    >
                        Ciência
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(200, 75%, 50%, 0.4)" }}
                    >
                        Matemática
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(20, 85%, 55%, 0.4)" }}
                    >
                        História
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(120, 60%, 45%, 0.4)" }}
                    >
                        Ciência
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(200, 75%, 50%, 0.4)" }}
                    >
                        Matemática
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(20, 85%, 55%, 0.4)" }}
                    >
                        História
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(120, 60%, 45%, 0.4)" }}
                    >
                        Ciência
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(200, 75%, 50%, 0.4)" }}
                    >
                        Matemática
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(20, 85%, 55%, 0.4)" }}
                    >
                        História
                    </button>
                    <button
                        style={{ backgroundColor: "hsla(120, 60%, 45%, 0.4)" }}
                    >
                        Ciência
                    </button>
                </div>
                <ul className="decksConatiner">
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(120, 60%, 45%, 0.4)",
                            }}
                        >
                            Ciências
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </strong>
                        <h3>Expressões numéricas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(20, 85%, 55%, 0.4)",
                            }}
                        >
                            História
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(20, 85%, 55%, 0.4)",
                            }}
                        >
                            História
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(120, 60%, 45%, 0.4)",
                            }}
                        >
                            Ciências
                        </strong>
                        <h3>Funções quadráticas</h3>
                        <p>6 cards</p>
                    </li>
                    <li className="deck">
                        <strong
                            style={{
                                backgroundColor: "hsla(200, 75%, 50%, 0.4)",
                            }}
                        >
                            Matemática
                        </strong>
                        <h3>Expressões numéricas</h3>
                        <p>6 cards</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default App;
