import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITag } from "../../models/ITag";
import { getTags } from "../../api/tags";
import headerStyles from "../Header/Header.module.scss";

type Props = { open: boolean; onClose: () => void; top?: number };

export default function TagsPopover({ open, onClose, top = 5 }: Props) {
    const navigate = useNavigate();
    const [items, setItems] = useState<ITag[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!open || loaded) return;
        let cancelled = false;

        (async () => {
            try {
                const data = await getTags();
                if (!cancelled) {
                    setItems(data || []);
                    setLoaded(true);
                }
            } catch {
                if (!cancelled) {
                    setItems([]);
                    setLoaded(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, loaded]);

    const topItems = useMemo(() => items.slice(0, top), [items, top]);

    if (!open) return null;
    if (!loaded) return null; // пока грузим — ничего
    if (!topItems.length) return null; // пусто — тоже ничего

    return (
        <div className={headerStyles.popover}>
            <div className={headerStyles.popoverList}>
                {topItems.map((t) => (
                    <div key={t.id} className={headerStyles.popoverRow}>
                        <span className={headerStyles.bullet}>•</span>
                        <a
                            href={`/allPublications?tag=${t.id}`}
                            className={headerStyles.popoverLink}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                navigate(
                                    `/allPublications?tag=${encodeURIComponent(String(t.id))}`,
                                );
                            }}
                        >
                            {t.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
