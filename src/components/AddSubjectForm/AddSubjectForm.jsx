import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./AddSubjectForm.module.css";
import InputComponent from "../InputComponent/InputComponent";

const AddSubjectForm = ({ setIsAddSubjectFormOpen, createSubject }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(false);
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
        if (!color) {
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

    const onSubmit = async (e) => {
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

        setIsLoading(true);

        try {
            // Converter a cor para RGBA com opacidade 0.4
            const colorWithOpacity = hexToRgba(color, 0.4);

            await createSubject(name, colorWithOpacity);
            setIsAddSubjectFormOpen(false);
        } catch (error) {
            console.error("Erro ao criar matéria:", error);
            setErrorMessage({
                main: "Ocorreu um erro ao criar a matéria. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsAddSubjectFormOpen(false);
    };

    return (
        <ModalComponent closeModal={closeModal}>
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
                <InputComponent
                    label="Matéria"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Digite o nome da matéria aqui"
                    error={errorMessage.name}
                    disabled={isLoading}
                />

                <div className={styles.inputColorContainer}>
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

                <Button
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Criando Matéria..."
                >
                    Criar Matéria
                </Button>
            </form>
        </ModalComponent>
    );
};

export default AddSubjectForm;
