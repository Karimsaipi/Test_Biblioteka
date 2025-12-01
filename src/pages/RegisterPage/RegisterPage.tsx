import React from "react";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import styles from "./RegisterPage.module.scss";

export default function RegisterPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Регистрация</h1>
                <RegistrationForm />
            </div>
        </div>
    );
}
