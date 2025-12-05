import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerStyles from "./Popover.module.scss";

type PopoverItem = { id: number | string; name: string };

type Props = {
    open: boolean;
    onClose: () => void;
    fetchItems: () => Promise<PopoverItem[]>; // getSubjects или getTags
    queryParamName: string; // 'subject' или 'tag'
};

export default function Popover({ open, onClose, fetchItems, queryParamName }: Props) {
    const navigate = useNavigate();
    const [items, setItems] = useState<PopoverItem[]>([]);

    useEffect(() => {
        if (!open) return;
        fetchItems()
            .then((data) => setItems(data || []))
            .catch(() => setItems([]));
    }, [open, fetchItems]);

    if (!open) return null;

    const top = 5;

    return (
        <div className={headerStyles.popover}>
            <div className={headerStyles.popoverList}>
                {items.slice(0, top).map((it) => (
                    <div key={it.id} className={headerStyles.popoverRow}>
                        <span className={headerStyles.bullet}>•</span>
                        <a
                            href={`/allPublications?${queryParamName}=${it.id}`}
                            className={headerStyles.popoverLink}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                navigate(`/allPublications?${queryParamName}=${it.id}`);
                            }}
                        >
                            {it.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
