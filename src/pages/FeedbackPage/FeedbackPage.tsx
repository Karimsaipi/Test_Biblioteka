import React from "react";
import styles from "./FeedbackPage.module.scss";
import FeedbackForm from "./FeedbackForm/FeedbackForm";

export default function FeedbackPage() {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>Форма обратной связи</h3>
            <FeedbackForm />
        </section>
    );
}
