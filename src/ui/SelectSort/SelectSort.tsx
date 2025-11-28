import React, { useState } from "react";
import { PublicationsSortBy, PublicationsSortOrder } from "../../models/IPublication";
import styles from "./SelectSort.module.scss";
import sortIcon from "../../assets/icons/SortIcon.png";

interface SortSelectProps {
    sortBy: PublicationsSortBy;
    sortOrder: PublicationsSortOrder;
    onChange: (sortBy: PublicationsSortBy, sortOrder: PublicationsSortOrder) => void;
}

export default function SortSelect({ sortBy, sortOrder, onChange }: SortSelectProps) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(!open);

    const handleAlphabet = () => {
        onChange(PublicationsSortBy.ALPHABET, PublicationsSortOrder.ASC);
        setOpen(false);
    };

    const handleDate = () => {
        onChange(PublicationsSortBy.CREATION_DATE, PublicationsSortOrder.DESC);
        setOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <button type="button" className={styles.button} onClick={toggle}>
                <img src={sortIcon} alt="Сортировать" className={styles.icon} />
            </button>

            {open && (
                <div className={styles.menu}>
                    <button
                        type="button"
                        className={
                            sortBy === PublicationsSortBy.ALPHABET
                                ? `${styles.item} ${styles.itemActive}`
                                : styles.item
                        }
                        onClick={handleAlphabet}
                    >
                        По алфавиту
                    </button>
                    <button
                        type="button"
                        className={
                            sortBy === PublicationsSortBy.CREATION_DATE
                                ? `${styles.item} ${styles.itemActive}`
                                : styles.item
                        }
                        onClick={handleDate}
                    >
                        По дате публикации
                    </button>
                </div>
            )}
        </div>
    );
}
