import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISubject } from "../../models/ISubject";
import { getSubjects } from "../../api/subjects";
import headerStyles from "./Popovers.module.scss";

type Props = { open: boolean; onClose: () => void; top?: number };

export default function SubjectsPopover({ open, onClose, top = 5 }: Props) {
    const navigate = useNavigate();
    const [items, setItems] = useState<ISubject[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!open || loaded) return;
        let cancelled = false;

        (async () => {
            try {
                const data = await getSubjects();
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
    if (!loaded) return null;
    if (!topItems.length) return null;

    return (
        <div className={headerStyles.popover}>
            <div className={headerStyles.popoverList}>
                {topItems.map((s) => (
                    <div key={s.id} className={headerStyles.popoverRow}>
                        <span className={headerStyles.bullet}>•</span>
                        <a
                            href={`/allPublications?subject=${s.id}`}
                            className={headerStyles.popoverLink}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                navigate(
                                    `/allPublications?subject=${encodeURIComponent(String(s.id))}`,
                                );
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
