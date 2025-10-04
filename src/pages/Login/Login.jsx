import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
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

        let isAuthenticated = false;

        try {
            const response = await api.post("/users/login", {
                email: credentials.email,
                password: credentials.password,
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("idUser", result.idUser);
            isAuthenticated = true;
            loadData();
        } catch (error) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("idUser");
            setErrors({
                general: error.message,
            });
            console.error("Erro ao realizar login: ", error);
        } finally {
            setIsLoading(false);
            if (isAuthenticated) {
                navigate("/home");
            }
        }
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1); 
        } else {
            navigate("/"); 
        }
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
                    />

                    <div className={styles.rememberForgot}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox" />
                            Lembrar-me
                        </label>
                        <a
                            href="/login"
                            className={styles.forgotPassword}
                        >
                            Esqueci minha senha
                        </a>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.loginButton} ${
                            isLoading ? styles.loading : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
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
