import styles from "./AddCardModal.module.css";

const AddCardModal = () => {
    return (
        <>
            <div className={styles.fade}></div>
            <div className={styles.formContainer}>
                <h2>Criar novo flashcard</h2>

                <form method="post" autoComplete="off" className="form">
                    <div className={styles.inputContainer}>
                        <label htmlFor="deck">Deck</label>
                        <select name="deck" id="deck">
                            <option value="">Selecione um deck</option>
                            <option value="math">Matemática</option>
                            <option value="port">Português</option>
                            <option value="hist">História</option>
                            <option value="geo">Geografia</option>
                            <option value="bio">Biologia</option>
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="title">Titulo</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Ex. Funções quadráticas"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="question">Pergunta</label>
                        <textarea
                            name="question"
                            id="question"
                            placeholder="Digite a pergunta aqui"
                        ></textarea>
                    </div>

                    <div className={styles.inputContainer}>
                        <div>
                            <label htmlFor="answer">Resposta</label>
                            <input type="file" name="answer" id="anwer" />
                        </div>
                        <textarea
                            name="answer"
                            id="answer"
                            placeholder="Digite a resposta aqui"
                        ></textarea>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Criar flashcard
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddCardModal;
