import React, { useState } from "react";
import styles from "../FeedbackForm/FeedbackForm.module.scss";
import MyInput from "../../UI/Input/MyInput";
import MyButton from "../../UI/BaseButton/BaseButton";

export default function FeedbackForm() {
  const [themeMessage, setThemeMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className={styles.container}>
      <h3>Форма обратной связи</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.labelLeft}>Тема сообщения</span>
        <MyInput
          label="Тема сообщения"
          value={themeMessage}
          onChange={(e) => setThemeMessage(e.target.value)}
          className={styles.hideInnerLabel} 
        />

        <span className={styles.labelLeft}>Ваше имя</span>
        <MyInput
          label="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.hideInnerLabel}
        />

        <span className={styles.labelLeft}>Ваш e-mail</span>
        <MyInput
          label="Ваш e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.hideInnerLabel}
        />

        <span className={styles.labelLeft}>Сообщение</span>
        <MyInput
          label="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${styles.lastInput} ${styles.hideInnerLabel}`}
        />

        <MyButton variant="primary" type="submit" className={styles.button}>
          Отправить
        </MyButton>
      </form>
    </section>
  );
}

