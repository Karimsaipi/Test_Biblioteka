import React, { useEffect, useState } from "react";
import {
    IPublication,
    IPublicationsFilterRequest,
    IPublicationsFilterResponse,
} from "../../models/IPublication";
import { fetchPublications } from "../../api/publications";

import styles from "./Publication.module.scss";
import BookCard from "../BookCard/BookCard";

interface PublicationsSectionProps {
    title: string;
    requestParams: IPublicationsFilterRequest;
    onChangeTotal?: (total: number) => void;
    fetcher?: (params: any) => Promise<IPublicationsFilterResponse>;
}

export default function PublicationsSection({
    title,
    requestParams,
    onChangeTotal,
    fetcher = fetchPublications, // 👈 по умолчанию обычные публикации
}: PublicationsSectionProps) {
    const [items, setItems] = useState<IPublication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);

            try {
                const data: IPublicationsFilterResponse = await fetcher(requestParams); // 👈 тут используем fetcher

                if (cancelled) return;

                setItems(data.items || []);
                onChangeTotal?.(data.total || 0);
            } catch {
                if (cancelled) return;
                setItems([]);
                onChangeTotal?.(0);
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [fetcher, JSON.stringify(requestParams)]);

    const showEmpty = !loading && items.length === 0;

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>{title}</h2>

            <div className={styles.grid}>
                {showEmpty ? (
                    <div className={styles.placeholder}>Ничего не найдено</div>
                ) : (
                    items.map((pub) => <BookCard key={pub.id} book={pub} />)
                )}
            </div>
        </section>
    );
}
