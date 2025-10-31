import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import FormField from "../../components/Form/FormField";
import api from "../../constants/api.js";
import styles from "./Register.module.css";
import Button from "../../components/Button/Button.jsx";

const Register = ({ loadData }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpar erro específico quando o usuário começar a digitar
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Limpar erro geral também
        if (errors.general) {
            setErrors((prev) => ({
                ...prev,
                general: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório";
        }

        if (!formData.email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória";
        } else if (formData.password.length < 3) {
            newErrors.password = "Senha deve ter pelo menos 3 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmação de senha é obrigatória";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({}); // Limpar erros anteriores

        try {
            const response = await api.post("/users/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password, // Use a senha original, não a confirmação
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("idUser", result.idUser);

            // Carregar dados do usuário
            await loadData();

            // Navegar apenas após sucesso
            navigate("/home");
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "Erro no servidor. Tente novamente mais tarde!";

            setErrors({
                general: errorMessage,
            });
            console.error("Erro ao realizar cadastro: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsGoogleLoading(true);
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            const response = await api.post("/users/google-auth", {
                token: credentialResponse.credential,
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("idUser", result.idUser);

            await loadData();
            navigate("/home");
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "Erro ao fazer login com Google. Tente novamente!";

            setErrors({
                general: errorMessage,
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        setErrors({
            general: "Falha no login com Google. Tente novamente.",
        });
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <button onClick={handleBack} className={styles.backBtn}>
                    <FaArrowLeft />
                </button>

                <div className={styles.registerHeader}>
                    <h1>Criar conta</h1>
                    <p>Preencha os dados abaixo para começar a estudar</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    <FormField
                        label="Nome completo"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        error={errors.name}
                    />

                    <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        error={errors.email}
                    />

                    <FormField
                        label="Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Sua senha (mín. 3 caracteres)"
                        error={errors.password}
                        showPasswordToggle={true}
                    />

                    <FormField
                        label="Confirmar senha"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirme sua senha"
                        error={errors.confirmPassword}
                        showPasswordToggle={true}
                    />
                    
                    <Button
                        type="submit"
                        isLoading={isLoading || isGoogleLoading}
                        loadingText="Criando conta..."
                        alternativeClass={styles.registerButton}
                    >
                        Criar conta e começar
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>ou</span>
                </div>

                <div className={styles.googleLoginContainer}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        disabled={isLoading || isGoogleLoading}
                        locale="pt_BR"
                        shape="rectangular"
                        size="large"
                        width="400"
                        text="continue_with"
                    />
                </div>

                <div className={styles.loginLink}>
                    <p>
                        Já tem uma conta?{" "}
                        <Link to="/login">Faça login aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
