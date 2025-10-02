import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import styles from "./AddSubjectForm.module.css";

const AddSubjectForm = ({
    setIsAddDeckFormOpen,
    setIsAddSubjectFormOpen,
    createSubject,
}) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [errorMessage, setErrorMessage] = useState({
        name: "",
        color: "",
        main: "",
    });

    // Função para validar o formulário
    const validateForm = () => {
        const newErrors = {
            name: "",
            color: "",
            main: "",
        };

        let isValid = true;

        // Validação do nome da matéria
        if (!name.trim()) {
            newErrors.name = "Nome da matéria é obrigatório";
            isValid = false;
        } else if (name.trim().length < 3) {
            newErrors.name = "Nome deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        // Validação da cor
        if (!color || color === "#ffffff") {
            newErrors.color = "Selecione uma cor";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    // Manipulador de mudança nos inputs - limpa o erro do campo quando o usuário digita/seleciona
    const handleInputChange = (field, value) => {
        if (field === "name") {
            setName(value);
        } else if (field === "color") {
            setColor(value);
        }

        // Limpa o erro específico do campo quando o usuário começa a interagir
        if (errorMessage[field]) {
            setErrorMessage((prev) => ({
                ...prev,
                [field]: "",
                main: "",
            }));
        }
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

    const onSubmit = (e) => {
        e.preventDefault();

        // Limpa mensagens de erro anteriores
        setErrorMessage({
            name: "",
            color: "",
            main: "",
        });

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        // Converter a cor para RGBA com opacidade 0.4
        const colorWithOpacity = hexToRgba(color, 0.4);

        createSubject(name, colorWithOpacity);
    };

    const closeModal = () => {
        setIsAddSubjectFormOpen(false);
        setIsAddDeckFormOpen ? setIsAddDeckFormOpen(true) : null;
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
                        <label htmlFor="name">Matéria</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Digite a matéria aqui"
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            value={name}
                            className={
                                errorMessage.name ? styles.inputError : ""
                            }
                        />
                        {errorMessage.name && (
                            <span className={styles.fieldError}>
                                {errorMessage.name}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="color">Cor</label>
                        <div className={styles.colorPickerContainer}>
                            <input
                                type="color"
                                name="color"
                                id="color"
                                value={color}
                                onChange={(e) =>
                                    handleInputChange("color", e.target.value)
                                }
                                className={
                                    errorMessage.color ? styles.inputError : ""
                                }
                            />
                            <span className={styles.colorPreview}>
                                {hexToRgba(color, 0.4)}
                            </span>
                        </div>
                        {errorMessage.color && (
                            <span className={styles.fieldError}>
                                {errorMessage.color}
                            </span>
                        )}
                    </div>

                    {errorMessage.main && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorText}>
                                <p>{errorMessage.main}</p>
                            </div>
                        </div>
                    )}

                    <Button type="submit">Criar Matéria</Button>
                </form>
            </div>
        </>
    );
};

export default AddSubjectForm;
