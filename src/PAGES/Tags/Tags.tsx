import React, { useEffect, useState } from "react";
import styles from "./Tags.module.scss";
import { ITag } from "../../models/ITag";
import { fetchTags } from "../../api/tags";
import SearchInput from "../../UI/SearchInput/SearchInput";
import searchIcon from "../../assets/icons/searchIcon.png";
import { useNavigate } from "react-router-dom";

interface TagsProps {
    onChangeTotal?: (total: number) => void;
}

export default function Tags({ onChangeTotal }: TagsProps) {
    const [items, setItems] = useState<ITag[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchTags();
                if (cancelled) return;
                setItems(data || []);
                onChangeTotal?.(data?.length || 0);
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
    }, [onChangeTotal]);

    const normalizedSearch = search.trim().toLowerCase();

    const filteredItems = normalizedSearch
        ? items.filter((tag) => tag.name.toLowerCase().includes(normalizedSearch))
        : items;

    const showEmpty = !loading && items.length === 0;

    const handleTagClick = (tagId: number) => {
        navigate(`/allPublications?tag=${tagId}`);
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>
                Тэги
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по тэгу"
                    iconSrc={searchIcon}
                />
            </h2>

            <div className={styles.grid}>
                {showEmpty ? (
                    <div className={styles.placeholder}>Ничего не найдено</div>
                ) : (
                    filteredItems.map((tag) => (
                        <div className={styles.tag} key={tag.id}>
                            <span className={styles.bullet}>•</span>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleTagClick(tag.id);
                                }}
                                className={styles.tagText}
                            >
                                {tag.name}
                            </a>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
