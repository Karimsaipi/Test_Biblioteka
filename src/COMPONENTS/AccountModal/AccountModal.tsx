import React from "react";
import styles from "./AccountModal.module.scss";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import DateInput from "../../UI/DateInput/DateInput";
import GenderSwitch from "../../UI/Checkbox/GenderSwitch";
import MySelect from "../../UI/Select/MySelect";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { editAccount } from "../../API/account";
import { Gender } from "../../models/IUser";
import type { IAccountEditPayload } from "../../models/IAccountEdit";

type Props = { open: boolean; onClose: () => void };

export default function AccountModal({ open, onClose }: Props) {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = React.useState(() => ({
    name: user?.name ?? "",
    login: user?.login ?? "",
    email: user?.email ?? "",
    birthDate: user?.birthDate ?? "",
    gender: (user?.gender ?? Gender.Male) === Gender.Male ? "male" as const : "female" as const,
    occupation: user?.career?.[0]?.value ?? "",
    position: user?.post?.[0]?.value ?? "",
  }));

  React.useEffect(() => {
    if (!open) return;
    setForm({
      name: user?.name ?? "",
      login: user?.login ?? "",
      email: user?.email ?? "",
      birthDate: user?.birthDate ?? "",
      gender: (user?.gender ?? Gender.Male) === Gender.Male ? "male" : "female",
      occupation: user?.career?.[0]?.value ?? "",
      position: user?.post?.[0]?.value ?? "",
    });
  }, [open, user]);

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload: IAccountEditPayload = {
        name: form.name.trim(),
        login: form.login.trim(),
        email: form.email.trim(),
        gender: form.gender === "male" ? Gender.Male : Gender.Female,
        birthDate: form.birthDate,
        career: form.occupation.trim(),
        post: form.position.trim(),
      };
      const { user: updated } = await editAccount(payload);
      setUser(updated);
      onClose();
    } catch (e: any) {
      setErr(e.message || "Не удалось сохранить");
    } finally {
      setLoading(false);
    }
  };

  const onExit = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

    if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Профиль">
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit} className={styles.form}>
          <span className={styles.title}>Профиль</span>

          <span className={styles.label}>Имя</span>
          <MyInput label="" value={form.name} onChange={onChange("name")} className={styles.hideInnerLabel} />

          <span className={styles.label}>Логин</span>
          <MyInput label="" value={form.login} onChange={onChange("login")} className={styles.hideInnerLabel} />

          <span className={styles.label}>Электронная почта</span>
          <MyInput label="" value={form.email} onChange={onChange("email")} className={styles.hideInnerLabel} />

          <span className={styles.label}>Пароль</span>
          <MyButton type="button">Сменить пароль</MyButton>

          <DateInput label="Дата рождения" value={form.birthDate} onChange={onChange("birthDate") as any} />
          <GenderSwitch value={form.gender} onChange={(v) => setForm((s) => ({ ...s, gender: v }))} />

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

          <MyInput label="Должность" value={form.position} onChange={onChange("position")} />

          {err && <div className={styles.error}>{err}</div>}

          <div className={styles.actions}>
            <MyButton type="button" onClick={onExit}>
              Выйти
            </MyButton>
            <MyButton type="submit" disabled={loading}>
              {loading ? "Сохраняем…" : "Сохранить"}
            </MyButton>
          </div>
        </form>
      </div>
    </div>
  );
}
