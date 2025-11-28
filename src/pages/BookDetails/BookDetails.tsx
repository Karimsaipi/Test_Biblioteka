import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BookHeaderDetails from "../../components/BookCoverDetails/BookHeaderDetails";
import { IPublication } from "../../models/IPublication";
import { getPublicationsID } from "../../api/publications";
import CommentBlockPost from "../../components/CommentBlockPost/CommentBlockPost";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    setLastOpened,
    setLastPage,
    setReaderOpen,
} from "../../store/LastOpenedSlice/lastOpenedSlice";
import PDFReader from "../../components/PDFReader/PDFReader";
import styles from "./BookDetails.module.scss";
import BaseButton from "../../ui/BaseButton/BaseButton";

function uploadUrl(path: string) {
    return `/uploads/${encodeURI(path)}`;
}

export default function BookDetails() {
    const dispatch = useAppDispatch();
    const last = useAppSelector((s) => s.lastOpened); // твой ключ
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IPublication | null>(null);
    const navigate = useNavigate();

    const location = useLocation();
    const openFromHeader = !!(location.state as any)?.openReader;

    const [readerOpen, setReaderOpenLocal] = useState(false);

    useEffect(() => {
        if (!id) return;

        getPublicationsID(id)
            .then(setBook)
            .catch(() => setBook(null));
    }, [id]);

    // не затираем состояние
    useEffect(() => {
        if (!id) return;
        if (!last.hydrated) return;

        const nextId = Number(id);
        if (last.publicationId !== nextId) {
            dispatch(setLastOpened(nextId));
        }
    }, [id, last.hydrated, last.publicationId, dispatch]);

    // авто-открываем модалку после загрузки книги (если ранее была открыта)
    useEffect(() => {
        if (!book) return;
        if (!last.hydrated) return;

        if (last.publicationId === book.id && last.readerOpen) {
            setReaderOpenLocal(true);
        }
    }, [book, last.hydrated, last.publicationId, last.readerOpen]);

    // авто-открываем модалку если пришли из Header с openReader
    useEffect(() => {
        if (!book) return;
        if (!openFromHeader) return;

        if (book.filePath) {
            setReaderOpenLocal(true);
            dispatch(setReaderOpen(true));
        }
    }, [book, openFromHeader, dispatch]);

    if (!book) return <div style={{ marginTop: 25 }}>Загрузка книги…</div>;

    const filePath = book.filePath ?? "";
    const pdfUrl = filePath ? uploadUrl(filePath) : "";

    const title = book.title ?? "book";
    const ext = (filePath.split(".").pop() ?? "pdf").toLowerCase();
    const filename = `${title}.${ext}`;

    const closeReader = () => {
        setReaderOpenLocal(false);
        dispatch(setReaderOpen(false));
    };

    const openReader = () => {
        if (!filePath) return;
        setReaderOpenLocal(true);
        dispatch(setReaderOpen(true));
    };

    return (
        <>
            <BookHeaderDetails
                book={book}
                onRead={openReader}
                onDownload={() => {
                    if (!filePath) return;
                    const a = document.createElement("a");
                    a.href = pdfUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }}
                onSubjectClick={(subject) =>
                    navigate(`/allPublications?subject=${encodeURIComponent(subject)}`)
                }
                onTagClick={(tag) => navigate(`/allPublications?tag=${encodeURIComponent(tag)}`)}
            />

            <CommentBlockPost publicationId={book.id} />

            {readerOpen && pdfUrl && (
                <div onClick={closeReader} className={styles.wrapper}>
                    <div onClick={(e) => e.stopPropagation()} className={styles.reader}>
                        <div className={styles.info}>
                            <div className={styles.title} title={book.title}>
                                {book.title}
                            </div>

                            <div style={{ display: "flex", gap: 10 }}>
                                <BaseButton
                                    className={styles.button}
                                    onClick={() =>
                                        window.open(pdfUrl, "_blank", "noopener,noreferrer")
                                    }
                                >
                                    Вкладка
                                </BaseButton>

                                <BaseButton
                                    className={styles.button}
                                    onClick={closeReader}
                                    aria-label="Закрыть"
                                >
                                    X
                                </BaseButton>
                            </div>
                        </div>

                        <div style={{ background: "#fff", borderRadius: 12, padding: 10 }}>
                            <PDFReader
                                fileUrl={pdfUrl}
                                initialPage={last.publicationId === book.id ? last.pageNumber : 1}
                                onPageChange={(p) => dispatch(setLastPage(p))}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
