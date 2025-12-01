import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BookHeaderDetails from "../../components/BookHeaderDetails/BookHeaderDetails";
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
import { toUploadsUrl } from "../../utils/media";

type LocationState = {
    openReader?: boolean;
};

export default function BookDetails() {
    const dispatch = useAppDispatch();
    const last = useAppSelector((s) => s.lastOpened);

    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IPublication | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const openFromHeader = !!state?.openReader;

    const [readerOpen, setReaderOpenLocal] = useState(false);
    const [startPage, setStartPage] = useState(1);

    useEffect(() => {
        if (!id) return;
        let alive = true;

        getPublicationsID(id)
            .then((b) => alive && setBook(b))
            .catch(() => alive && setBook(null));

        return () => {
            alive = false;
        };
    }, [id]);

    useEffect(() => {
        if (!id) return;
        if (!last.hydrated) return;

        const nextId = Number(id);
        if (last.publicationId !== nextId) {
            dispatch(setLastOpened(nextId));
        }
    }, [id, last.hydrated, last.publicationId, dispatch]);

    const filePath = book?.filePath ?? "";
    const pdfUrl = useMemo(() => (filePath ? toUploadsUrl(filePath) : ""), [filePath]);

    // авто-открываем если пришли из Header
    useEffect(() => {
        if (!book) return;
        if (!openFromHeader) return;
        if (!book.filePath) return;

        const p = last.publicationId === book.id ? last.pageNumber || 1 : 1;
        setStartPage(p);

        setReaderOpenLocal(true);
        dispatch(setReaderOpen(true));
    }, [book, openFromHeader, dispatch, last.publicationId, last.pageNumber]);

    if (!book) return <div style={{ marginTop: 25 }}>Загрузка книги…</div>;

    const title = book.title ?? "book";
    const ext = (filePath.split(".").pop() ?? "pdf").toLowerCase();
    const filename = `${title}.${ext}`;

    const toggleReader = () => {
        if (!filePath) return;

        // закрываем
        if (readerOpen) {
            setReaderOpenLocal(false);
            dispatch(setReaderOpen(false));
            return;
        }

        // открываем
        const p = last.publicationId === book.id ? last.pageNumber || 1 : 1;
        setStartPage(p);

        setReaderOpenLocal(true);
        dispatch(setReaderOpen(true));
    };

    return (
        <>
            <BookHeaderDetails
                book={book}
                isReading={readerOpen}
                onRead={toggleReader}
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

            {readerOpen && pdfUrl && (
                <PDFReader
                    fileUrl={pdfUrl}
                    initialPage={startPage}
                    onPageChange={(p) => {
                        if (last.publicationId === book.id) dispatch(setLastPage(p));
                    }}
                />
            )}

            <CommentBlockPost publicationId={book.id} />
        </>
    );
}
