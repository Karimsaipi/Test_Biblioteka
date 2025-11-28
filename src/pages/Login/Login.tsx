import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import styles from "./Login.module.scss";

export default function Login() {
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
