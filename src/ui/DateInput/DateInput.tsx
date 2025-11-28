import React, { useState } from "react";
import styles from "./DateInput.module.scss";

interface DateInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function DateInput({ label, value, onChange, error }: DateInputProps) {
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(value);

    return (
        <div className={styles.wrapper}>
            <input
                type="date"
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`${styles.input} ${hasValue ? styles.hasValue : ""} ${error ? styles.error : ""}`}
            />
            {!value && !focused && <span className={styles.placeholder}></span>}
            <label
                className={`${styles.label} ${
                    focused || value ? styles.labelActive : ""
                } ${error ? styles.labelError : ""}`}
            >
                {label}
            </label>
        </div>
    );
}
