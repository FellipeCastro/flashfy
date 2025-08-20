import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Register.module.css";

const Register = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
        
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (formData.email === "demo@estudai.com") {
                setErrors({ general: "Este email já está em uso. Use outro email." });
                return;
            }
            
            const fakeToken = 'fake-jwt-token';
            localStorage.setItem('authToken', fakeToken);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userName', formData.name);
            
            setIsAuthenticated(true);
            navigate("/");
        } catch (error) {
            setErrors({ general: "Ocorreu um erro inesperado. Tente novamente." });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
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
                    
                    <div className={styles.formField}>
                        <label htmlFor="name">Nome completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Seu nome completo"
                            className={errors.name ? styles.errorInput : ""}
                        />
                        {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                    </div>
                    
                    <div className={styles.formField}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Sua senha (mín. 3 caracteres)"
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
                    
                    <div className={styles.formField}>
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirme sua senha"
                                className={errors.confirmPassword ? styles.errorInput : ""}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                    </div>
                    
                    <Button 
                        type="submit" 
                        className={styles.registerButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Criando conta..." : "Criar conta e começar"}
                    </Button>
                </form>
                
                <div className={styles.divider}>
                    <span>ou</span>
                </div>
                
                <div className={styles.loginLink}>
                    <p>Já tem uma conta? <Link to="/login">Faça login aqui</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;