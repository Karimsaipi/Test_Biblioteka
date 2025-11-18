import React, { useEffect, useState } from "react";
import styles from "./AccountModal.module.scss";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import DateInput from "../../UI/DateInput/DateInput";
import GenderSwitch from "../../UI/Checkbox/GenderSwitch";
import MySelect from "../../UI/Select/MySelect";

// import { useAuth } from "../../context/authContext";
import { editAccount } from "../../api/account";
import type { Gender, IUser } from "../../models/IUser";
import type { IAccountEditRequest } from "../../models/IAccountEdit";
import pencilPng from "../../assets/icons/penModalClick.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { show } from "../../store/notifySlice";
import { logout, setUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AccountModal({ open, onClose }: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);

    const [form, setForm] = useState(() => makeFormState(user));
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
        setErr(null);

        try {
            const payload = buildPayload(form);
            await editAccount(payload);
            const { career, post, ...rest } = payload;

            const updatedUser: IUser = {
                ...user,
                ...rest,
            } as IUser;
            dispatch(setUser(updatedUser));
            dispatch(show({ type: "success", message: "Данные обновлены" }));

            onClose();
        } catch {
        } finally {
        }
    };

    const onExit = () => {
        dispatch(logout());
        onClose();
        navigate("/login", { replace: true });
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

function normalizeDate(value?: string | null): string {
    //хуярим дату норм
    if (!value) return "";
    if (value.includes("T")) return value.slice(0, 10);
    return value;
}

// ФУНКЦИИ
function makeFormState(user: IUser | null) {
    return {
        name: user?.name ?? "",
        login: user?.login ?? "",
        email: user?.email ?? "",
        birthDate: normalizeDate(user?.birthDate),
        gender: (user?.gender ?? "male") as Gender,
        occupation: user?.career?.[0]?.value ?? "",
        position: user?.post?.[0]?.value ?? "",
    };
}

// готовим payload на сервер
function buildPayload(form: ReturnType<typeof makeFormState>): IAccountEditRequest {
    return {
        name: form.name.trim(),
        login: form.login.trim(),
        email: form.email.trim(),
        gender: form.gender,
        birthDate: form.birthDate,
        career: form.occupation.trim(),
        post: form.position.trim(),
    };
}
