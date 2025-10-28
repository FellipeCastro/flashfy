// src/pages/Profile/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Adicione FaSun e FaMoon se ainda não estiverem importados
import { FaTrashAlt, FaBook, FaLayerGroup, FaFileAlt, FaSun, FaMoon } from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import FormField from "../../components/Form/FormField";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Profile.module.css"; // Estilos serão adicionados depois
import api from "../../constants/api";
import AddSubjectForm from "../../components/AddSubjectForm/AddSubjectForm";

const Profile = ({
    isSidebarOpen,
    setIsSidebarOpen,
    profile,
    subjects,
    refreshProfile,
    refreshSubjects,
    loading,
    progress,
    theme,         // Recebe o tema atual
    toggleTheme,   // Recebe a função para alternar o tema
}) => {
    // ... (resto do estado e funções existentes: userData, errors, handleSubmit, etc.)
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

    // Função para formatar a data do último estudo
    const formatLastStudyDate = (dateString) => {
        if (!dateString) return "Nunca estudou";

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Hoje";
        } else if (diffDays === 1) {
            return "Ontem";
        } else {
            return `Há ${diffDays} dias`;
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

        // Validações para senha apenas se estiver alterando senha
        if (isChangingPassword) {
            if (!userData.currentPassword) {
                newErrors.currentPassword = "Senha atual é obrigatória";
            }

            if (!userData.newPassword) {
                newErrors.newPassword = "Nova senha é obrigatória";
            } else if (userData.newPassword.length < 6) { // Ajustado para 6 caracteres
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
        setErrors({}); // Limpa erros gerais antes de tentar
        setSuccessMessage(""); // Limpa sucesso anterior

        try {
             let dataToSend = {
                name: userData.name,
                email: userData.email,
            };

            // Se estiver alterando senha, adiciona os campos relevantes
            if (isChangingPassword && userData.newPassword && userData.currentPassword) {
                 // **IMPORTANTE:** O backend precisa receber a senha atual para validar
                 // e a nova senha. Verifique como a sua API espera esses dados.
                 // Este é um exemplo comum:
                 dataToSend.currentPassword = userData.currentPassword;
                 dataToSend.newPassword = userData.newPassword;
                 // Não envie confirmPassword, geralmente não é necessário no backend
            } else if (isChangingPassword && (!userData.newPassword || !userData.currentPassword)) {
                 // Se o usuário clicou em 'Alterar Senha' mas não preencheu os campos
                 setErrors({ general: "Preencha a senha atual e a nova senha." });
                 setIsLoading(false);
                 return;
            }


            // Faz a requisição PUT para atualizar o perfil
             const response = await api.put("/users/profile", dataToSend);


            if (response) { // Verifica se houve resposta (sucesso implícito)
                 setSuccessMessage(isChangingPassword ? "Senha alterada com sucesso!" : "Perfil atualizado com sucesso!");
                 await refreshProfile(); // Atualiza os dados do perfil na UI
                 setIsEditing(false); // Sai do modo de edição
                 setIsChangingPassword(false); // Sai do modo de alteração de senha

                 // Limpa os campos de senha sempre após o sucesso
                 setUserData((prev) => ({
                     ...prev,
                     currentPassword: "",
                     newPassword: "",
                     confirmPassword: "",
                 }));
             } else {
                 // Caso inesperado, se a API retornar sucesso sem dados explícitos
                 throw new Error("Resposta inesperada do servidor.");
             }

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            const apiErrorMessage = error.response?.data?.error || "Erro desconhecido ao atualizar perfil. Tente novamente.";

            // Tenta direcionar o erro para o campo correto
            if (apiErrorMessage.toLowerCase().includes("email")) {
                setErrors({ email: apiErrorMessage });
            } else if (apiErrorMessage.toLowerCase().includes("senha") || apiErrorMessage.toLowerCase().includes("password")) {
                 // Tenta ser mais específico sobre qual senha deu erro
                 if (apiErrorMessage.toLowerCase().includes("atual") || apiErrorMessage.toLowerCase().includes("current")) {
                    setErrors({ currentPassword: apiErrorMessage });
                 } else {
                     setErrors({ newPassword: apiErrorMessage }); // Ou erro geral se não for claro
                 }
            } else {
                setErrors({ general: apiErrorMessage }); // Erro geral
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

        // Reseta os dados para os valores originais do perfil
        setUserData({
            name: profile?.name || "",
            email: profile?.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };


    const handleEditProfile = () => {
        setIsEditing(true);
        setIsChangingPassword(false); // Garante que não está no modo de senha
        setErrors({});
        setSuccessMessage("");
         // Garante que os campos de senha estejam limpos ao entrar no modo de edição de perfil
         setUserData((prev) => ({
             ...prev,
             currentPassword: "",
             newPassword: "",
             confirmPassword: "",
         }));
    };

    const handleChangePassword = () => {
         setIsEditing(true); // Permite editar nome/email E senha
        setIsChangingPassword(true); // Indica que os campos de senha são relevantes
        setErrors({});
        setSuccessMessage("");

        // Limpa os campos de senha ao iniciar a alteração, mantendo nome/email
        setUserData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
    };


    const deleteSubject = async (idSubject) => {
        // ... (função deleteSubject existente)
         try {
            setIsDeletingSubject(true);
            const response = await api.delete(`/subjects/${idSubject}`);
            if (response.data) {
                setDeleteSubjectModal(false);
                setSubjectToDelete(null);
                refreshSubjects(); // Chama a função para atualizar a lista de matérias
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
        // ... (função handleLogout existente)
        localStorage.clear();
        navigate("/login");
    };

    const openAddSubjectForm = () => {
        // ... (função openAddSubjectForm existente)
         setIsAddSubjectFormOpen(true);
    };

    const createSubject = async (name, color) => {
        // ... (função createSubject existente)
         try {
            setIsCreatingSubject(true);
            const response = await api.post("/subjects", {
                name,
                color,
            });
            if (response.data) {
                setIsAddSubjectFormOpen(false);
                refreshSubjects(); // Atualiza a lista após criar
            }
        } catch (error) {
            console.log(error);
             setErrors({ general: error.response?.data?.error || "Erro ao criar matéria" });
        } finally {
            setIsCreatingSubject(false);
        }
    };

    return (
        <>
            {/* ... (modais e loading existentes) ... */}
             {isDeletingSubject && <Loading />}
            {isCreatingSubject && <Loading />}
             {isLoading && <Loading />} {/* Adiciona loading geral para submit */}


            <div className={styles.container}>
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={styles.mainContainer}>
                    {/* ... (Header, Mensagens de Erro/Sucesso) ... */}
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
                        {/* ... (Seção Informações Pessoais) ... */}
                         <div className={styles.formSection}>
                            <h2>Informações Pessoais</h2>

                            <FormField
                                label="Nome completo"
                                type="text"
                                name="name"
                                value={
                                    loading && !profile.name // Mostra carregando apenas se ainda não houver dados
                                        ? "Carregando dados..."
                                        : userData.name
                                }
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                error={errors.name}
                                disabled={!isEditing || loading} // Desabilita se estiver carregando
                            />

                            <FormField
                                label="Email"
                                type="email"
                                name="email"
                                value={
                                     loading && !profile.email
                                        ? "Carregando dados..."
                                        : userData.email
                                }
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                error={errors.email}
                                disabled={!isEditing || loading} // Desabilita se estiver carregando
                            />
                        </div>


                        {/* Seção Alterar Senha (condicional) */}
                        {isChangingPassword && (
                            <div className={styles.formSection}>
                                <h2>Alterar Senha</h2>
                                {/* Campos de senha aqui... */}
                                 <FormField
                                    label="Senha atual"
                                    type="password"
                                    name="currentPassword"
                                    value={userData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Sua senha atual"
                                    error={errors.currentPassword}
                                    showPasswordToggle={true}
                                     disabled={loading} // Desabilita se estiver carregando
                                />

                                <FormField
                                    label="Nova senha (mín. 6 caracteres)"
                                    type="password"
                                    name="newPassword"
                                    value={userData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Sua nova senha"
                                    error={errors.newPassword}
                                    showPasswordToggle={true}
                                     disabled={loading} // Desabilita se estiver carregando
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
                                     disabled={loading} // Desabilita se estiver carregando
                                />
                            </div>
                        )}

                        {/* Botões de Ação */}
                        <div className={styles.actions}>
                             {/* Mostra botões de Editar/Alterar Senha se NÃO estiver editando */}
                             {!isEditing ? (
                                <div className={styles.editActions}>
                                    <Button
                                        type="button"
                                        onClick={handleEditProfile}
                                        disabled={loading} // Desabilita se estiver carregando
                                    >
                                        {loading && !profile.name
                                            ? "Carregando..."
                                            : "Editar Perfil"}
                                    </Button>
                                    <Button
                                        type="button"
                                        secondary
                                        onClick={handleChangePassword}
                                         disabled={loading} // Desabilita se estiver carregando
                                    >
                                        Alterar Senha
                                    </Button>
                                </div>
                            ) : (
                                 /* Mostra botões de Salvar/Cancelar se ESTIVER editando */
                                <div className={styles.editActions}>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading
                                            ? "Salvando..."
                                            : isChangingPassword
                                            ? "Salvar Senha" // Texto ajustado
                                            : "Salvar Alterações"}
                                    </Button>
                                    <Button
                                        type="button"
                                        secondary
                                        onClick={handleCancelEdit}
                                         disabled={isLoading} // Desabilita durante o salvamento
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* ... (Seção Estatísticas) ... */}
                    {progress && (
                        <div className={styles.statsSection}>
                            <h2>Estatísticas de Estudo</h2>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <FaFire
                                            className={`${styles.fireIcon} ${
                                                progress.consecutiveDays > 0
                                                    ? styles.active // Make sure .active style exists
                                                    : styles.inactive // Make sure .inactive style exists
                                            }`}
                                        />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>Dias Consecutivos</h3>
                                        <p className={styles.statValue}>
                                            {progress.consecutiveDays || 0}
                                        </p>
                                        <span className={styles.statLabel}>
                                            dia{(progress.consecutiveDays ?? 0) !== 1 ? "s" : ""} estudando
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
                                             deck{(progress.decksToStudy ?? 0) !== 1 ? "s" : ""} pendente{(progress.decksToStudy ?? 0) !== 1 ? "s" : ""}
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
                                             deck{(progress.studiedDecks ?? 0) !== 1 ? "s" : ""} concluído{(progress.studiedDecks ?? 0) !== 1 ? "s" : ""}
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
                                        {profile?.subjects || subjects?.length || 0} {/* Usa profile ou fallback */}
                                    </span>
                                </div>
                                <div className={styles.overviewItem}>
                                    <span className={styles.overviewLabel}>
                                        Total de Decks:
                                    </span>
                                     <span className={styles.overviewValue}>
                                         {profile?.decks || 0} {/* Assume que profile tem decks */}
                                     </span>
                                </div>
                                <div className={styles.overviewItem}>
                                    <span className={styles.overviewLabel}>
                                        Total de Cards:
                                    </span>
                                     <span className={styles.overviewValue}>
                                         {profile?.cards || 0} {/* Assume que profile tem cards */}
                                     </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ... (Seção Matérias Cadastradas) ... */}
                     <div className={styles.subjectsSection}>
                        <div className={styles.flexContainer}>
                            <h2>Matérias cadastradas</h2>
                            <button
                                type="button"
                                className={styles.addSubject}
                                onClick={openAddSubjectForm}
                                 disabled={loading} // Desabilita se estiver carregando
                            >
                                Adicionar matéria
                            </button>
                        </div>

                         {loading && subjects.length === 0 ? ( // Mostra loading apenas se não houver matérias carregadas
                            <p id="loader">Carregando matérias...</p>
                        ) : subjects.length === 0 ? (
                             <p className={styles.noSubjectsMessage}>Nenhuma matéria cadastrada ainda.</p> // Mensagem se não houver matérias
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
                                                        subject.color || 'transparent', // Fallback
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
                                                disabled={isDeletingSubject} // Desabilita durante a exclusão
                                                title={`Excluir matéria ${subject.name}`}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* --- NOVA SEÇÃO: Preferências de Aparência --- */}
                    <div className={styles.appearanceSection}>
                        <h2>Preferências de Aparência</h2>
                        <div className={styles.themeToggleItem}>
                            <div>
                                <h3>Tema</h3>
                                <p>
                                    Alternar entre modo claro e escuro.
                                </p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={styles.themeToggleButtonProfile} // Usar um estilo específico
                                aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
                            >
                                {theme === 'light' ? <FaMoon /> : <FaSun />}
                                <span className={styles.themeToggleText}>
                                     {theme === 'light' ? 'Escuro' : 'Claro'}
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* --- FIM DA NOVA SEÇÃO --- */}

                    {/* ... (Zona de Perigo) ... */}
                     <div className={styles.dangerZone}>
                        <h2>Zona de Perigo</h2>
                        <div className={styles.dangerActions}>
                            <div className={styles.dangerItem}>
                                <div>
                                    <h3>Sair da Conta</h3>
                                    <p>Faça logout da sua conta atual</p>
                                </div>
                                <Button onClick={() => setLogoutModal(true)} secondary> {/* Use secondary */}
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
                                {/* Manter botão vermelho para exclusão */}
                                <Button onClick={() => setDeleteModal(true)} className={styles.deleteAccountButton}>
                                    Excluir Conta
                                </Button>
                            </div>
                        </div>
                    </div>

                </div> {/* Fim de mainContainer */}
            </div> {/* Fim de container */}

            {/* ... (Modais de confirmação e AddSubjectForm) ... */}
            {logoutModal && (
                <ConfirmModal
                    title="Fazer Logout"
                    description="Tem certeza que deseja sair da sua conta?"
                    btnText="Confirmar"
                    onClick={handleLogout}
                    onCancel={() => setLogoutModal(false)}
                    success // Marcar como ação não destrutiva (opcional)
                />
            )}

            {deleteModal && (
                <ConfirmModal
                    title="Excluir Conta"
                    description="Todos os seus dados (decks, cards, progresso) serão PERMANENTEMENTE removidos. Esta ação não pode ser desfeita. Tem certeza disso?"
                    btnText="Excluir Minha Conta" // Texto mais enfático
                    onClick={handleDeleteAccount}
                    onCancel={() => setDeleteModal(false)}
                    // Não marcar como success, é destrutivo
                />
            )}

             {deleteSubjectModal && subjectToDelete && (
                <ConfirmModal
                    title={`Excluir Matéria "${subjectToDelete.name}"`}
                    description={`Todos os decks e cards associados a esta matéria também serão excluídos permanentemente. Tem certeza?`}
                    btnText={"Confirmar Exclusão"}
                    onClick={() => deleteSubject(subjectToDelete.idSubject)}
                    onCancel={handleCancelDelete}
                     // Não marcar como success
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