import React from "react";
import styles from "./Pagination.module.scss";

interface Props {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

type PageItem = number | "...";

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onChange(page);
    };

    const rawItems: PageItem[] = [];
    const addItem = (item: PageItem) => rawItems.push(item);

    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) addItem(page);
    } else {
        const firstPages = [1, 2];
        const lastPages = [totalPages - 1, totalPages];

        const middleStart = Math.max(3, currentPage - 1);
        const middleEnd = Math.min(totalPages - 2, currentPage + 1);

        addItem(firstPages[0]);
        addItem(firstPages[1]);

        if (middleStart > 3) addItem("...");

        for (let page = middleStart; page <= middleEnd; page++) addItem(page);

        if (middleEnd < totalPages - 2) addItem("...");

        addItem(lastPages[0]);
        addItem(lastPages[1]);
    }

    const withoutDuplicates: PageItem[] = [];
    for (const item of rawItems) {
        const lastAdded = withoutDuplicates[withoutDuplicates.length - 1];
        if (item === lastAdded) continue;
        withoutDuplicates.push(item);
    }

    const finalItems: PageItem[] = [];
    for (let index = 0; index < withoutDuplicates.length; index++) {
        const item = withoutDuplicates[index];
        const previous = finalItems[finalItems.length - 1];
        const next = withoutDuplicates[index + 1];

        const dotsAreRedundant =
            item === "..." &&
            typeof previous === "number" &&
            typeof next === "number" &&
            next === previous + 1;

        if (!dotsAreRedundant) finalItems.push(item);
    }

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.arrow}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {finalItems.map((item, index) =>
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
