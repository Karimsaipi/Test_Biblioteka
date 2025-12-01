import React from "react";
import PublicationCreateForm from "@/components/PublicationCreateForm/PublicationCreateForm";
import styles from "./PublicationCreatePage.module.scss";

export default function PublicationCreatePage() {
    return (
        <section className={styles.container}>
            <div className={styles.title}>Создание публикации</div>
            <PublicationCreateForm />
        </section>
    );
}
