import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrashAlt, FaChartBar } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import FormField from "../../components/Form/FormField";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Profile.module.css";
import api from "../../constants/api";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";

const Profile = ({
isSidebarOpen,
setIsSidebarOpen,
profile,
subjects,
decks,
refreshProfile,
refreshSubjects,
loading,
}) => {
const [userData, setUserData] = useState({
name: "",
email: "",
currentPassword: "",
newPassword: "",
confirmPassword: "",
});
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [isChangingPassword, setIsChangingPassword] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [deleteModal, setDeleteModal] = useState(false);
const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
const [logoutModal, setLogoutModal] = useState(false);
const [subjectToDelete, setSubjectToDelete] = useState(null);
const [isDeletingSubject, setIsDeletingSubject] = useState(false);
const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
const [isCreatingSubject, setIsCreatingSubject] = useState(false);
const navigate = useNavigate();

// Carregar dados do usuário quando o profile mudar
useEffect(() => {
    if (profile && profile.name) {
        setUserData((prev) => ({
            ...prev,
            name: profile.name || "",
            email: profile.email || "",
        }));
    }
}, [profile]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
        ...prev,
        [name]: value,
    }));

    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    // Limpar mensagem de sucesso
    if (successMessage) {
        setSuccessMessage("");
    }
};

const validateForm = () => {
    const newErrors = {};

    if (!userData.name.trim()) {
        newErrors.name = "Nome é obrigatório";
    }

    if (!userData.email.trim()) {
        newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
        newErrors.email = "Email inválido";
    }

    // Validações para senha apenas se estiver alterando senha
    if (isChangingPassword) {
        if (!userData.currentPassword) {
            newErrors.currentPassword = "Senha atual é obrigatória";
        }

        if (!userData.newPassword) {
            newErrors.newPassword = "Nova senha é obrigatória";
        } else if (userData.newPassword.length < 6) {
            newErrors.newPassword =
                "Senha deve ter pelo menos 6 caracteres";
        }

        if (!userData.confirmPassword) {
            newErrors.confirmPassword =
                "Confirmação de senha é obrigatória";
        } else if (userData.newPassword !== userData.confirmPassword) {
            newErrors.confirmPassword = "Senhas não coincidem";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
        // Se estiver editando informações pessoais, faz a requisição do perfil
        if (isEditing) {
            const response = await api.put("/users/profile", {
                name: userData.name,
                email: userData.email,
                // Se estiver alterando senha, faz a requisição de senha
                password:
                    isChangingPassword &&
                    userData.currentPassword &&
                    userData.newPassword
                        ? userData.newPassword
                        : null,
            });

            if (response) {
                setSuccessMessage("Perfil atualizado com sucesso!");
                refreshProfile();
            }
        } else if (isChangingPassword) {
            setSuccessMessage("Senha alterada com sucesso!");
        }

        // Reseta os estados
        setIsEditing(false);
        setIsChangingPassword(false);

        // Limpa os campos de senha
        setUserData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        const errorMessage =
            error.response?.data?.error || "Erro ao atualizar perfil";

        if (
            errorMessage.includes("email") ||
            errorMessage.includes("Email")
        ) {
            setErrors({ email: errorMessage });
        } else if (
            errorMessage.includes("senha") ||
            errorMessage.includes("Senha") ||
            errorMessage.includes("password")
        ) {
            setErrors({ currentPassword: errorMessage });
        } else {
            setErrors({ general: errorMessage });
        }
    } finally {
        setIsLoading(false);
    }
};

const handleDeleteAccount = async () => {
    try {
        setIsLoading(true);

        await api.delete("/users/profile");

        localStorage.clear();
        navigate("/login");
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        setErrors({
            general: error.response?.data?.error || "Erro ao excluir conta",
        });
    } finally {
        setIsLoading(false);
        setDeleteModal(false);
    }
};

const handleCancelEdit = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setErrors({});
    setSuccessMessage("");

    setUserData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }));
};

