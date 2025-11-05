import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./AddDeckForm.module.css";
import InputComponent from "../InputComponent/InputComponent";
import SelectComponent from "../SelectComponent/SelectComponent";

const AddDeckForm = ({
    setIsAddDeckFormOpen,
    setIsAddSubjectFormOpen,
    subjects,
    createDeck,
}) => {
    const [idSubject, setIdSubject] = useState("");
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        idSubject: "",
        title: "",
        main: "",
    });

    // Função para validar o formulário
    const validateForm = () => {
        const newErrors = {
            idSubject: "",
            title: "",
            main: "",
        };

        let isValid = true;

        // Validação da matéria
        if (!idSubject.trim()) {
            newErrors.idSubject = "Matéria é obrigatória";
            isValid = false;
        }

        // Validação do título
        if (!title.trim()) {
            newErrors.title = "Título é obrigatório";
            isValid = false;
        } else if (title.trim().length < 3) {
            newErrors.title = "Título deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        setErrorMessage(newErrors);
        return isValid;
    };

    // Manipulador de mudança nos inputs - limpa o erro do campo quando o usuário digita
    const handleInputChange = (field, value) => {
        if (field === "idSubject") {
            setIdSubject(value);
        } else if (field === "title") {
            setTitle(value);
        }

        // Limpa o erro específico do campo quando o usuário começa a digitar
        if (errorMessage[field]) {
            setErrorMessage((prev) => ({
                ...prev,
                [field]: "",
                main: "",
            }));
        }
    };

    const openAddSubjectForm = () => {
        setIsAddDeckFormOpen(false);
        setIsAddSubjectFormOpen(true);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Limpa mensagens de erro anteriores
        setErrorMessage({
            idSubject: "",
            title: "",
            main: "",
        });

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await createDeck(idSubject, title);
            setIsAddDeckFormOpen(false);
        } catch (error) {
            console.error("Erro ao criar deck:", error);
            setErrorMessage({
                main: "Ocorreu um erro ao criar o deck. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsAddDeckFormOpen(false);
    };
    
    const subjectOptions = subjects.map((subject) => ({
        value: subject.idSubject,
        label: subject.name,
    }));

    return (
        <ModalComponent closeModal={closeModal}>
            <div className={styles.flexContainer}>
                <h2>Criar novo Deck</h2>

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
                    label="Título"
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Digite o título do deck aqui"
                    error={errorMessage.title}
                    disabled={isLoading}
                />

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
                    loadingText="Criando Deck..."
                >
                    + Criar Deck
                </Button>
            </form>
        </ModalComponent>
    );
};

export default AddDeckForm;
