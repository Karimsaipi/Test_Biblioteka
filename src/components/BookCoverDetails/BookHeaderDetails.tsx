import React, { useState } from "react";
import styles from "./BookHeaderDetails.module.scss";
import { IPublication } from "../../models/IPublication";
import BaseButton from "../../UI/BaseButton/BaseButton";
import coverPlaceholder from "../../assets/images/bookImage.png";
import favIconZakl from "../../assets/icons/favICONZACLADKA.svg";
import { updateFavourite } from "../../api/favourites";
import { useAppDispatch } from "../../store/hooks";
import { show } from "../../store/NotifySlice/notifySlice";

type BookHeaderProps = {
    book: IPublication;
    onRead?: (book: IPublication) => void;
    onDownload?: (book: IPublication) => void;
    onSubjectClick?: (subjectName: string) => void;
    onTagClick?: (tagName: string) => void;
};

function getCoverUrl(coverPath?: string): string {
    if (!coverPath) return coverPlaceholder;

    return `/uploads/${coverPath}`;
}

function getPdfUrl(book: IPublication) {
    const path = (book as any).filePath || (book as any).fileUrl;
    return path ? `/uploads/${path}` : "";
}

export default function BookHeaderDetails({
    book,
    onRead,
    onDownload,
    onSubjectClick,
    onTagClick,
}: BookHeaderProps) {
    const author = book?.authors?.map((a) => a.name).join(", ");
    const year = new Date(book.releaseDate).getFullYear();
    const coverSrc = getCoverUrl(book.coverPath);
    const dispatch = useAppDispatch();

    const [isFavourite, setIsFavourite] = useState<boolean>((book as any).isFavourite ?? false);
    const [favLoading, setFavLoading] = useState(false);

    const handleFavoriteClick = async () => {
        if (favLoading) return;
        try {
            setFavLoading(true);
            const ok = await updateFavourite(book.id);
            if (ok) {
                setIsFavourite((prev) => !prev);
                dispatch(
                    show({
                        type: "success",
                        message: isFavourite ? "Удалено из закладок" : "Добавлено в закладки",
                    }),
                );
            }
        } catch (e) {
        } finally {
            setFavLoading(false);
        }
    };

    const handleReadClick = () => {
        if (onRead) return onRead(book);

        const url = getPdfUrl(book);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className={styles.coverBlock}>
            {/* Блок слева. Т.е обложка и кнопка под ними */}
            <div className={styles.cover}>
                <img
                    src={coverSrc}
                    className={styles.coverImg}
                    alt={book.title}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = coverPlaceholder;
                    }}
                />

                <div className={styles.coverButtons}>
                    <BaseButton className={styles.button} onClick={handleReadClick}>
                        Читать
                    </BaseButton>
                    <BaseButton className={styles.button} onClick={() => onDownload?.(book)}>
                        Скачать
                    </BaseButton>
                </div>
            </div>

            <img
                src={favIconZakl}
                alt={book.isFavourite ? "Убрать из закладок" : "В закладки"}
                className={`${styles.favIcon} ${isFavourite ? styles.favIconActive : ""}`}
                onClick={handleFavoriteClick}
            />

            {/* Блок справа с инфой. */}
            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <div className={styles.title}>{book?.title || "Без названия"}</div>
                    <div className={styles.year}>{year} г.</div>
                </div>

                <p className={styles.authors}>Авторы: {author}</p>

                {book.review && <p className={styles.review}> О книге: {book.review}</p>}

                {book.subjects && book.subjects.length > 0 && (
                    <div className={styles.subjects}>
                        {book.subjects.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                className={styles.subjectChip}
                                onClick={() => onSubjectClick && onSubjectClick(String(s.id))}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                )}

                {book.tags && book.tags.length > 0 && (
                    <div className={styles.tags}>
                        {book.tags.map((t) => (
                            <a
                                key={t.id}
                                type="button"
                                className={styles.tag}
                                onClick={() => onTagClick && onTagClick(String(t.id))}
                            >
                                {t.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
