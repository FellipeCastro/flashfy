import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddSubjectForm.module.css";

const AddSubjectForm = ({ setIsAddDeckFormOpen, setIsAddSubjectFormOpen }) => {
    const [subject, setSubject] = useState("");
    const [color, setColor] = useState("#ffffff");

    const onSubmit = (e) => {
        e.preventDefault();

        // Converter a cor para RGBA com opacidade 0.4
        const colorWithOpacity = hexToRgba(color, 0.4);

        console.log({
            subject,
            color: colorWithOpacity,
        });

        closeModal();
    };

    // Função para converter HEX para RGBA
    const hexToRgba = (hex, opacity) => {
        // Remove o caractere '#' se presente
        hex = hex.replace("#", "");

        // Converte para valores R, G, B
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Retorna no formato rgba
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const closeModal = () => {
        setIsAddSubjectFormOpen(false);
        setIsAddDeckFormOpen(true);
    };

    return (
        <>
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.formContainer}>
                <div className={styles.flexContainer}>
                    <h2>Criar nova Matéria</h2>

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
                        <label htmlFor="subject">Matéria</label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            placeholder="Digite a matéria aqui"
                            onChange={(e) => setSubject(e.target.value)}
                            value={subject}
                        />
                    </div>

                    <div className={`${styles.inputContainer}`}>
                        <label htmlFor="color">Cor</label>
                        <div className={styles.colorPickerContainer}>
                            <input
                                type="color"
                                name="color"
                                id="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <span className={styles.colorPreview}>
                                {hexToRgba(color, 0.4)}
                            </span>
                        </div>
                    </div>

                    <Button>Criar Matéria</Button>
                </form>
            </div>
        </>
    );
};

export default AddSubjectForm;
