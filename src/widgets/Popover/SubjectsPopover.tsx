import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "@/api/subjects";
import type { ISubject } from "@/models/ISubject";
import headerStyles from "./Popover.module.scss";

type Props = { open: boolean; onClose: () => void; top?: number };

export default function SubjectsPopover({ open, onClose, top = 5 }: Props) {
    const navigate = useNavigate();
    const [items, setItems] = useState<ISubject[]>([]);

    useEffect(() => {
        if (!open) return;
        getSubjects()
            .then((data) => setItems(data || []))
            .catch(() => setItems([]));
    }, [open]);

    if (!open) return null;

    return (
        <div className={headerStyles.popover}>
            <div className={headerStyles.popoverList}>
                {items.slice(0, top).map((s) => (
                    <div key={s.id} className={headerStyles.popoverRow}>
                        <span className={headerStyles.bullet}>•</span>
                        <a
                            href={`/allPublications?subject=${s.id}`}
                            className={headerStyles.popoverLink}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                navigate(`/allPublications?subject=${s.id}`);
                            }}
                        >
                            {s.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
