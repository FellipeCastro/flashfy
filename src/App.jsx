import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Button from "./components/Button/Button";

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="container">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="mainContainer">
                <div className="titleContainer">
                    <h1>Meus decks</h1>
                    <div className="btnsContainer">
                        <Button secondary>+ Novo deck</Button>
                        <Button>+ Novo card</Button>
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
