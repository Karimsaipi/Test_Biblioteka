import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./AllPublications.module.scss";

import { getAuthors } from "../../api/author";
import { getSubjects } from "../../api/subjects";

import {
    IPublicationsFilterReqBody,
    PublicationsSortBy,
    PublicationsSortOrder,
    PublicationType,
} from "../../models/IPublication";

import SortSelect from "../../ui/SelectSort/SelectSort";
import Pagination from "../../ui/Pagination/Pagination";
import PublicationsSection from "../../components/PublicationSection/PublicationSection";
import AllPublicationsFilters, { type SelectOption } from "./AllPublicationsFilter/AllPublicationsFilter";


const PAGE_SIZE = 8;

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
    const [searchParams] = useSearchParams();
    const initialTag = searchParams.get("tag") || "";
    const initialSubject = searchParams.get("subject") || "";

    const [typeValue, setTypeValue] = useState("");
    const [authorValue, setAuthorValue] = useState("");
    const [subjectValue, setSubjectValue] = useState(initialSubject);
    const [tagValue, setTagValue] = useState(initialTag);

    const [authorOptions, setAuthorOptions] = useState<SelectOption[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<SelectOption[]>([]);

    const [sortBy, setSortBy] = useState(PublicationsSortBy.CREATION_DATE);
    const [sortOrder, setSortOrder] = useState(PublicationsSortOrder.DESC);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const resetPage = () => setPage(1);

    useEffect(() => {
        getAuthors()
            .then((authors) => {
                setAuthorOptions(
                    (authors ?? []).map((a) => ({
                        value: String(a.id),
                        label: a.name || "",
                    })),
                );
            })
            .catch(() => {
                setAuthorOptions([]);
            });

        getSubjects()
            .then((subjects) => {
                setSubjectOptions(
                    (subjects ?? []).map((s) => ({
                        value: String(s.id),
                        label: s.name || "",
                    })),
                );
            })
            .catch(() => {
                setSubjectOptions([]);
            });
    }, []);

    useEffect(() => {
        const urlTag = searchParams.get("tag") || "";
        const urlSubject = searchParams.get("subject") || "";

        setTagValue(urlTag);
        setSubjectValue(urlSubject);
        setPage(1);
    }, [searchParams]);

    const requestParams: IPublicationsFilterReqBody = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
            sortBy,
            sortOrder,
            type: typeValue ? [Number(typeValue) as PublicationType] : [],
            authors: authorValue ? [Number(authorValue)] : [],
            subjects: subjectValue ? [Number(subjectValue)] : [],
            tags: tagValue ? [Number(tagValue)] : [],
        }),
        [page, sortBy, sortOrder, typeValue, authorValue, subjectValue, tagValue],
    );

    const totalPages = PAGE_SIZE > 0 ? Math.ceil(total / PAGE_SIZE) : 0;

    return (
        <div className={styles.main}>
            <AllPublicationsFilters
                typeValue={typeValue}
                authorValue={authorValue}
                subjectValue={subjectValue}
                typeOptions={typeOptions}
                authorOptions={authorOptions}
                subjectOptions={subjectOptions}
                onTypeChange={(value) => {
                    setTypeValue(value);
                    resetPage();
                }}
                onAuthorChange={(value) => {
                    setAuthorValue(value);
                    resetPage();
                }}
                onSubjectChange={(value) => {
                    setSubjectValue(value);
                    resetPage();
                }}
            />

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