const handleEditProfile = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
    setErrors({});
    setSuccessMessage("");
};

const handleChangePassword = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("");

    // Limpa os campos de senha ao iniciar a alteração
    setUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }));
};

const deleteSubject = async (idSubject) => {
    try {
        setIsDeletingSubject(true);
        const response = await api.delete(`/subjects/${idSubject}`);
        if (response.data) {
            setDeleteSubjectModal(false);
            setSubjectToDelete(null);
            refreshSubjects();
        }
    } catch (error) {
        console.log(error);
        setErrors({ general: "Erro ao excluir matéria" });
    } finally {
        setIsDeletingSubject(false);
    }
};

const handleDeleteSubjectClick = (subject) => {
    setSubjectToDelete(subject);
    setDeleteSubjectModal(true);
};

const handleCancelDelete = () => {
    setDeleteSubjectModal(false);
    setSubjectToDelete(null);
};

const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
};

const openAddSubjectForm = () => {
    setIsAddSubjectFormOpen(true);
};

const createSubject = async (name, color) => {
    try {
        setIsCreatingSubject(true);
        const response = await api.post("/subjects", {
            name,
            color,
        });
        if (response.data) {
            setIsAddSubjectFormOpen(false);
            refreshSubjects();
        }
    } catch (error) {
        console.log(error);
    } finally {
        setIsCreatingSubject(false);
    }
};

const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);

