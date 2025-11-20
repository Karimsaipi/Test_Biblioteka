import React from "react";
import { useAppSelector } from "../../store/hooks";
import styles from "./Main.module.scss";

export default function Main() {
    const user = useAppSelector((s) => s.auth.user);
    const displayName = user?.name || user?.login || "друг";

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Привет, {displayName} 👋</h1>
                    <p className={styles.subtitle}>
                        Добро пожаловать в электронный портал DigitalBooks.
                    </p>
                    <p className={styles.text}>
                        Используй навигацию сверху, чтобы перейти к публикациям, избранному или
                        другим разделам. Здесь будут собраны твои книги, избранные материалы и новые
                        публикации.
                    </p>
                </section>
            </div>
        </div>
    );
}
