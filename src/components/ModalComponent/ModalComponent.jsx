import styles from "./ModalComponent.module.css";

const ModalComponent = ({ children, closeModal }) => {
    return (
        <>
            <div className={styles.fade} onClick={closeModal}></div>
            <div className={styles.modalContainer}>
                { children } 
            </div>
        </>
    );
};

export default ModalComponent;
