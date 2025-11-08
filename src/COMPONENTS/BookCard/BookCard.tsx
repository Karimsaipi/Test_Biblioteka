import React, { useState } from "react";
import { IPublication } from "../../models/IPublication";
import { Link, useNavigate } from "react-router-dom";
import style from "./BookCard.module.scss";
import coverPlaceholder from "../../assets/images/bookImage.png";

type Props = {
    book: IPublication;
};

// const API_URL = process.env.API_URL || "http://192.168.68.104:3000";

function getCoverUrl(coverPath?: string): string {
    if (!coverPath) return coverPlaceholder;

    return `/uploads/${coverPath}`;
}

export default function BookCard({ book }: Props) {
    const author = book?.authors?.map((a) => a.name).join(", ") || "Без автора";
    const year = new Date(book.releaseDate).getFullYear();
    const coverSrc = getCoverUrl(book.coverPath);
    return (
        <Link to={`/publications/${book.id}`} className={style.card}>
            <div className={style.cover}>
                <img
                    src={coverSrc}
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
