import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSearch.module.scss";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { searchPublications } from "../../api/publications";
import { PublicationType, type IPublication } from "../../models/IPublication";
import placeholderCover from "../../assets/images/bookImage.png";
import searchIcon from "../../assets/icons/searchIcon.png";
import { toUploadsUrl } from "../../utils/media";

function getCoverUrl(coverPath?: string | null): string {
    return coverPath ? toUploadsUrl(coverPath) : placeholderCover;
}

export default function HeaderSearch() {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [results, setResults] = useState<IPublication[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // дебаунс-поиск
    useEffect(() => {
        const query = q.trim();

        if (query.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        setOpen(true);

        const id = setTimeout(async () => {
            try {
                const items = await searchPublications(query);
                console.log("SEARCH RESULTS:", items);
                setResults(items);
            } catch (e) {
                console.error("search error", e);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(id);
    }, [q]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = q.trim();
        if (!v) return;
        // navigate(`/search?q=${encodeURIComponent(v)}`);
    };

    const handleResultClick = (pub: IPublication) => {
        setOpen(false);
        setQ("");
        navigate(`/publications/${pub.id}`);
    };

    return (
        <form
            className={styles.search}
            onSubmit={onSubmit}
            role="search"
            aria-label="Поиск по книгам"
        >
            <div className={styles.searchInner}>
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
                                        {pub.authors && pub.authors.length > 0 && (
                                            <div className={styles.searchItemAuthors}>
                                                {pub.authors.map((a) => a.name).join(", ")}
                                            </div>
                                        )}
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
