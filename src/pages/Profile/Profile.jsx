import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import FormField from "../../components/Form/FormField";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Profile.module.css";
import api from "../../constants/api";

const Profile = ({ isSidebarOpen, setIsSidebarOpen, subjects, loadData }) => {
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
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [isDeletingSubject, setIsDeletingSubject] = useState(false);
    const navigate = useNavigate();

    // Carregar dados do usuário
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/users/profile");
            const user = response.data;

            setUserData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
            }));
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            setErrors({ general: "Erro ao carregar dados do perfil" });
        } finally {
            setIsLoading(false);
        }
    };

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

        // Validações para senha apenas se estiver editando e alguma senha foi preenchida
        if (isEditing) {
            const hasAnyPassword =
                userData.currentPassword ||
                userData.newPassword ||
                userData.confirmPassword;

            if (hasAnyPassword) {
                if (!userData.currentPassword) {
                    newErrors.currentPassword =
                        "Senha atual é obrigatória para alterar a senha";
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
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (userData.currentPassword && userData.newPassword) {
                await api.put("/users/password", {
                    currentPassword: userData.currentPassword,
                    newPassword: userData.newPassword,
                });
            }

            const response = await api.put("/users/profile", {
                name: userData.name,
                email: userData.email,
            });

            if (response.data) {
                setSuccessMessage("Perfil atualizado com sucesso!");
                setIsEditing(false);

                setUserData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }));
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            const errorMessage =
                error.response?.data?.error || "Erro ao atualizar perfil";

            if (
                errorMessage.includes("email") ||
                errorMessage.includes("Email")
            ) {
                setErrors({ email: errorMessage });
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

            await api.delete("/users/profile", {
                data: { confirmation: "CONFIRMAR_EXCLUSÃO" },
            });

            localStorage.removeItem("authToken");
            localStorage.removeItem("idUser");
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
        setErrors({});
        setSuccessMessage("");
        loadUserData();

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
                loadData();
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
        localStorage.removeItem("authToken");
        localStorage.removeItem("idUser");
        navigate("/login");
    };

    return (
        <>
            {isLoading && <Loading />}
            {isDeletingSubject && <Loading />}

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
                                value={userData.name}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                error={errors.name}
                                disabled={!isEditing}
                            />

                            <FormField
                                label="Email"
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                error={errors.email}
                                disabled={!isEditing}
                            />
                        </div>

                        {isEditing && (
                            <div className={styles.formSection}>
                                <h2>Alterar Senha</h2>
                                <p className={styles.passwordNote}>
                                    Deixe em branco se não quiser alterar a
                                    senha
                                </p>

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
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar Perfil
                                </Button>
                            ) : (
                                <div className={styles.editActions}>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading
                                            ? "Salvando..."
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

                    {/* Seção de Matérias - Ícone da lixeira direto */}
                    <div className={styles.subjectsSection}>
                        <h2>Matérias cadastradas</h2>

                        {subjects.map((subject) => {
                            return (
                                <div
                                    className={styles.subject}
                                    style={{
                                        backgroundColor: subject.color,
                                    }}
                                >
                                    <strong>{subject.name}</strong>

                                    <button
                                        className={styles.deleteBtn}
                                        style={{
                                            color: subject.color,
                                        }}
                                        onClick={() =>
                                            handleDeleteSubjectClick(subject)
                                        }
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.dangerZone}>
                        <h2>Zona de Perigo</h2>
                        <div className={styles.dangerActions}>
                            <div className={styles.dangerItem}>
                                <div>
                                    <h3>Sair da Conta</h3>
                                    <p>Faça logout da sua conta atual</p>
                                </div>
                                <Button onClick={handleLogout}>Sair</Button>
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
                                <Button
                                    onClick={() => setDeleteModal(true)}
                                    className={styles.deleteButton}
                                >
                                    Excluir Conta
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deleteModal && (
                <ConfirmModal
                    title="Excluir Conta"
                    description="Tem certeza que deseja excluir sua conta? Todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita."
                    btnText="Excluir Conta"
                    onClick={handleDeleteAccount}
                    onCancel={() => setDeleteModal(false)}
                />
            )}

            {deleteSubjectModal && subjectToDelete && (
                <ConfirmModal
                    title={"Deletar matéria"}
                    description={`Todos os decks associados a matéria "${subjectToDelete.name}" também serão excluídos.`}
                    btnText={"Confirmar"}
                    onClick={() => deleteSubject(subjectToDelete.idSubject)}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default Profile;
