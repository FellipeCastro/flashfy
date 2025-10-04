import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import FormField from "../../components/Form/FormField";
import api from "../../constants/api.js";
import styles from "./Register.module.css";

const Register = ({ loadData }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
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

        let isAuthenticated = false;

        try {
            const response = await api.post("/users/register", {
                name: formData.name,
                email: formData.email,
                password: formData.confirmPassword,
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
            console.error("Erro ao realizar cadastro: ", error);
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

                    <button
                        type="submit"
                        className={`${styles.registerButton} ${
                            isLoading ? styles.loading : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Criando conta...
                            </>
                        ) : (
                            "Criar conta e começar"
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>ou</span>
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
