import { useState } from "react";
import { IoMdLink, IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddCardForm.module.css";

const AddCardForm = ({ setIsAddCardFormOpen, decks, createCard }) => {
    const [deck, setDeck] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        createCard(deck, question, answer);
    };

    const closeModal = () => {
        setIsAddCardFormOpen(false);
    };

    return (
        <>
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainer}>
                    <h2>Criar novo Card</h2>

                    <button className={styles.closeBtn} onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </div>

                <form
                    method="post"
                    autoComplete="off"
                    onSubmit={onSubmit}
                    className={styles.form}
                >
                    <div className={styles.inputContainer}>
                        <label htmlFor="deck">Deck</label>
                        <select
                            name="deck"
                            id="deck"
                            onChange={(e) => setDeck(e.target.value)}
                            value={deck}
                        >
                            <option value="">Selecione um deck</option>
                            {decks.map((deck) => {
                                return (
                                    <option value={deck.title}>
                                        {deck.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="question">Pergunta</label>

                            <label
                                htmlFor="fileQuestion"
                                className={styles.file}
                            >
                                <IoMdLink />
                                <input
                                    type="file"
                                    name="fileQuestion"
                                    id="fileQuestion"
                                />
                            </label>
                        </div>
                        <textarea
                            name="question"
                            id="question"
                            placeholder="Digite a pergunta aqui"
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                        ></textarea>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.flexContainer}>
                            <label htmlFor="answer">Resposta</label>
                            <label htmlFor="fileAnswer" className={styles.file}>
                                <IoMdLink />
                                <input
                                    type="file"
                                    name="fileAnswer"
                                    id="fileAnswer"
                                />
                            </label>
                        </div>
                        <textarea
                            name="answer"
                            id="answer"
                            placeholder="Digite a resposta aqui"
                            onChange={(e) => setAnswer(e.target.value)}
                            value={answer}
                        ></textarea>
                    </div>

                    <Button>Criar Card</Button>
                </form>
            </div>
        </>
    );
};

export default AddCardForm;
