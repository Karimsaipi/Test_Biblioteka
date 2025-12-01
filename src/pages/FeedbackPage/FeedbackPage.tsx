import React from "react";
import FeedbackForm from "@/components/FeedbackForm/FeedbackForm";
import styles from "./FeedbackPage.module.scss";

export default function FeedbackPage() {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>Форма обратной связи</h3>
            <FeedbackForm />
        </section>
    );
}
