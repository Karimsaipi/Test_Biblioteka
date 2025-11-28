import React from "react";
import PublicationCreateForm from "../../components/PublicationCreateForm/PublicationCreateForm";
import styles from "./PublicationCreate.module.scss";

export default function PublicationCreate() {
  return (
    <section className={styles.container}>
      <div className={styles.title}>Создание публикации</div>
      <PublicationCreateForm />
    </section>
  );
}
