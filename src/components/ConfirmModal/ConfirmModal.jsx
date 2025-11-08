import { IoIosWarning } from "react-icons/io";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
    title,
    description,
    btnText,
    onClick,
    onCancel,
    isLoading = false,
    loadingText = "Carregando...",
    success = false,
}) => {
    return (
        <ModalComponent closeModal={onCancel}>
            <div className={styles.flexModal}>
                {!success && <IoIosWarning />}
                <div className={styles.modalText}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
            <div className={styles.btnsContainerModal}>
                <button
                    className={styles.cancelBtn}
                    onClick={onCancel}
                    disabled={isLoading}
                    type="button"
                >
                    Cancelar
                </button>
                <button
                    className={`${styles.confirmBtn} ${
                        isLoading ? styles.loading : ""
                    } ${success ? styles.success : ""}`}
                    disabled={isLoading}
                    onClick={onClick}
                    type="button"
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner}></span>
                            {loadingText}
                        </>
                    ) : (
                        btnText
                    )}
                </button>
            </div>
        </ModalComponent>
    );
};

export default ConfirmModal;
