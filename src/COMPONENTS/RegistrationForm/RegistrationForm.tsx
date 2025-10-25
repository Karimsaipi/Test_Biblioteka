import React, { useEffect, useState } from "react";
import MyInput from "../../UI/Input/MyInput";
import GenderSwitch from "../../UI/Checkbox/GenderSwitch";
import MySelect from "../../UI/Select/MySelect";
import styles from "./RegistrationForm.module.scss";
import MyButton from "../../UI/BaseButton/BaseButton";
import DateInput from "../../UI/DateInput/DateInput";

export default function RegistrationForm() {
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

  const handleChange = (
    field: keyof typeof formData,
    value: string | "male" | "female"
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // создаём пустой объект ошибок
    const newErrors: Record<string, string> = {};

    // проходимся по всем полям формы
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = "error";
      }
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "error";
    }

    // проверка что пароль удолетворяет
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = "error";
    }

    // проверяем, что пароли совпадают
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "error";
    }

    // обновляем состояние ошибок
    setErrors(newErrors);

    // если есть хотя бы одна ошибка — просто выходим
    if (Object.keys(newErrors).length > 0) return;

    // иначе можно отправить данные
    console.log("✅ Все поля заполнены:", formData);
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
