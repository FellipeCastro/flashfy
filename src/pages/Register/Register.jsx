// pages/Register/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../../components/Form/FormField";
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
            className={`${styles.registerButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Criando conta...
              </>
            ) : "Criar conta e começar"}
          </button>
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