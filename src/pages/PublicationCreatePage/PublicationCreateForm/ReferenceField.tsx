import React from "react";
import styles from "./PublicationCreateForm.module.scss";
import { SelectSearchedAdd } from "@/ui";

export type RefItem = { id: number; name: string };
export type RefEntity = { id: number; name: string };

type Option = { value: string; label: string };

export default function ReferenceField(props: {
    label: string;

    value: RefItem[];
    onAdd: (item: RefItem) => void;
    onRemoveById: (id: number) => void;

    all: RefEntity[];
    setAll: React.Dispatch<React.SetStateAction<RefEntity[]>>;

    createFn: (name: string) => Promise<RefEntity>;
    deleteFn: (id: number) => Promise<boolean>;

    notify: (type: "success" | "error", message: string) => void;

    messages: {
        addSuccess: string;
        addError: string;
        deleteSuccess: string;
        deleteError: string;
        deleteNotOk: string;
    };
}) {
    const { label, value, onAdd, onRemoveById, all, setAll, createFn, deleteFn, notify, messages } =
        props;

    const options = React.useMemo(
        () =>
            (all ?? [])
                .filter((x) => x && Number.isFinite(x.id) && String(x.name ?? "").trim())
                .map((x) => ({ value: String(x.id), label: x.name.trim() })),
        [all],
    );

    const handlePick = React.useCallback(
        (val: string) => {
            const id = Number(val);
            if (!Number.isFinite(id) || !id) return;

            const found = all.find((x) => x.id === id);
            if (!found) return;

            onAdd({ id: found.id, name: found.name });
        },
        [all, onAdd],
    );

    const handleCreate = React.useCallback(
        async (name: string) => {
            const clean = name.trim();
            if (!clean) return { value: "", label: "" };

            try {
                const created = await createFn(clean);

                setAll((prev) =>
                    prev.some((x) => x.id === created.id) ? prev : [...prev, created],
                );
                onAdd({ id: created.id, name: (created.name ?? clean).trim() });

                notify("success", messages.addSuccess);
                return { value: String(created.id), label: created.name ?? clean };
            } catch (e) {
                notify("error", messages.addError);
                throw e;
            }
        },
        [createFn, messages.addError, messages.addSuccess, notify, onAdd, setAll],
    );

    const handleDelete = React.useCallback(
        async (opt: Option) => {
            const id = Number(opt.value);
            if (!Number.isFinite(id) || !id) return;

            try {
                const ok = await deleteFn(id);
                if (!ok) {
                    notify("error", messages.deleteNotOk);
                    return;
                }

                setAll((prev) => prev.filter((x) => x.id !== id));
                onRemoveById(id);

                notify("success", messages.deleteSuccess);
            } catch {
                notify("error", messages.deleteError);
            }
        },
        [
            deleteFn,
            messages.deleteError,
            messages.deleteNotOk,
            messages.deleteSuccess,
            notify,
            onRemoveById,
            setAll,
        ],
    );

    return (
        <>
            <span className={styles.label}>{label}</span>

            <div className={styles.multiField}>
                <div className={styles.chipsRow}>
                    {value.map((x) => (
                        <button
                            key={`${label}-${x.id}`}
                            type="button"
                            className={styles.chip}
                            onClick={() => onRemoveById(x.id)}
                            title="Удалить"
                        >
                            <span>{x.name}</span>
                            <span aria-hidden>×</span>
                        </button>
                    ))}
                </div>

                <SelectSearchedAdd
                    value=""
                    options={options}
                    onChange={handlePick}
                    onCreate={handleCreate}
                    onDelete={handleDelete}
                />
            </div>
        </>
    );
}
