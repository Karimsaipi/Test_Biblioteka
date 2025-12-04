import React from "react";
import PublicationCreateForm from "@/pages/PublicationCreatePage/PublicationCreateForm/PublicationCreateForm";
import styles from "./PublicationCreatePage.module.scss";

export default function PublicationCreatePage() {
    return (
        <section className={styles.container}>
            <div className={styles.title}>Создание публикации</div>
            <PublicationCreateForm />
        </section>
    );
}
