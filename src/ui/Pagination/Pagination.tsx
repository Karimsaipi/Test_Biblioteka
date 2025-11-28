import React from "react";
import styles from "./Pagination.module.scss";

interface Props {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
    if (totalPages <= 1) return null;

    const go = (p: number) => {
        if (p < 1 || p > totalPages || p === currentPage) return;
        onChange(p);
    };

    const items: (number | "...")[] = [];
    const push = (x: number | "...") => items.push(x);

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) push(i);
    } else {
        // левая часть
        push(1);
        if (currentPage > 3) push("...");

        const left = Math.max(2, currentPage - 1);
        const right = Math.min(totalPages - 1, currentPage + 1);

        for (let p = left; p <= right; p++) push(p);

        if (currentPage < totalPages - 2) push("...");
        push(totalPages);
    }

    return (
        <div className={styles.wrapper}>
            <button className={styles.arrow} onClick={() => go(currentPage - 1)}>
                &lt;
            </button>

            {items.map((it, i) =>
                it === "..." ? (
                    <span key={`e-${i}`} className={styles.ellipsis}>
                        &hellip;
                    </span>
                ) : (
                    <button
                        key={it}
                        className={
                            it === currentPage ? `${styles.page} ${styles.active}` : styles.page
                        }
                        onClick={() => go(it)}
                    >
                        {it}
                    </button>
                ),
            )}

            <button
                className={styles.arrow}
                onClick={() => go(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
}
