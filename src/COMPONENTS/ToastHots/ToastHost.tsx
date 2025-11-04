import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hide } from "../../store/notifySlice";
import styles from "./ToastHost.module.scss";

export default function ToastHost() {
    const dispatch = useAppDispatch();
    const { visible, type, message } = useAppSelector((s) => s.notify);

    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => dispatch(hide()), type === "error" ? 4000 : 2000);
        return () => clearTimeout(t);
    }, [visible, type, dispatch]);

    if (!visible) return null;

    return (
        <div className={styles.container}>
            <div
                className={`${styles.toast}`}
                role="status"
                aria-live="polite"
                onClick={() => dispatch(hide())}
            >
                {message}
            </div>
        </div>
    );
}
