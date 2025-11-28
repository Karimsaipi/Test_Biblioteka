import React from "react";
import styles from "./BaseInput.module.scss";

interface BaseInputProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: boolean | string;
    className?: string;
}

export default function BaseInput({
    label,
    value,
    onChange,
    type = "text",
    error = false,
    className,
}: BaseInputProps) {
    return (
        <div className={styles.wrapper}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                className={`${error ? styles.error : ""} ${className ?? ""}`}
            />
            <label>{label}</label>
        </div>
    );
}
