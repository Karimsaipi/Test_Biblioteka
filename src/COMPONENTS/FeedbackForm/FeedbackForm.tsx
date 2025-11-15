import React, { useState } from "react";
import styles from "../FeedbackForm/FeedbackForm.module.scss";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import MySelect from "../../UI/Select/MySelect";
import { feedbackCreate } from "../../api/feedback";
import { useAppDispatch } from "../../store/hooks";
import { show } from "../../store/notifySlice";
import { Theme } from "../../models/IFeedback";

export default function FeedbackForm() {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        theme: Theme["Авторские права"],
        userName: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        for (const key in formData) {
            if (key === "theme") continue;
            if (!formData[key as keyof typeof formData]) {
                newErrors[key] = "error";
            }
        }

        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "fgfg";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await feedbackCreate(formData);
            dispatch(show({ type: "success", message: "Успешная отправка" }));
        } catch {
        } finally {
        }
    };

    return (
        <section className={styles.container}>
            <h3>Форма обратной связи</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                <span className={styles.labelLeft}>Тема сообщения</span>
                <MySelect
                    label=""
                    value={formData.theme.toString()}
                    onChange={(e) => handleChange("theme", e.target.value)}
                    options={[
                        { value: "Rights", label: "Авторские права" },
                        { value: "Error", label: "Ошибка на сайте" },
                        { value: "Smth", label: "Другое" },
                    ]}
                />

                <span className={styles.labelLeft}>Ваше имя</span>
                <MyInput
                    label="Ваше имя"
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    className={styles.hideInnerLabel}
                    error={errors.userName}
                />

                <span className={styles.labelLeft}>Ваш e-mail</span>
                <MyInput
                    label="Ваш e-mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={styles.hideInnerLabel}
                    error={errors.email}
                />

                <span className={styles.labelLeft}>Сообщение</span>
                <MyInput
                    label="Сообщение"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={`${styles.lastInput} ${styles.hideInnerLabel}`}
                    error={errors.message}
                />

                <MyButton variant="primary" type="submit" className={styles.button}>
                    Отправить
                </MyButton>
            </form>
        </section>
    );
}
