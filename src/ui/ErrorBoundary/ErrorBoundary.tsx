import React from "react";
import BaseButton from "@/ui/BaseButton/BaseButton";
import styles from "./ErrorBoundary.module.scss";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.wrapper}>
                    <h1 className={styles.title}>Что-то пошло не так 😢</h1>
                    <p className={styles.text}>
                        Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
                    </p>

                    <BaseButton onClick={this.handleReload}>Перезагрузить</BaseButton>
                </div>
            );
        }

        return this.props.children;
    }
}
