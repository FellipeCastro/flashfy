import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import Button from "../Button/Button";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";
import SelectComponent from "../SelectComponent/SelectComponent";
import styles from "./AddDeckWithAIForm.module.css";

const AddDeckWithAIForm = ({
    setIsAddDeckWithAIFormOpen,
    setIsAddSubjectFormOpen,
    subjects,
    generateDeckWithAI,
    loadData,
}) => {
    const [idSubject, setIdSubject] = useState("");
    const [theme, setTheme] = useState("");
    const [quantity, setQuantity] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        idSubject: "",
        theme: "",
        main: "",
    });

    // Converter subjects para o formato correto
    const subjectOptions = subjects.map((subject) => ({
        value: subject.idSubject,
        label: subject.name,
    }));

    // Opções para quantidade de cards
    const quantityOptions = [
        { value: 5, label: "5 Cards" },
        { value: 10, label: "10 Cards" },
        { value: 15, label: "15 Cards" },
    ];

    const validateForm = () => {
        const newErrors = {
            idSubject: "",
            theme: "",
            main: "",
        };

        let isValid = true;

        if (!idSubject.trim()) {
            newErrors.idSubject = "Matéria é obrigatória";
            isValid = false;
        }

        if (!theme.trim()) {
            newErrors.theme = "O tema é obrigatório";
            isValid = false;
        } else if (theme.trim().length < 3) {
            newErrors.theme = "O tema deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    const handleInputChange = (field, value) => {
        if (field === "idSubject") {
            setIdSubject(value);
        } else if (field === "theme") {
            setTheme(value);
        } else if (field === "quantity") {
            setQuantity(Number(value)); // Converter para número
        }

        if (errorMessage[field]) {
            setErrorMessage((prev) => ({
                ...prev,
                [field]: "",
                main: "",
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await generateDeckWithAI(idSubject, theme, quantity);
            await loadData();
            setIsAddDeckWithAIFormOpen(false);
        } catch (error) {
            console.error("Erro ao gerar deck com IA:", error);
            setErrorMessage({
                main: "Ocorreu um erro ao gerar o deck. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openAddSubjectForm = () => {
        setIsAddDeckWithAIFormOpen(false);
        setIsAddSubjectFormOpen(true);
    };

    const closeModal = () => {
        setIsAddDeckWithAIFormOpen(false);
    };

    return (
        <ModalComponent closeModal={closeModal}>
            <div className={styles.flexContainer}>
                <h2>Gerar Deck com IA</h2>
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
                {/* Input para o tema usando InputComponent */}
                <InputComponent
                    label="Título"
                    type="text"
                    name="theme"
                    value={theme}
                    onChange={(e) => handleInputChange("theme", e.target.value)}
                    placeholder="Ex: Revolução Francesa, Fotossíntese..."
                    error={errorMessage.theme}
                    disabled={isLoading}
                    required
                />

                {/* Select para matéria usando SelectComponent */}
                <SelectComponent
                    label="Matéria"
                    name="subject"
                    value={idSubject}
                    onChange={(value) => handleInputChange("idSubject", value)}
                    options={subjectOptions}
                    placeholder="Selecione uma matéria"
                    error={errorMessage.idSubject}
                    disabled={isLoading}
                    required
                    onActionClick={openAddSubjectForm}
                    actionButtonText="Adicionar matéria"
                />

                {/* Select para quantidade usando SelectComponent */}
                <SelectComponent
                    label="Quantidade de Cards"
                    name="quantity"
                    value={quantity}
                    onChange={(value) => handleInputChange("quantity", value)}
                    options={quantityOptions}
                    placeholder="Selecione a quantidade"
                    disabled={isLoading}
                />

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
                    loadingText="Gerando Deck..."
                >
                    <BsStars /> Gerar Deck com IA
                </Button>
            </form>
        </ModalComponent>
    );
};

export default AddDeckWithAIForm;
