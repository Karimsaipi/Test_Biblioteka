import React from "react";
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";
import styles from "./FeedBack.module.scss";

export default function Feedback() {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>Форма обратной связи</h3>
            <FeedbackForm />
        </section>
    );
}