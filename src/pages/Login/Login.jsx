import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Login.module.css";

const Login = ({ setIsAuthenticated }) => {
    const [credentials, setCredentials] = useState({
        email: "demo@estudai.com",
        password: "123456"
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
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
        
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Verificação básica
            if (credentials.email === "demo@estudai.com" && credentials.password === "123456") {
                const fakeToken = 'fake-jwt-token';
                localStorage.setItem('authToken', fakeToken);
                localStorage.setItem('userEmail', credentials.email);
                
                setIsAuthenticated(true);
                navigate("/");
            } else {
                setErrors({ general: "Email ou senha incorretos. Use demo@estudai.com / 123456" });
            }
        } catch (error) {
            setErrors({ general: "Ocorreu um erro inesperado. Tente novamente." });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
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
                    
                    <div className={styles.formField}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            className={errors.email ? styles.errorInput : ""}
                        />
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>
                    
                    <div className={styles.formField}>
                        <label htmlFor="password">Senha</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Sua senha"
                                className={errors.password ? styles.errorInput : ""}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                    </div>
                    
                    <div className={styles.demoCredentials}>
                        <p><strong>Credenciais de demonstração:</strong></p>
                        <p>Email: demo@estudai.com</p>
                        <p>Senha: 123456</p>
                    </div>
                    
                    <div className={styles.rememberForgot}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox" />
                            Lembrar-me
                        </label>
                        <a href="/forgot-password" className={styles.forgotPassword}>
                            Esqueci minha senha
                        </a>
                    </div>
                    
                    <Button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
                
                <div className={styles.divider}>
                    <span>ou</span>
                </div>
                
                <div className={styles.registerLink}>
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se gratuitamente</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;