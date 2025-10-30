import React from "react";
import { IPublication } from "../../models/IPublication";
import { useNavigate } from "react-router-dom";
import style from "./BookCard.module.scss";

type Props = {
  book: IPublication;
};

export default function BookCard({ book }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/publications/${book.id}`);
  };

  const author = book?.author?.map((a) => a.name).join(", ");

  const year = new Date(book.releaseDate).getFullYear();

  return (
    <div className={style.card} onClick={handleClick}>
      <div className={style.cover}>
        <img 
        src={book.coverPath} 
        className={style.coverImg} 
        alt={book.title}
        />
      </div>

      <div className={style.meta}>
        <div className={style.authors}>{author}</div>

        <div className={style.title}>{book.title}</div>

        <div className={style.year}>{year}</div>
      </div>
    </div>
  );
}
