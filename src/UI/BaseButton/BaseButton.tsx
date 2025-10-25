import React from "react";
import styles from "./BaseButton.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "tertiary";
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; 
  onClick?: () => void;
  className?: string;
};

export default function MyButton({
  children,
  variant = "primary",
  disabled,
  type = "button", 
  onClick,
  className, 
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

