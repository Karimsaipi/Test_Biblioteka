import React from "react";
import styles from "./BookHeaderDetails.module.scss";
import { IPublication } from "../../models/IPublication";
import MyButton from "../../UI/BaseButton/BaseButton";
import coverPlaceholder from "../../assets/images/bookImage.png";
import favIconZakl from "../../assets/icons/favICONZACLADKA.svg";

type BookHeaderProps = {
    book: IPublication;
    onRead?: (book: IPublication) => void;
    onDownload?: (book: IPublication) => void;
    onTagClick?: (tagName: string) => void;
};

function getCoverUrl(coverPath?: string): string {
    if (!coverPath) return coverPlaceholder;

    return `/uploads/${coverPath}`;
}
//
export default function BookHeaderDetails({
    book,
    onRead,
    onDownload,
    onTagClick,
}: BookHeaderProps) {
    const author = book?.authors?.map((a) => a.name).join(", ");
    const year = new Date(book.releaseDate).getFullYear();
    const coverSrc = getCoverUrl(book.coverPath);

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
                    <MyButton className={styles.button} onClick={() => onRead?.(book)}>
                        Читать
                    </MyButton>
                    <MyButton className={styles.button} onClick={() => onDownload?.(book)}>
                        Скачать
                    </MyButton>
                </div>
            </div>

            <img
                src={favIconZakl}
                alt="В закладки"
                className={styles.favIcon}
                // onClick={() => handleFavoriteClick(id)} // твоя логика
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
                        {book.subjects.map((s, index) => (
                            <span key={s.id} className={styles.subjectChip}>
                                {s.name}
                            </span>
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
                                onClick={() => onTagClick && onTagClick(t.name)}
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
