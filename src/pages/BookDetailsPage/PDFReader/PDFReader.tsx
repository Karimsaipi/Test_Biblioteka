import React from "react";
import { Viewer, Worker, type PageChangeEvent } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import styles from "./PDFReader.module.scss";

type Props = {
    fileUrl: string;
    initialPage?: number;
    onPageChange?: (page: number) => void;
};

export default function PDFReader({ fileUrl, initialPage = 1, onPageChange }: Props) {
    const layoutPluginInstance = defaultLayoutPlugin();

    if (!fileUrl) return null;

    const initial0 = Math.max(0, initialPage - 1);

    const handlePageChange = (e: PageChangeEvent) => {
        onPageChange?.(e.currentPage + 1);
    };

    return (
        <div className={styles.wrapper}>
            <Worker workerUrl="/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    initialPage={initial0}
                    plugins={[layoutPluginInstance]}
                    onPageChange={handlePageChange}
                />
            </Worker>
        </div>
    );
}
