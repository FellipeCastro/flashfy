import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Importante: para decodificar o token
import FormField from "../../components/Form/FormField";
import api from "../../constants/api.js";
import styles from "./Login.module.css";

const Login = ({ loadData }) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
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

        if (!credentials.email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            newErrors.email = "Email inválido";
        }

        if (!credentials.password) {
            newErrors.password = "Senha é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await api.post("/users/login", {
                email: credentials.email,
                password: credentials.password,
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("idUser", result.idUser);

            await loadData();
            navigate("/home");
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "Erro no servidor. Tente novamente mais tarde!";

            setErrors({
                general: errorMessage,
            });
            console.error("Erro ao realizar login: ", error);
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
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <button onClick={handleBack} className={styles.backBtn}>
                    <FaArrowLeft />
                </button>

                <div className={styles.loginHeader}>
                    <h1>Bem-vindo de volta</h1>
                    <p>Faça login para acessar seus decks</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        error={errors.email}
                        disabled={isLoading || isGoogleLoading}
                    />

                    <FormField
                        label="Senha"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Sua senha"
                        error={errors.password}
                        showPasswordToggle={true}
                        disabled={isLoading || isGoogleLoading}
                    />

                    <div className={styles.rememberForgot}>
                        <label className={styles.rememberMe}>
                            <input
                                type="checkbox"
                                disabled={isLoading || isGoogleLoading}
                            />
                            Lembrar-me
                        </label>
                        <Link
                            to="/forgot-password"
                            className={styles.forgotPassword}
                        >
                            Esqueci minha senha
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.loginButton} ${
                            isLoading || isGoogleLoading ? styles.loading : ""
                        }`}
                        disabled={isLoading || isGoogleLoading}
                    >
                        {isLoading || isGoogleLoading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>
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
                        shape="retangular"
                        size="large"
                        width="400"
                        text="continue_with"
                    />
                </div>

                <div className={styles.registerLink}>
                    <p>
                        Não tem uma conta?{" "}
                        <Link to="/register">Cadastre-se gratuitamente</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
