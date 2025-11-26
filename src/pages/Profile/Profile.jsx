import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaBook, FaLayerGroup, FaFileAlt, FaMoon, FaSun } from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import InputComponent from "../../components/InputComponent/InputComponent";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";
import CardComponent from "../../components/CardComponent/CardComponent";
import ErrorComponent from "../../components/ErrorComponent/ErrorComponent";
import styles from "./Profile.module.css";
import api from "../../constants/api";

const Profile = ({
    isSidebarOpen,
    setIsSidebarOpen,
    profile,
    subjects,
    refreshProfile,
    refreshSubjects,
    loading,
    progress,
    toggleTheme, // Nova prop
    currentTheme // Nova prop
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
    const [successMessage, setSuccessMessage] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [isDeletingSubject, setIsDeletingSubject] = useState(false);
    const [isAddSubjectFormOpen, setIsAddSubjectFormOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile && profile.name) {
            setUserData((prev) => ({
                ...prev,
                name: profile.name || "",
                email: profile.email || "",
            }));
        }
    }, [profile]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const formatLastStudyDate = (dateString) => {
        if (!dateString) return "Nunca estudou";

        try {
            const date = new Date(dateString);
            const now = new Date();

            if (isNaN(date.getTime())) {
                return "Data inválida";
            }

            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            const studyDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

            const diffTime = today - studyDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return "Hoje";
            } else if (diffDays === 1) {
                return "Ontem";
            } else if (diffDays > 1 && diffDays <= 7) {
                return `Há ${diffDays} dias`;
            } else if (diffDays > 7 && diffDays <= 30) {
                const weeks = Math.floor(diffDays / 7);
                return `Há ${weeks} semana${weeks > 1 ? "s" : ""}`;
            } else {
                return date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            }
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return "Data inválida";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

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
            if (isEditing) {
                const response = await api.put("/users/profile", {
                    name: userData.name,
                    email: userData.email,
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

            setIsEditing(false);
            setIsChangingPassword(false);

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
        setIsLoading(true);

        setTimeout(() => {
            localStorage.clear();
            setIsLoading(false);
            navigate("/login");
        }, 3000);
    };

    const openAddSubjectForm = () => {
        setIsAddSubjectFormOpen(true);
    };

    const createSubject = async (name, color) => {
        try {
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
        }
    };

    return (
        <>
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


                    <ErrorComponent error={errors.general} />

                    <CardComponent alternativeClass={styles.profileForm}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formSection}>
                                <h2>Informações Pessoais</h2>

                                <InputComponent
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
                                    disabled={loading}
                                />

                                <InputComponent
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
                                    disabled={loading}
                                />
                            </div>

                            {isChangingPassword && (
                                <div className={styles.formSection}>
                                    <h2>Alterar Senha</h2>

                                    <InputComponent
                                        label="Senha atual"
                                        type="password"
                                        name="currentPassword"
                                        value={userData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Sua senha atual"
                                        error={errors.currentPassword}
                                        showPasswordToggle={true}
                                    />

                                    <InputComponent
                                        label="Nova senha"
                                        type="password"
                                        name="newPassword"
                                        value={userData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Sua nova senha"
                                        error={errors.newPassword}
                                        showPasswordToggle={true}
                                    />

                                    <InputComponent
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
                                        <Button
                                            type="submit"
                                            disabled={
                                                isLoading || successMessage
                                            }
                                        >
                                            {isLoading
                                                ? "Salvando..."
                                                : isChangingPassword
                                                ? "Alterar Senha"
                                                : successMessage
                                                ? successMessage
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
                    </CardComponent>

                    {progress && (
                        <CardComponent alternativeClass={styles.statsSection}>
                            <h2>Estatísticas de Estudo</h2>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <FaFire />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>Dias Consecutivos</h3>
                                        <p className={styles.statValue}>
                                            {progress.consecutiveDays || 0}
                                        </p>
                                        <span className={styles.statLabel}>
                                            dia
                                            {progress.consecutiveDays === 1
                                                ? null
                                                : "s"}{" "}
                                            estudando
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <FaBook />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>Decks para Estudar</h3>
                                        <p className={styles.statValue}>
                                            {progress.decksToStudy || 0}
                                        </p>
                                        <span className={styles.statLabel}>
                                            deck
                                            {progress.decksToStudy === 1
                                                ? null
                                                : "s"}{" "}
                                            pendente
                                            {progress.decksToStudy === 1
                                                ? null
                                                : "s"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <FaLayerGroup />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>Decks Estudados</h3>
                                        <p className={styles.statValue}>
                                            {progress.studiedDecks || 0}
                                        </p>
                                        <span className={styles.statLabel}>
                                            deck
                                            {progress.studiedDecks === 1
                                                ? null
                                                : "s"}{" "}
                                            concluído
                                            {progress.studiedDecks === 1
                                                ? null
                                                : "s"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <FaFileAlt />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>Último Estudo</h3>
                                        <p
                                            className={`${styles.statValue} ${styles.lastStudy}`}
                                        >
                                            {formatLastStudyDate(
                                                progress.lastStudyDate
                                            )}
                                        </p>
                                        <span className={styles.statLabel}>
                                            última sessão
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.overviewStats}>
                                <div className={styles.overviewItem}>
                                    <span className={styles.overviewLabel}>
                                        Total de Matérias:
                                    </span>
                                    <span className={styles.overviewValue}>
                                        {profile.subjects || 0}
                                    </span>
                                </div>
                                <div className={styles.overviewItem}>
                                    <span className={styles.overviewLabel}>
                                        Total de Decks:
                                    </span>
                                    <span className={styles.overviewValue}>
                                        {profile.decks || 0}
                                    </span>
                                </div>
                                <div className={styles.overviewItem}>
                                    <span className={styles.overviewLabel}>
                                        Total de Cards:
                                    </span>
                                    <span className={styles.overviewValue}>
                                        {profile.cards || 0}
                                    </span>
                                </div>
                            </div>
                        </CardComponent>
                    )}

                    <CardComponent alternativeClass={styles.subjectsSection}>
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
                    </CardComponent>
                        {/* --- SEÇÃO DE TEMA (NOVA) --- */}
                        <CardComponent alternativeClass={styles.themeSection}>
                            <div className={styles.themeContent}>
                                <div className={styles.themeIcon}>
                                    {currentTheme === 'dark' ? <FaMoon /> : <FaSun />}
                                </div>
                                <div className={styles.themeInfo}>
                                    <h3>Aparência</h3>
                                    <p>Alternar para modo {currentTheme === 'dark' ? 'claro' : 'escuro'}</p>
                                </div>
                            </div>
                            <div className={styles.toggleSwitch} onClick={toggleTheme}>
                                <input 
                                    type="checkbox" 
                                    checked={currentTheme === 'dark'} 
                                    readOnly 
                                />
                                <span className={styles.slider}></span>
                            </div>
                        </CardComponent>
                        {/* --------------------------- */}

                    <CardComponent alternativeClass={styles.dangerZone}>
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
                    </CardComponent>
                </div>
            </div>

            {logoutModal && (
                <ConfirmModal
                    title="Fazer Logout"
                    description="Tem certeza que deseja sair da sua conta?"
                    btnText="Confirmar"
                    onClick={handleLogout}
                    onCancel={() => setLogoutModal(false)}
                    isLoading={isLoading}
                    loadingText={"Saindo..."}
                />
            )}

            {deleteModal && (
                <ConfirmModal
                    title="Excluir Conta"
                    description="Todos os seus dados serão permanentemente removidos. Tem certeza disso?"
                    btnText="Excluir Conta"
                    onClick={handleDeleteAccount}
                    onCancel={() => setDeleteModal(false)}
                    isLoading={isLoading}
                    loadingText={"Excluindo conta..."}
                />
            )}

            {deleteSubjectModal && subjectToDelete && (
                <ConfirmModal
                    title={"Deletar matéria"}
                    description={`Todos os decks associados à matéria "${subjectToDelete.name}" também serão excluídos.`}
                    btnText={"Confirmar"}
                    onClick={() => deleteSubject(subjectToDelete.idSubject)}
                    onCancel={handleCancelDelete}
                    isLoading={isDeletingSubject}
                    loadingText={"Deletando matéria..."}
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