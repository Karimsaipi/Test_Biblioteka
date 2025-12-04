import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildPayload } from "@/shared/utils/formMap";
import { signUp } from "@/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { show } from "@/store/NotifySlice/notifySlice";
import styles from "./RegistrationForm.module.scss";
import { BaseButton, BaseInput, BaseSelect, DateInput, GenderSwitch } from "@/ui";

export default function RegistrationForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: "",
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        gender: "male" as "male" | "female",
        occupation: "",
        position: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string | "male" | "female") => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                newErrors[key] = "error";
            }
        }

        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Невалидный email";
        }

        if (formData.password && !passwordRegex.test(formData.password)) {
            newErrors.password = "Пароль должен содержать заглавную букву, цифру и спецсимвол";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const base = buildPayload(formData);
        const payload = { ...base, password: formData.password };

        try {
            setLoading(true);
            await signUp(payload);
            dispatch(show({ type: "success", message: "Успешная регистрация" }));
            navigate("/login", { replace: true });
        } catch {
            dispatch(show({ type: "error", message: "Ошибка регистрации" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Левая колонка */}
            <div className={styles.left}>
                <BaseInput
                    label="Имя"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                />
                <BaseInput
                    label="Логин"
                    value={formData.login}
                    onChange={(e) => handleChange("login", e.target.value)}
                    error={errors.login}
                />
                <BaseInput
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                />
                <BaseInput
                    label="Пароль"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                />
                <BaseInput
                    label="Повторите пароль"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                />
            </div>

            {/* Правая колонка */}
            <div className={styles.right}>
                <DateInput
                    label="Дата рождения"
                    value={formData.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                />
                <GenderSwitch
                    value={formData.gender}
                    onChange={(val) => handleChange("gender", val)}
                />
                <BaseSelect
                    label="Род деятельности"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    options={[
                        { value: "it", label: "IT" },
                        { value: "education", label: "Образование" },
                        { value: "medicine", label: "Медицина" },
                        { value: "business", label: "Бизнес" },
                        { value: "student", label: "Студент" },
                    ]}
                />
                <BaseInput
                    label="Должность"
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                />
                <BaseButton
                    variant="primary"
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "..." : "Зарегистрироваться"}
                </BaseButton>
            </div>
        </form>
    );
}
