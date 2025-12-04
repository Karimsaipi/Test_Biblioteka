import React, { useMemo, useRef, useState } from "react";
import styles from "./BaseSelect.module.scss";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { useOnEscape } from "@/shared/hooks/useOnEscape";

interface BaseSelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    error?: string;
}

export default function BaseSelect({ label, value, onChange, options, error }: BaseSelectProps) {
    const [focused, setFocused] = useState(false);
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const selectedLabel = useMemo(
        () => options.find((o) => o.value === value)?.label ?? "",
        [options, value],
    );

    useOnClickOutside(
        rootRef,
        () => {
            setOpen(false);
            setFocused(false);
        },
        { enabled: open },
    );

    useOnEscape(
        () => {
            setOpen(false);
            setFocused(false);
        },
        { enabled: open },
    );

    const pick = (nextValue: string) => {
        const fake = {
            target: { value: nextValue },
        } as any as React.ChangeEvent<HTMLSelectElement>;
        onChange(fake);
        setOpen(false);
    };

    return (
        <div ref={rootRef} className={styles.wrapper}>
            <button
                type="button"
                className={`${styles.select} ${error ? styles.selectError : ""} ${open ? styles.selectOpen : ""}`}
                onClick={() => setOpen((v) => !v)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                {selectedLabel}
            </button>

            <label
                className={`${styles.label} ${focused || value ? styles.labelActive : ""} ${
                    error ? styles.labelError : ""
                }`}
            >
                {label}
            </label>

            {open && (
                <div className={styles.dropdown}>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""}`}
                            onClick={() => pick(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
