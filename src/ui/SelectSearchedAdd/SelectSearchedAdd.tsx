import React, { useRef, useState } from "react";
import styles from "./SelectSearchedAdd.module.scss";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { useOnEscape } from "@/shared/hooks/useOnEscape";

type Opt = { value: string; label: string };

interface SelectSearchAddProps {
    value: string;
    onChange: (value: string) => void;
    options: Opt[];
    placeholder?: string;
    searchPlaceholder?: string;
    onCreate?: (name: string) => Promise<Opt>;
    onDelete?: (opt: Opt) => Promise<void> | void;
}

export default function SelectSearchAdd({
    value,
    onChange,
    options,
    searchPlaceholder = "Поиск…",
    onCreate,
    onDelete,
}: SelectSearchAddProps) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");

    const rootRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(
        rootRef,
        () => {
            setOpen(false);
            setQ("");
        },
        { enabled: open },
    );

    useOnEscape(
        () => {
            setOpen(false);
            setQ("");
        },
        { enabled: open },
    );

    const norm = (s: unknown) =>
        String(s ?? "")
            .toLowerCase()
            .trim();

    const safe = (options ?? []).filter((o) => o && o.value != null);
    const selectedLabel = safe.find((o) => o.value === value)?.label ?? "";

    const query = norm(q);
    const filtered = query ? safe.filter((o) => norm(o.label).includes(query)) : safe;
    const exactExists = query ? safe.some((o) => norm(o.label) === query) : false;

    const pick = (next: string) => {
        onChange(next);
        setOpen(false);
        setQ("");
    };

    const create = async () => {
        if (!onCreate) return;
        const name = q.trim();
        if (!name || exactExists) return;

        const created = await onCreate(name);
        pick(created.value);
    };

    const del = async (opt: Opt) => {
        if (!onDelete) return;
        await onDelete(opt);
        if (opt.value === value) onChange("");
    };

    return (
        <div ref={rootRef} className={`${styles.wrapper} ${open ? styles.wrapperOpen : ""}`}>
            <button
                type="button"
                className={`${styles.select} ${open ? styles.selectOpen : ""}`}
                onClick={() => setOpen((v) => !v)}
            >
                {selectedLabel}
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <div className={styles.searchBox}>
                        <input
                            className={styles.searchInput}
                            value={q}
                            placeholder={searchPlaceholder}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    {filtered.map((opt) => (
                        <div key={opt.value} className={styles.optionRow}>
                            <button
                                type="button"
                                className={`${styles.option} ${
                                    opt.value === value ? styles.optionSelected : ""
                                }`}
                                onClick={() => pick(opt.value)}
                            >
                                {opt.label}
                            </button>

                            {onDelete && (
                                <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    title="Удалить"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        del(opt);
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    {onCreate && q.trim() && !exactExists && (
                        <button
                            type="button"
                            className={`${styles.option} ${styles.optionSelected}`}
                            onClick={create}
                        >
                            Создать тег: {q.trim()}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
