import React, { useEffect, useState } from "react";
import MyInput from "../../UI/Input/MyInput";
import GenderSwitch from "../../UI/Checkbox/GenderSwitch";
import MySelect from "../../UI/Select/MySelect";
import styles from "./RegistrationForm.module.scss";
import MyButton from "../../UI/BaseButton/BaseButton";
import DateInput from "../../UI/DateInput/DateInput";
import { useNavigate } from "react-router-dom";
import { buildPayload } from "../../utils/formMap";
import { signUp } from "../../API/auth";
import { useAppDispatch } from "../../store/hooks";
import { show } from "../../store/notifySlice";

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

        // проход по всем полям формы
        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                newErrors[key] = "error";
            }
        }

        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Невалидный майл";
        }

        if (formData.password && !passwordRegex.test(formData.password)) {
            newErrors.password = "Пароль: 1 заглавная, 1 цифра, 1 спецсимвол, минимум 6 символов";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const base = buildPayload(formData);
        const payload = {
            ...base,
            password: formData.password,
        };

        try {
            setLoading(true);
            await signUp(payload); // нам не важно, что вернул бэк — просто создали
            dispatch(show({ type: "success", message: "Успешная регистрация" }));
            navigate("/login", { replace: true });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Регистрация</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Левая колонка */}
                <div className={styles.left}>
                    <MyInput
                        label="Имя"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={errors.name}
                    />
                    <MyInput
                        label="Логин"
                        value={formData.login}
                        onChange={(e) => handleChange("login", e.target.value)}
                        error={errors.login}
                    />
                    <MyInput
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                    />
                    <MyInput
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        error={errors.password}
                    />
                    <MyInput
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
                    <MySelect
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
                    <MyInput
                        label="Должность"
                        value={formData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                    />
                    <MyButton variant="primary" type="submit" className={styles.button}>
                        Зарегистрироваться
                    </MyButton>
                </div>
            </form>
        </div>
    );
}
