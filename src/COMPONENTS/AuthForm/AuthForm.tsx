import React, { useState } from "react";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import styles from "./AuthForm.module.scss";
import { useNavigate } from "react-router-dom";
import MyLink from "../../UI/Link/MyLink";
// import { useAuth } from "../../context/authContext";
import { signIn } from "../../API/auth";
import { useAppDispatch } from "../../store/hooks";
import { show } from "../../store/notifySlice";
import { setCredentials } from "../../store/authSlice";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-]).{6,}$/;

export default function AuthForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    //ЗАПРОС С ПРОВЕРКОЙ
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const l = login.trim();
        const p = password;

        const newErrors: Record<string, boolean> = {};
        if (!l) newErrors.login = true;
        if (!passwordRegex.test(p)) {
          newErrors.password = true;
        } 

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const data = await signIn({ login: l, password: p });
            dispatch(setCredentials(data))
            dispatch(show({ type: "success", message: "Успешная авторизация" }));
            navigate("/", { replace: true });
        } catch {
        } finally {
        }
    };

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Авторизация</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <MyInput
                    label="Логин/Email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    error={errors.login}
                />
                <MyInput
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <div className={styles.controllers}>
                    <div className={styles.topRow}>
                        <MyButton variant="primary" type="submit">
                            Войти
                        </MyButton>
                        <MyLink to="/reset" style={{ marginRight: "30px" }}>
                            Сброс пароля
                        </MyLink>
                    </div>

                    <MyButton
                        variant="tertiary"
                        type="button"
                        className={styles.register}
                        onClick={() => navigate("/register")}
                    >
                        Зарегистрироваться
                    </MyButton>
                </div>
            </form>
        </div>
    );
}
