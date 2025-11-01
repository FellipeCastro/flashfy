import { IoIosWarning } from "react-icons/io";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
    title,
    description,
    btnText,
    onClick,
    onCancel,
    isLoading = null,
    loadingText = null,
    success,
}) => {
    return (
        <ModalComponent closeModal={onCancel}>
                <div className={styles.flexModal}>
                    {success ? null : <IoIosWarning />}
                    <div>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
                <div className={styles.btnsContainerModal}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Cancelar
                    </button>
                    <button
                        className={`${styles.confirmBtn} ${
                            isLoading ? styles.loading : ""
                        } ${success ? styles.success : null}`}
                        disabled={isLoading}
                        onClick={onClick}
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
