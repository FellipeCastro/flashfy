import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../../components/Form/FormField";
import styles from "./Login.module.css";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    email: "demo@estudai.com",
    password: "123456"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      
      if (credentials.email === "demo@estudai.com" && credentials.password === "123456") {
        const fakeToken = 'fake-jwt-token';
        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('userEmail', credentials.email);
        
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setErrors({ general: "Email ou senha incorretos. Use demo@estudai.com / 123456" });
      }
    } catch (error) {
      setErrors({ general: "Ocorreu um erro inesperado. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
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
          
          <button 
            type="submit" 
            className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Entrando...
              </>
            ) : "Entrar"}
          </button>
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