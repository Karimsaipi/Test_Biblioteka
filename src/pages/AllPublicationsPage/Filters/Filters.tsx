import React from "react";
import styles from "./Filters.module.scss";
import { SelectSearchedAdd } from "@/ui";

export type SelectOption = {
    value: string;
    label: string;
};

type Props = {
    typeValue: string[];
    authorValue: string[];
    subjectValue: string[];

    typeOptions: SelectOption[];
    authorOptions: SelectOption[];
    subjectOptions: SelectOption[];

    onTypeChange: (values: string[]) => void;
    onAuthorChange: (values: string[]) => void;
    onSubjectChange: (values: string[]) => void;
};

export default function Filters({
    typeValue,
    authorValue,
    subjectValue,
    typeOptions,
    authorOptions,
    subjectOptions,
    onTypeChange,
    onAuthorChange,
    onSubjectChange,
}: Props) {
    // Добавление чипса
    const handlePick = (value: string, selected: string[], onChange: (v: string[]) => void) => {
        if (!value || selected.includes(value)) return;
        onChange([...selected, value]);
    };

    // Удаление чипса
    const handleRemove = (value: string, selected: string[], onChange: (v: string[]) => void) => {
        onChange(selected.filter((v) => v !== value));
    };

    // Универсальный рендер для select + чипсы
    const renderMultiSelect = (
        label: string,
        selected: string[],
        options: SelectOption[],
        onChange: (v: string[]) => void,
    ) => (
        <div className={styles.multiField}>
            <span className={styles.label}>{label}</span>

            <div className={styles.chipsRow}>
                {selected.map((val) => {
                    const optLabel = options.find((o) => o.value === val)?.label ?? val;
                    return (
                        <button
                            key={`${label}-${val}`}
                            type="button"
                            className={styles.chip}
                            onClick={() => handleRemove(val, selected, onChange)}
                        >
                            <span>{optLabel}</span>
                            <span aria-hidden>×</span>
                        </button>
                    );
                })}
            </div>

            <SelectSearchedAdd
                value=""
                options={options}
                onChange={(val) => handlePick(val, selected, onChange)}
                searchPlaceholder='Поиск...'
            />
        </div>
    );

    return (
        <div className={styles.filters}>
            {renderMultiSelect("Тип", typeValue, typeOptions, onTypeChange)}
            {renderMultiSelect("Автор", authorValue, authorOptions, onAuthorChange)}
            {renderMultiSelect("Предмет", subjectValue, subjectOptions, onSubjectChange)}
        </div>
    );
}
