import React, { useState } from "react";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";
import styles from "./AuthForm.module.scss";
import { useNavigate } from "react-router-dom";
import MyLink from "../../UI/Link/MyLink";
import { useAuth } from "../../context/authContext";


export default function AuthForm() {
  const navigate = useNavigate();
  const { setIsAuth } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // пока без бэка: можно даже не проверять ввод
    localStorage.setItem("token", "dev-token");
    setIsAuth(true);               
    navigate("/", { replace: true }); 
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Авторизация</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <MyInput
          label="Логин/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MyInput
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
