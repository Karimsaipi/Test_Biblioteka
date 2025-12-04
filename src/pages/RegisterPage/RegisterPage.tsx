import React from "react";
import styles from "./RegisterPage.module.scss";
import RegistrationForm from "./RegistrationForm/RegistrationForm";

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
