import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSearch.module.scss";
import { searchPublications } from "@/api/publications";
import { PublicationType, type IPublication } from "@/models/IPublication";
import placeholderCover from "@/assets/images/bookImage.png";
import searchIcon from "@/assets/icons/searchIcon.png";
import { toUploadsUrl } from "@/shared/utils/media";
import { SearchInput } from "@/ui";
import { useOnEscape } from "@/shared/hooks/useOnEscape";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { useDebouncedValue } from "@/shared/hooks/useDebounceValue";

function getCoverUrl(coverPath?: string | null): string {
    return coverPath ? toUploadsUrl(coverPath) : placeholderCover;
}

export default function HeaderSearch() {
    const navigate = useNavigate();

    const [q, setQ] = useState("");
    const [results, setResults] = useState<IPublication[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const debouncedQ = useDebouncedValue(q, 400);

    const reset = useCallback(() => {
        setOpen(false);
        setQ("");
        setResults([]);
        setLoading(false);
    }, []);

    useOnEscape(reset, { enabled: open });
    useOnClickOutside(rootRef, reset, { enabled: open });

    useEffect(() => {
        const query = debouncedQ.trim();

        if (query.length < 2) {
            setResults([]);
            setOpen(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        setOpen(true);

        searchPublications(query)
            .then(setResults)
            .catch((e) => {
                setResults([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [debouncedQ]);

    const handleResultClick = (pub: IPublication) => {
        reset();
        navigate(`/publications/${pub.id}`);
    };

    return (
        <form
            className={styles.search}
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Поиск по книгам"
        >
            <div ref={rootRef}>
                <SearchInput
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder=""
                    iconSrc={searchIcon}
                />

                {open && (
                    <div className={styles.searchDropdown}>
                        {loading && <div className={styles.searchEmpty}>Ищем…</div>}

                        {!loading && results.length === 0 && (
                            <div className={styles.searchEmpty}>Ничего не найдено</div>
                        )}

                        {!loading &&
                            results.map((pub) => (
                                <button
                                    key={pub.id}
                                    type="button"
                                    className={styles.searchItem}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleResultClick(pub)}
                                >
                                    <div className={styles.searchItemCover}>
                                        <img src={getCoverUrl(pub.coverPath)} alt={pub.title} />
                                    </div>

                                    <div className={styles.searchItemInfo}>
                                        <div className={styles.searchItemTitle}>{pub.title}</div>
                                        {pub.authors?.length ? (
                                            <div className={styles.searchItemAuthors}>
                                                {pub.authors.map((a) => a.name).join(", ")}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className={styles.searchItemType}>
                                        {PublicationType[pub.type]}
                                    </div>
                                </button>
                            ))}
                    </div>
                )}
            </div>
        </form>
    );
}
