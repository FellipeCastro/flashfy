import { useState } from "react";
import styles from "./SelectComponent.module.css";

const SelectComponent = ({
    label = null,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Selecione uma opção",
    error = null,
    disabled = false,
    required = false,
    showActionButton = false,
    onActionClick,
    actionButtonText = "Adicionar",
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    // Verifica se deve mostrar o botão de ação baseado no name ou prop explícita
    const shouldShowActionButton = showActionButton || name === "subject";

    return (
        <div className={styles.formField}>
            {label && (
                <div className={styles.addSubjectContainer}>
                    <label htmlFor={name} className={styles.label}>
                        {label}
                    </label>

                    {shouldShowActionButton && onActionClick && (
                        <button
                            type="button"
                            className={styles.addSubject}
                            onClick={onActionClick}
                            disabled={disabled}
                        >
                            {actionButtonText}
                        </button>
                    )}
                </div>
            )}

            <div className={styles.selectContainer}>
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    className={`${styles.select} ${
                        error ? styles.errorSelect : ""
                    } ${isFocused ? styles.focused : ""}`}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className={styles.dropdownIcon}>
                    <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {error && <span className={styles.fieldError}>{error}</span>}
        </div>
    );
};

export default SelectComponent;
