import React from "react";
import styles from "./BookHeaderDetails.module.scss";
import { IPublication } from "../../models/IPublication";
import MyButton from "../../UI/BaseButton/BaseButton";
import coverPlaceholder from "../../assets/images/bookImage.png";

type BookHeaderProps = {
  book: IPublication;
  onRead?: (book: IPublication) => void;
  onDownload?: (book: IPublication) => void;
  onTagClick?: (tagName: string) => void;
};

export default function BookHeaderDetails({
  book,
  onRead,
  onDownload,
  onTagClick,
}: BookHeaderProps) {
  const author = book?.authors?.map((a) => a.name).join(", ");

  const year = new Date(book.releaseDate).getFullYear();

  return (
    <div className={styles.wrapper}>
      <div className={styles.coverBlock}>
        {/* Блок слева. Т.е обложка и кнопка под ними */}
        <div className={styles.cover}>
          <img
            src={book?.coverPath ? book.coverPath : coverPlaceholder}
            className={styles.coverImg}
            alt={book.title}
            onError={(e) => {
              e.currentTarget.src = coverPlaceholder;
            }}
          />
        </div>

        <button
          className={`${styles.fav} ${book.isFavourite ? styles.favActive : ""}`}
          onClick={() => {
            //  вызвать апи добавить в избранное
          }}
          aria-label={book.isFavourite ? "Убрать из избранного" : "В избранное"}
        >
          ★
        </button>

        <div className={styles.coverButtons}>
          <MyButton onClick={() => onRead?.(book)}>Читать</MyButton>

          <MyButton onClick={() => onRead?.(book)}>Скачать</MyButton>
        </div>

        {/* Блок справа с инфой. */}
        <div className={styles.info}>
          <h3 className={styles.title}>
            {book?.title || "Без названия"} {year}
          </h3>
        </div>

        <p className={styles.authors}>Авторы: {author}</p>

        {book.review && (
          <p className={styles.review}>
            <strong>О книге:</strong> {book.review}
          </p>
        )}

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
              <button
                key={t.id}
                type="button"
                className={styles.tag}
                onClick={() => onTagClick && onTagClick(t.name)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
