import React from "react";
import styles from "./Pagination.module.scss";

interface Props {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

type PageItem = number | "...";

function buildItems(currentPage: number, totalPages: number): PageItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const last = totalPages;

    // start
    if (currentPage <= 3) {
        return [1, 2, 3, 4, "...", last]; // при total=6 скрывается 5
    }

    // end
    if (currentPage >= last - 2) {
        return [1, "...", last - 3, last - 2, last - 1, last];
    }

    // middle
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", last];
}

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onChange(page);
    };

    const items = buildItems(currentPage, totalPages);

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.arrow}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {items.map((item, index) =>
                item === "..." ? (
                    <span key={`dots-${index}`} className={styles.ellipsis}>
                        &hellip;
                    </span>
                ) : (
                    <button
                        key={item}
                        className={
                            item === currentPage ? `${styles.page} ${styles.active}` : styles.page
                        }
                        onClick={() => goToPage(item)}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                className={styles.arrow}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
}
