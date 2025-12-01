import React from "react";
import styles from "../AllPublications.module.scss";
import BaseSelect from "../../../ui/BaseSelect/BaseSelect";

export type SelectOption = {
    value: string;
    label: string;
};

type Props = {
    typeValue: string;
    authorValue: string;
    subjectValue: string;

    typeOptions: SelectOption[];
    authorOptions: SelectOption[];
    subjectOptions: SelectOption[];

    onTypeChange: (value: string) => void;
    onAuthorChange: (value: string) => void;
    onSubjectChange: (value: string) => void;
};

export default function AllPublicationsFilters({
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
    return (
        <div className={styles.filters}>
            <BaseSelect
                label="Тип"
                value={typeValue}
                onChange={(e) => onTypeChange(e.target.value)}
                options={typeOptions}
            />

            <BaseSelect
                label="Автор"
                value={authorValue}
                onChange={(e) => onAuthorChange(e.target.value)}
                options={authorOptions}
            />

            <BaseSelect
                label="Предмет"
                value={subjectValue}
                onChange={(e) => onSubjectChange(e.target.value)}
                options={subjectOptions}
            />
        </div>
    );
}
