import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Profile.module.css";

const Profile = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [logoutModal, setLogoutModal] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("idUser");
        navigate("/login");
    };

    return (
        <>
            {logoutModal && (
                <ConfirmModal
                    title={"Finalizar sessão"}
                    description={"Tem certeza que deseja fazer o logout?"}
                    btnText={"Confirmar"}
                    onClick={logout}
                    onCancel={() => setLogoutModal(false)}
                />
            )}

            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    <button secondary onClick={() => setLogoutModal(true)}>
                        Sair
                    </button>
                </div>
            </div>
        </>
    );
};

export default Profile;
