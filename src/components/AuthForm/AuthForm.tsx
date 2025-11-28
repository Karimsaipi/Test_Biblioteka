import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInput from "../../UI/BaseInput/BaseInput";
import BaseButton from "../../UI/BaseButton/BaseButton";
import BaseLink from "../../UI/BaseLink/BaseLink";
import styles from "./AuthForm.module.scss";
import { signIn } from "../../api/auth";
import { useAppDispatch } from "../../store/hooks";
import { show } from "../../store/NotifySlice/notifySlice";
import { setCredentials } from "../../store/AuthSlice/authSlice";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-]).{6,}$/;

type Props = {
    onSuccess?: () => void;
    submitText?: string;
    showResetLink?: boolean;
    showRegisterButton?: boolean;
};

export default function AuthForm({
    onSuccess,
    submitText = "Войти",
    showResetLink = true,
    showRegisterButton = true,
}: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const l = login.trim();
        const p = password;

        const newErrors: Record<string, boolean> = {};
        if (!l) newErrors.login = true;
        if (!passwordRegex.test(p)) newErrors.password = true;

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const data = await signIn({ login: l, password: p });
            dispatch(setCredentials(data.token, data.user));
            dispatch(show({ type: "success", message: "Успешная авторизация" }));

            onSuccess?.();
        } catch {
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <BaseInput
                label="Логин/Email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                error={errors.login}
            />

            <BaseInput
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
            />

            <div className={styles.controllers}>
                <div className={styles.topRow}>
                    <BaseButton variant="primary" type="submit" disabled={loading}>
                        {submitText}
                    </BaseButton>

                    {showResetLink && (
                        <BaseLink to="/reset" style={{ marginRight: "30px" }}>
                            Сброс пароля
                        </BaseLink>
                    )}
                </div>

                {showRegisterButton && (
                    <BaseButton
                        variant="tertiary"
                        type="button"
                        className={styles.register}
                        onClick={() => navigate("/register")}
                        disabled={loading}
                    >
                        Зарегистрироваться
                    </BaseButton>
                )}
            </div>
        </form>
    );
}
