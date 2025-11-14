import { useState } from "react";
import styles from "./TextareaComponent.module.css";

const TextareaComponent = ({
    label = null,
    name,
    value,
    onChange,
    placeholder,
    error = null,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    showCharCount = false,
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

    const charCount = value ? value.length : 0;

    return (
        <div className={styles.formField}>
            {label && (
                <div className={styles.labelContainer}>
                    <label htmlFor={name} className={styles.label}>
                        {label}
                    </label>
                    {showCharCount && maxLength && (
                        <span className={styles.charCount}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            )}

            <div className={styles.textareaContainer}>
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={`${styles.textarea} ${
                        error ? styles.errorTextarea : ""
                    } ${isFocused ? styles.focused : ""}`}
                />
            </div>

            {error && <span className={styles.fieldError}>{error}</span>}
        </div>
    );
};

export default TextareaComponent;
