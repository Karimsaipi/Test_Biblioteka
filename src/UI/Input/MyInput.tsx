import React from "react";
import styles from "./MyInput.module.scss";

interface MyInputProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: boolean | string;
    className?: string;
}

export default function MyInput({
    label,
    value,
    onChange,
    type = "text",
    error = false,
    className,
}: MyInputProps) {
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