return (
    <>
        {isDeletingSubject && <Loading />}
        {isCreatingSubject && <Loading />}

        <div className={styles.container}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={styles.mainContainer}>
                <div className={styles.header}>
                    <h1>Meu Perfil</h1>
                    <p>Gerencie suas informações pessoais e preferências</p>
                </div>

                {errors.general && (
                    <div className={styles.errorMessage}>
                        {errors.general}
                    </div>
                )}

                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className={styles.profileForm}
                >
                    <div className={styles.formSection}>
                        <h2>Informações Pessoais</h2>

                        <FormField
                            label="Nome completo"
                            type="text"
                            name="name"
                            value={
                                loading
                                    ? "Carregando dados..."
                                    : userData.name
                            }
                            onChange={handleChange}
                            placeholder="Seu nome completo"
                            error={errors.name}
                            disabled={!isEditing || loading}
                        />

                        <FormField
                            label="Email"
                            type="email"
                            name="email"
                            value={
                                loading
                                    ? "Carregando dados..."
                                    : userData.email
                            }
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            error={errors.email}
                            disabled={!isEditing || loading}
                        />
                    </div>

                    {isChangingPassword && (
                        <div className={styles.formSection}>
                            <h2>Alterar Senha</h2>

                            <FormField
                                label="Senha atual"
                                type="password"
                                name="currentPassword"
                                value={userData.currentPassword}
                                onChange={handleChange}
                                placeholder="Sua senha atual"
                                error={errors.currentPassword}
                                showPasswordToggle={true}
                            />

                            <FormField
                                label="Nova senha"
                                type="password"
                                name="newPassword"
                                value={userData.newPassword}
                                onChange={handleChange}
                                placeholder="Sua nova senha"
                                error={errors.newPassword}
                                showPasswordToggle={true}
                            />

                            <FormField
                                label="Confirmar nova senha"
                                type="password"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirme sua nova senha"
                                error={errors.confirmPassword}
                                showPasswordToggle={true}
                            />
                        </div>
                    )}

                    <div className={styles.actions}>
                        {!isEditing && !isChangingPassword ? (
                            <div className={styles.editActions}>
                                <Button
                                    type="button"
                                    onClick={handleEditProfile}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Carregando..."
                                        : "Editar Perfil"}
                                </Button>
                                <Button
                                    type="button"
                                    secondary
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                >
                                    Alterar Senha
                                </Button>
                            </div>
                        ) : (
                            <div className={styles.editActions}>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                        ? "Salvando..."
                                        : isChangingPassword
                                        ? "Alterar Senha"
                                        : "Salvar Alterações"}
                                </Button>
                                <Button
                                    type="button"
                                    secondary
                                    onClick={handleCancelEdit}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
                
                <div className={styles.statsSection}>
                    <div className={styles.flexContainer}>
                        <h2>Resumo das Estatísticas</h2>
                         <Link to="/stats" className={styles.statsLink}>
                            <FaChartBar /> Ver dashboard completo
                        </Link>
                    </div>
                     <div className={styles.overviewStats}>
                            <div className={styles.overviewItem}>
                                <span className={styles.overviewLabel}>
                                    Total de Matérias:
                                </span>
                                <span className={styles.overviewValue}>
                                    {subjects.length || 0}
                                </span>
                            </div>
                            <div className={styles.overviewItem}>
                                <span className={styles.overviewLabel}>
                                    Total de Decks:
                                </span>
                                <span className={styles.overviewValue}>
                                    {decks.length || 0}
                                </span>
                            </div>
                            <div className={styles.overviewItem}>
                                <span className={styles.overviewLabel}>
                                    Total de Cards:
                                </span>
                                <span className={styles.overviewValue}>
                                    {totalCards || 0}
                                </span>
                            </div>
                        </div>
                </div>


                <div className={styles.subjectsSection}>
                    <div className={styles.flexContainer}>
                        <h2>Matérias cadastradas</h2>
                        <button
                            type="button"
                            className={styles.addSubject}
                            onClick={openAddSubjectForm}
                        >
                            Adicionar matéria
                        </button>
                    </div>

                    {loading ? (
                        <p id="loader">Carregando matérias...</p>
                    ) : (
                        <div className={styles.subjectsGrid}>
                            {subjects.map((subject) => {
                                return (
                                    <div
                                        key={subject.idSubject}
                                        className={styles.subject}
                                    >
                                        <div
                                            className={styles.subjectColor}
                                            style={{
                                                backgroundColor:
                                                    subject.color,
                                            }}
                                        ></div>
                                        <strong>{subject.name}</strong>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() =>
                                                handleDeleteSubjectClick(
                                                    subject
                                                )
                                            }
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={styles.dangerZone}>
                    <h2>Zona de Perigo</h2>
                    <div className={styles.dangerActions}>
                        <div className={styles.dangerItem}>
                            <div>
                                <h3>Sair da Conta</h3>
                                <p>Faça logout da sua conta atual</p>
                            </div>
                            <Button onClick={() => setLogoutModal(true)}>
                                Sair
                            </Button>
                        </div>

                        <div className={styles.dangerItem}>
                            <div>
                                <h3>Excluir Conta</h3>
                                <p>
                                    Esta ação não pode ser desfeita. Todos
                                    os seus dados serão permanentemente
                                    removidos.
                                </p>
                            </div>
                            <Button onClick={() => setDeleteModal(true)}>
                                Excluir Conta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {logoutModal && (
            <ConfirmModal
                title="Fazer Logout"
                description="Tem certeza que deseja sair da sua conta?"
                btnText="Confirmar"
                onClick={handleLogout}
                onCancel={() => setLogoutModal(false)}
            />
        )}

        {deleteModal && (
            <ConfirmModal
                title="Excluir Conta"
                description="Todos os seus dados serão permanentemente removidos. Tem certeza disso?"
                btnText="Excluir Conta"
                onClick={handleDeleteAccount}
                onCancel={() => setDeleteModal(false)}
            />
        )}

        {deleteSubjectModal && subjectToDelete && (
            <ConfirmModal
                title={"Deletar matéria"}
                description={`Todos os decks associados à matéria "${subjectToDelete.name}" também serão excluídos.`}
                btnText={"Confirmar"}
                onClick={() => deleteSubject(subjectToDelete.idSubject)}
                onCancel={handleCancelDelete}
            />
        )}

        {isAddSubjectFormOpen && (
            <AddSubjectForm
                setIsAddSubjectFormOpen={setIsAddSubjectFormOpen}
                createSubject={createSubject}
            />
        )}
    </>
);

};

export default Profile;