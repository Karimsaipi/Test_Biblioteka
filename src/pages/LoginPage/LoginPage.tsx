import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import AuthForm from "./AuthForm/AuthForm";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Авторизация</h1>

                <AuthForm onSuccess={() => navigate("/", { replace: true })} />
            </div>
        </div>
    );
}
