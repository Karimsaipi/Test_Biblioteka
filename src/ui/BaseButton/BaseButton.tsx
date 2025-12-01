import React from "react";
import styles from "./BaseButton.module.scss";

type BaseButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "tertiary" | "red";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
};

export default function BaseButton({
    children,
    variant = "primary",
    disabled,
    type = "button",
    onClick,
    className,
    style,
}: BaseButtonProps) {
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
