import { IoIosWarning } from "react-icons/io";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
    title,
    description,
    btnText,
    onClick,
    onCancel,
    success,
}) => {
    return (
        <>
            <div className={styles.fadeModal} onClick={onCancel}></div>
            <div className={styles.confirmModal}>
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
                            success ? styles.success : null
                        }`}
                        onClick={onClick}
                    >
                        {btnText}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
