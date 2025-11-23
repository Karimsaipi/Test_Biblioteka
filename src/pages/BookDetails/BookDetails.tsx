import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookHeaderDetails from "../../components/BookCoverDetails/BookHeaderDetails";
import { IPublication } from "../../models/IPublication";
import { fetchPublicationsID } from "../../api/publications";
import CommentBlockPost from "../../components/CommentBlockPost/CommentBlockPost";
import { useAppDispatch } from "../../store/hooks";
import { setLastOpenedt } from "../../store/lastOpenedSlice";

export default function BookDetails() {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IPublication | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        fetchPublicationsID(id)
            .then(setBook)
            .catch(() => setBook(null));
        dispatch(setLastOpenedt(Number(id)));
    }, [id, dispatch]);

    if (!book) return <div style={{ marginTop: 25 }}>Загрузка книги…</div>;

    const filePath = book.filePath ?? "";
    const title = book.title ?? "book";
    const ext = (filePath.split(".").pop() ?? "pdf").toLowerCase();
    const filename = `${title}.${ext}`;
    const url = `/uploads/${encodeURIComponent(filePath)}`;

    return (
        <>
            <BookHeaderDetails
                book={book}
                onRead={() => {
                    if (!filePath) return;
                    window.open(url, "_blank", "noopener,noreferrer");
                }}
                onDownload={() => {
                    if (!filePath) return;
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }}
                onTagClick={(tag) => navigate(`/allPublications?tag=${encodeURIComponent(tag)}`)}
            />
            <CommentBlockPost publicationId={book.id} />
        </>
    );
}
