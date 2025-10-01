import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import FormField from "../../components/Form/FormField";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Profile.module.css";
import api from "../../constants/api";

const Profile = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
            // ✅ CORREÇÃO: Separar edição de perfil e alteração de senha
            if (userData.currentPassword && userData.newPassword) {
                // Se tem senha, fazer alteração de senha separada
                await api.put("/users/password", {
                    currentPassword: userData.currentPassword,
                    newPassword: userData.newPassword,
                });
            }

            // Sempre atualizar perfil (nome e email)
            const response = await api.put("/users/profile", {
                name: userData.name,
                email: userData.email,
            });

            if (response.data) {
                setSuccessMessage("Perfil atualizado com sucesso!");
                setIsEditing(false);

                // Limpar campos de senha
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

            // Tratar erro específico de email duplicado
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

            // ✅ CORREÇÃO: Adicionar confirmação no body conforme necessário
            await api.delete("/users/profile", {
                data: { confirmation: "CONFIRMAR_EXCLUSÃO" }, // Ajuste conforme seu backend
            });

            // Limpar localStorage e redirecionar para login
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
        // Recarregar dados originais
        loadUserData();

        // Limpar campos de senha
        setUserData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("idUser");
        navigate("/login");
    };

    return (
        <>
            {isLoading && <Loading />}

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

                    <div className={styles.dangerZone}>
                        <h2>Zona de Perigo</h2>
                        <div className={styles.dangerActions}>
                            <div className={styles.dangerItem}>
                                <div>
                                    <h3>Sair da Conta</h3>
                                    <p>Faça logout da sua conta atual</p>
                                </div>
                                <Button onClick={handleLogout}>
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
                    description="Tem certeza que deseja excluir sua conta? Todos os seus decks, cartões e dados serão permanentemente removidos. Esta ação não pode ser desfeita."
                    btnText="Excluir Conta"
                    onClick={handleDeleteAccount}
                    onCancel={() => setDeleteModal(false)}
                    destructive={true}
                />
            )}
        </>
    );
};

export default Profile;
