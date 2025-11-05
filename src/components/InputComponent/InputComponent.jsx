import { useState } from "react";
import styles from "./InputComponent.module.css";

const FormField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    showPasswordToggle = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType =
        showPasswordToggle && type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div className={styles.formField}>
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>

            <div className={styles.inputContainer}>
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${styles.input} ${
                        error ? styles.errorInput : ""
                    }`}
                />

                {showPasswordToggle && (
                    <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={togglePasswordVisibility}
                        aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                    >
                        {showPassword ? (
                            <svg
                                className={styles.eyeIcon}
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className={styles.eyeIcon}
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                            >
                                <path
                                    fill="currentColor"
                                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3 2 4.27z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && <span className={styles.fieldError}>{error}</span>}
        </div>
    );
};

export default FormField;
