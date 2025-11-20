import React from "react";
import styles from "./BaseButton.module.scss";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "tertiary" | "red";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    style?: any;
};

export default function MyButton({
    children,
    variant = "primary",
    disabled,
    type = "button",
    onClick,
    className,
    style,
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className || ""}`}
            disabled={disabled}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    );
}
