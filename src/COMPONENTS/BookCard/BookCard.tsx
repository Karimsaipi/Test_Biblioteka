import React, { useState } from "react";
import { IPublication } from "../../models/IPublication";
import { Link, useNavigate } from "react-router-dom";
import style from "./BookCard.module.scss";
import coverPlaceholder from "../../assets/images/bookImage.png";

type Props = {
  book: IPublication;
};

export default function BookCard({ book }: Props) {
  // const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate(`/publications/${book.id}`);
  // };

  const author = book?.authors?.map((a) => a.name).join(", ") || "Без автора";

  const year = new Date(book.releaseDate).getFullYear();

  return (
    <Link to={`/publications/${book.id}`} className={style.card}>
      <div className={style.cover}>
        <img
          src={book?.coverPath ? book.coverPath : coverPlaceholder}
          className={style.coverImg}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = coverPlaceholder;
          }}
        />
      </div>

      <div className={style.meta}>
        <div className={style.authors}>{author}</div>

        <div className={style.title}>{book.title}</div>

        <div className={style.year}>{year}</div>
      </div>
    </Link>
  );
}
