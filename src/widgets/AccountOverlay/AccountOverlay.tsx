import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountOverlay.module.scss";
import { editAccount } from "@/api/account";
import type { Gender, IUser } from "@/models/IUser";
import type { IAccountEditReqBody } from "@/models/IAccountEdit";
import pencilPng from "@/assets/icons/penModalClick.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { show } from "@/store/NotifySlice/notifySlice";
import { logout, setUser } from "@/store/AuthSlice/authSlice";
import { BaseButton, BaseInput, BaseSelect, DateInput, GenderSwitch } from "@/ui";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { useOnEscape } from "@/shared/hooks/useOnEscape";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AccountOverlay({ open, onClose }: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);

    const popoverRef = useRef<HTMLDivElement | null>(null);

    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [form, setForm] = useState(() => makeFormState(user));
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setForm(makeFormState(user));
        setErr(null);
        setIsEmailEditing(false);
    }, [open, user]);

    useOnClickOutside(popoverRef, () => onClose(), { enabled: open });

    useOnEscape(() => onClose(), { enabled: open });

    const onChange =
        (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((s) => ({ ...s, [key]: e.target.value }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        try {
            const payload = buildPayload(form);
            await editAccount(payload);

            const { career, post, ...rest } = payload;

            const updatedUser: IUser = {
                ...(user as IUser),
                ...rest,
            };

            dispatch(setUser(updatedUser));
            dispatch(show({ type: "success", message: "Данные обновлены" }));
            onClose();
        } catch {}
    };

    const onExit = () => {
        dispatch(logout());
        onClose();
        navigate("/login", { replace: true });
    };

    if (!open) return null;

    return (
        <div ref={popoverRef} className={styles.popover} role="dialog" aria-label="Профиль">
            <form onSubmit={onSubmit} className={styles.form}>
                <span className={styles.label}>Имя</span>
                <BaseInput
                    label=""
                    value={form.name}
                    onChange={onChange("name")}
                    className={styles.hideInnerLabel}
                />

                <span className={styles.label}>Логин</span>
                <BaseInput
                    label=""
                    value={form.login}
                    onChange={onChange("login")}
                    className={styles.hideInnerLabel}
                />

                <span className={styles.label}>Электронная почта</span>
                <div className={styles.emailRow}>
                    <div className={styles.emailField}>
                        {isEmailEditing ? (
                            <BaseInput
                                label=""
                                value={form.email}
                                onChange={onChange("email")}
                                className={styles.hideInnerLabel}
                            />
                        ) : (
                            <div className={styles.emailValue}>{form.email}</div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={styles.emailEditBtn}
                        onClick={() => setIsEmailEditing((prev) => !prev)}
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
                        onChange={onChange("birthDate")}
                    />

                    <GenderSwitch
                        value={form.gender}
                        onChange={(v) => setForm((s) => ({ ...s, gender: v }))}
                    />

                    <BaseSelect
                        label="Род деятельности"
                        value={form.occupation}
                        onChange={onChange("occupation")}
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
                        value={form.position}
                        onChange={onChange("position")}
                    />
                </div>

                {err && <div className={styles.error}>{err}</div>}

                <div className={styles.actions}>
                    <BaseButton type="submit" className={styles.btn}>
                        Сохранить
                    </BaseButton>

                    <BaseButton type="button" className={styles.btn} variant="red" onClick={onExit}>
                        Выйти
                    </BaseButton>
                </div>
            </form>
        </div>
    );
}

function normalizeDate(value?: string | null): string {
    if (!value) return "";
    if (value.includes("T")) return value.slice(0, 10);
    return value;
}

function makeFormState(user: IUser | null) {
    return {
        name: user?.name ?? "",
        login: user?.login ?? "",
        email: user?.email ?? "",
        birthDate: normalizeDate(user?.birthDate),
        gender: (user?.gender ?? "male") as Gender,
        occupation: user?.career ?? "",
        position: user?.post ?? "",
    };
}

function buildPayload(form: ReturnType<typeof makeFormState>): IAccountEditReqBody {
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
