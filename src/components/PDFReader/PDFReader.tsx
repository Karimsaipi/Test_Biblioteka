import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./PDFReader.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = {
    fileUrl: string;
    initialPage?: number;
    onPageChange?: (page: number) => void;
};

export default function PDFReader({ fileUrl, initialPage = 1, onPageChange }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [pageWidth, setPageWidth] = useState(0);

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(Math.max(1, initialPage));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const measure = () => setPageWidth(Math.max(0, el.clientWidth));

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        measure();

        return () => ro.disconnect();
    }, []);

    // если сменился файл или initialPage — прыгаем на нужную страницу
    useEffect(() => {
        const next = Math.max(1, initialPage);
        setPageNumber(next);
        onPageChange?.(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl, initialPage]);

    const setPage = (next: number) => {
        setPageNumber(next);
        onPageChange?.(next);
    };

    return (
        <div ref={wrapRef} className={styles.wrapper}>
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setError(null);

                    // если initialPage > numPages — прижмём
                    setPageNumber((prev) => {
                        const clamped = Math.min(Math.max(1, prev), numPages);
                        onPageChange?.(clamped);
                        return clamped;
                    });
                }}
                onLoadError={(err) => setError(err?.message ?? "react-pdf error")}
                loading={<div className={styles.center}>Загружаю PDF…</div>}
                error={<div className={styles.center}>Не удалось открыть PDF</div>}
            >
                {pageWidth > 0 && (
                    <Page
                        pageNumber={pageNumber}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                )}
            </Document>

            <div className={styles.controls}>
                <button
                    type="button"
                    onClick={() => setPage(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                >
                    ◀
                </button>

                <span>
                    Страница {pageNumber} из {numPages || "…"}
                </span>

                <button
                    type="button"
                    onClick={() => setPage(Math.min(numPages || pageNumber + 1, pageNumber + 1))}
                    disabled={!numPages || pageNumber >= numPages}
                    className={styles.button}
                >
                    ▶
                </button>
            </div>

            {error && <div className={styles.center}>Не удалось открыть PDF: {error}</div>}
        </div>
    );
}
