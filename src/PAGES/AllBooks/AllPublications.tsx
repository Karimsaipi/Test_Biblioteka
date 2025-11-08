import { fetchAuthors } from "../../API/author";
import { fetchSubjects } from "../../API/subjects";
import PublicationsSection from "../../COMPONENTS/PublicationSection/PublicationSection";
import {
    IPublicationsFilterRequest,
    PublicationsSortBy,
    PublicationsSortOrder,
    PublicationType,
} from "../../models/IPublication";
import MySelect from "../../UI/Select/MySelect";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./AllPublications.module.scss";
import SortSelect from "../../UI/SelectSort/SelectSort";
import Pagination from "../../UI/Pagination/Pagination";

const PAGE_SIZE = 8;

interface SelectOption {
    value: string;
    label: string;
}

const typeOptions: SelectOption[] = [
    { value: String(PublicationType.книга), label: "Книга" },
    { value: String(PublicationType.статья), label: "Статья" },
    { value: String(PublicationType.альбом), label: "Альбом" },
    { value: String(PublicationType.атлас), label: "Атлас" },
    { value: String(PublicationType.руководство), label: "Руководство" },
    { value: String(PublicationType.справочник), label: "Справочник" },
    { value: String(PublicationType.пособие), label: "Пособие" },
];

export default function AllPublications() {
    const [typeValue, setTypeValue] = useState("");
    const [authorValue, setAuthorValue] = useState("");
    const [subjectValue, setSubjectValue] = useState("");

    // options из отдельных запросов
    const [authorOptions, setAuthorOptions] = useState<SelectOption[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<SelectOption[]>([]);

    const [sortBy, setSortBy] = useState(PublicationsSortBy.CREATION_DATE);
    const [sortOrder, setSortOrder] = useState(PublicationsSortOrder.DESC);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const resetPage = () => setPage(1);

    useEffect(() => {
        fetchAuthors()
            .then((authors) => {
                setAuthorOptions(
                    authors.map((a) => ({
                        value: String(a.id),
                        label: a.name || "",
                    })),
                );
            })
            .catch(() => {
                setAuthorOptions([]);
            });

        fetchSubjects()
            .then((subjects) => {
                setSubjectOptions(
                    subjects.map((s) => ({
                        value: String(s.id),
                        label: s.name,
                    })),
                );
            })
            .catch(() => {
                setSubjectOptions([]);
            });
    }, []);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeValue(e.target.value);
        resetPage();
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAuthorValue(e.target.value);
        resetPage();
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubjectValue(e.target.value);
        resetPage();
    };

    const requestParams: IPublicationsFilterRequest = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
            sortBy,
            sortOrder,
            type: typeValue ? [Number(typeValue) as PublicationType] : [],
            authors: authorValue ? [Number(authorValue)] : [],
            subjects: subjectValue ? [Number(subjectValue)] : [],
            tags: [],
        }),
        [page, sortBy, sortOrder, typeValue, authorValue, subjectValue],
    );

    const totalPages = PAGE_SIZE > 0 ? Math.ceil(total / PAGE_SIZE) : 0;

    return (
        <div className={styles.main}>
            {/* Фильтры */}
            <div className={styles.filters}>
                <MySelect
                    label="Тип"
                    value={typeValue}
                    onChange={handleTypeChange}
                    options={typeOptions}
                />

                <MySelect
                    label="Автор"
                    value={authorValue}
                    onChange={handleAuthorChange}
                    options={authorOptions}
                />

                <MySelect
                    label="Предмет"
                    value={subjectValue}
                    onChange={handleSubjectChange}
                    options={subjectOptions}
                />
            </div>

            <div className={styles.sortRow}>
                <SortSelect
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onChange={(newSortBy, newSortOrder) => {
                        setSortBy(newSortBy);
                        setSortOrder(newSortOrder);
                        setPage(1);
                    }}
                />
            </div>

            <PublicationsSection
                title="Все публикации"
                requestParams={requestParams}
                onChangeTotal={setTotal}
            />

            <div className={styles.pagination}>
                <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
            </div>
        </div>
    );
}
