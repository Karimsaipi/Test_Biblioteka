import React, { useEffect, useState } from "react";
import styles from "./AccountModal.module.scss";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import DateInput from "../../UI/DateInput/DateInput";
import GenderSwitch from "../../UI/Checkbox/GenderSwitch";
import MySelect from "../../UI/Select/MySelect";

import { useAuth } from "../../context/authContext";
import { editAccount } from "../../API/account";
import { Gender } from "../../models/IUser";
import type { IAccountEditPayload } from "../../models/IAccountEdit";
import pencilPng from "../../assets/icons/penModalClick.png";
import { getErrorMessage } from "../../API/error";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AccountModal({ open, onClose }: Props) {
    const { user, setUser, logout } = useAuth();

    const [form, setForm] = useState(() => makeFormState(user));

    const [loading, setLoading] = useState(false); //блочит кнопку сохранить
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm(makeFormState(user));
            setErr(null);
        }
    }, [open, user]);

    const onChange =
        (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((s) => ({ ...s, [key]: e.target.value }));

    //сохраняем данные
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setErr(null);

        try {
            const payload = buildPayload(form);
            const { user: updated } = await editAccount(payload);
            setUser(updated);
            onClose();
        } catch (error: any) {
            setErr(getErrorMessage(error, "Не удалось сохранить профиль"));
        } finally {
            setLoading(false);
        }
    };

    const onExit = () => {
        logout();
        onClose();
    };

    if (!open) return null;

    return (
        <div
            className={styles.backdrop}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Профиль"
        >
            <div className={styles.card} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <span className={styles.label}>Имя</span>
                    <MyInput
                        label=""
                        value={form.name}
                        onChange={onChange("name")}
                        className={styles.hideInnerLabel}
                    />

                    <span className={styles.label}>Логин</span>
                    <MyInput
                        label=""
                        value={form.login}
                        onChange={onChange("login")}
                        className={styles.hideInnerLabel}
                    />

                    {/* Электронная почта */}
                    <span className={styles.label}>Электронная почта</span>
                    <div className={styles.emailRow}>
                        <div className={styles.emailValue}>{form.email}</div>

                        <button
                            type="button"
                            className={styles.emailEditBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                // модалка вызвать почту
                            }}
                        >
                            <img
                                src={pencilPng}
                                alt="Изменить e-mail"
                                className={styles.emailIconImg}
                            />
                        </button>
                    </div>

                    <span className={styles.label}>Пароль</span>
                    <button type="button" className={styles.buttonPswrd}>
                        Сменить пароль
                    </button>

                    <div className={styles.bottom}>
                        <DateInput
                            label="Дата рождения"
                            value={form.birthDate}
                            onChange={onChange("birthDate") as any}
                        />
                        <GenderSwitch
                            value={form.gender}
                            onChange={(v) => setForm((s) => ({ ...s, gender: v }))}
                        />

                        <MySelect
                            label="Род деятельности"
                            value={form.occupation}
                            onChange={onChange("occupation") as any}
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
                            value={form.position}
                            onChange={onChange("position")}
                        />
                    </div>

                    {/* Ошибка, если была */}
                    {err && <div className={styles.error}>{err}</div>}

                    <div className={styles.actions}>
                        <MyButton type="submit" className={styles.btn}>
                            Сохранить
                        </MyButton>
                        <MyButton
                            type="button"
                            className={styles.btn}
                            variant="red"
                            onClick={onExit}
                        >
                            Выйти
                        </MyButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ФУНКЦИИ
function makeFormState(user: ReturnType<typeof useAuth>["user"]) {
    return {
        name: user?.name ?? "",
        login: user?.login ?? "",
        email: user?.email ?? "",
        birthDate: user?.birthDate ?? "",
        gender:
            (user?.gender ?? Gender.Male) === Gender.Male ? ("male" as const) : ("female" as const),
        occupation: user?.career?.[0]?.value ?? "",
        position: user?.post?.[0]?.value ?? "",
    };
}

// готовим payload на сервер
function buildPayload(form: ReturnType<typeof makeFormState>): IAccountEditPayload {
    return {
        name: form.name.trim(),
        login: form.login.trim(),
        email: form.email.trim(),
        gender: form.gender === "male" ? Gender.Male : Gender.Female,
        birthDate: form.birthDate,
        career: form.occupation.trim(),
        post: form.position.trim(),
    };
}
