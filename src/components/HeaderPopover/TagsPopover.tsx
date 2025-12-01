import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTags } from "../../api/tags";
import type { ITag } from "../../models/ITag";
import headerStyles from "./Popovers.module.scss";

type Props = { open: boolean; onClose: () => void; top?: number };

export default function TagsPopover({ open, onClose, top = 5 }: Props) {
    const navigate = useNavigate();
    const [items, setItems] = useState<ITag[]>([]);

    useEffect(() => {
        if (!open) return;
        getTags()
            .then((data) => setItems(data || []))
            .catch(() => setItems([]));
    }, [open]);

    if (!open) return null;

    return (
        <div className={headerStyles.popover}>
            <div className={headerStyles.popoverList}>
                {items.slice(0, top).map((t) => (
                    <div key={t.id} className={headerStyles.popoverRow}>
                        <span className={headerStyles.bullet}>•</span>
                        <a
                            href={`/allPublications?tag=${t.id}`}
                            className={headerStyles.popoverLink}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                navigate(`/allPublications?tag=${t.id}`);
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
