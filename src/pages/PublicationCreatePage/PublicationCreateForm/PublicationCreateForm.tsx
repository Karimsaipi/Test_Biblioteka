import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { show } from "@/store/NotifySlice/notifySlice";

import { createPublication } from "@/api/publications";
import { createAuthor, deleteAuthor, getAuthors } from "@/api/author";
import { createTag, deleteTag, getTags } from "@/api/tags";
import { createSubject, deleteSubject, getSubjects } from "@/api/subjects";

import styles from "./PublicationCreateForm.module.scss";
import { ICreatePublicationReqBody, PublicationType } from "@/models/IPublication";
import type { ITag } from "@/models/ITag";
import type { IAuthor } from "@/models/IAuthor";
import type { ISubject } from "@/models/ISubject";

import { AssetButton, BaseButton, BaseInput, BaseSelect } from "@/ui";
import ReferenceField, { RefItem } from "./ReferenceField";

interface FormState {
    type: PublicationType;
    title: string;
    review: string;
    releaseDate: string;
    cover: File | null;
    file: File | null;
    authors: RefItem[];
    subjects: RefItem[];
    tags: RefItem[];
}

type FormErrors = Partial<Record<keyof FormState, string>>;

type RefField = "authors" | "subjects" | "tags";

const norm = (s: unknown) =>
    String(s ?? "")
        .trim()
        .toLowerCase();

export default function PublicationCreateForm() {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<FormState>({
        type: PublicationType.книга,
        title: "",
        review: "",
        releaseDate: "",
        cover: null,
        file: null,
        authors: [],
        subjects: [],
        tags: [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [allSubjects, setAllSubjects] = useState<ISubject[]>([]);
    const [allAuthors, setAllAuthors] = useState<IAuthor[]>([]);
    const [allTags, setAllTags] = useState<ITag[]>([]);

    useEffect(() => {
        const safe = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
            try {
                return await p;
            } catch {
                return fallback;
            }
        };

        (async () => {
            const [authors, subjects, tags] = await Promise.all([
                safe(getAuthors(), [] as IAuthor[]),
                safe(getSubjects(), [] as ISubject[]),
                safe(getTags(), [] as ITag[]),
            ]);

            setAllAuthors(authors);
            setAllSubjects(subjects);
            setAllTags(tags);
        })();
    }, []);

    const notify = (type: "success" | "error", message: string) => {
        dispatch(show({ type, message }));
    };

    const handleTextChange =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, type: Number(e.target.value) as PublicationType }));
    };

    const handleCoverSelected = (files: FileList) => {
        setFormData((prev) => ({ ...prev, cover: files[0] ?? null }));
    };

    const handleFileSelected = (files: FileList) => {
        setFormData((prev) => ({ ...prev, file: files[0] ?? null }));
    };

    const addItem = (field: RefField, item: RefItem) => {
        const name = item.name.trim();
        if (!name) return;

        setFormData((prev) => {
            const current = prev[field];
            if (current.some((x) => x.id === item.id)) return prev;
            return { ...prev, [field]: [...current, { id: item.id, name }] };
        });
    };

    const removeById = (field: RefField, id: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((x) => x.id !== id),
        }));
    };

    const validate = () => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = "error";
        if (!formData.review.trim()) newErrors.review = "error";
        if (!formData.releaseDate.trim()) newErrors.releaseDate = "error";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createPublication(buildPublicationPayload(formData));
            dispatch(show({ type: "success", message: "Отправлена на рассмотрение" }));
        } catch {
            dispatch(show({ type: "error", message: "Ошибка при отправке публикации" }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Левая колонка */}
            <div className={styles.left}>
                <span className={styles.label}>Тип</span>
                <BaseSelect
                    label=""
                    value={String(formData.type)}
                    onChange={handleTypeChange}
                    options={[
                        { value: String(PublicationType.книга), label: "Книга" },
                        { value: String(PublicationType.статья), label: "Статья" },
                        { value: String(PublicationType.альбом), label: "Альбом" },
                        { value: String(PublicationType.атлас), label: "Атлас" },
                        { value: String(PublicationType.руководство), label: "Руководство" },
                        { value: String(PublicationType.справочник), label: "Справочник" },
                        { value: String(PublicationType.пособие), label: "Пособие" },
                    ]}
                />

                <span className={styles.label}>Название</span>
                <BaseInput
                    label=""
                    value={formData.title}
                    onChange={handleTextChange("title")}
                    error={errors.title}
                />

                {/* АВТОРЫ */}

                <ReferenceField
                    label="Автор(ы)"
                    value={formData.authors}
                    onAdd={(item) => addItem("authors", item)}
                    onRemoveById={(id) => removeById("authors", id)}
                    all={allAuthors}
                    setAll={setAllAuthors}
                    createFn={createAuthor}
                    deleteFn={deleteAuthor}
                    notify={notify}
                    messages={{
                        addSuccess: "Автор добавлен",
                        addError: "Не удалось добавить автора",
                        deleteSuccess: "Автор удалён",
                        deleteError: "Ошибка при удалении автора",
                        deleteNotOk: "Не удалось удалить автора",
                    }}
                />

                <span className={styles.label}>Год</span>
                <BaseInput
                    label=""
                    value={formData.releaseDate}
                    onChange={handleTextChange("releaseDate")}
                    error={errors.releaseDate}
                />

                <div className={styles.buttons}>
                    <span className={styles.buttonsLabel}>Прикрепить файл</span>
                    <AssetButton
                        size={40}
                        style={{ maxWidth: "40px" }}
                        multiple={false}
                        onFilesSelected={handleFileSelected}
                    />
                    <BaseButton className={styles.button} type="button">
                        Написать здесь
                    </BaseButton>
                </div>

                <div className={styles.fieldRow}>
                    <span className={styles.buttonsLabel}>Обложка</span>
                    <AssetButton
                        size={40}
                        multiple={false}
                        accept="image/*"
                        onFilesSelected={handleCoverSelected}
                    />
                </div>
            </div>

            {/* Правая колонка */}
            <div className={styles.right}>
                {/* ТЕГИ */}
                <ReferenceField
                    label="Теги"
                    value={formData.tags}
                    onAdd={(item) => addItem("tags", item)}
                    onRemoveById={(id) => removeById("tags", id)}
                    all={allTags}
                    setAll={setAllTags}
                    createFn={createTag}
                    deleteFn={deleteTag}
                    notify={notify}
                    messages={{
                        addSuccess: "Тег добавлен",
                        addError: "Не удалось добавить тег",
                        deleteSuccess: "Тег удалён",
                        deleteError: "Ошибка при удалении тега",
                        deleteNotOk: "Не удалось удалить тег",
                    }}
                />

                {/* ПРЕДМЕТЫ */}
                <ReferenceField
                    label="Предметы"
                    value={formData.subjects}
                    onAdd={(item) => addItem("subjects", item)}
                    onRemoveById={(id) => removeById("subjects", id)}
                    all={allSubjects}
                    setAll={setAllSubjects}
                    createFn={createSubject}
                    deleteFn={deleteSubject}
                    notify={notify}
                    messages={{
                        addSuccess: "Предмет добавлен",
                        addError: "Не удалось добавить предмет",
                        deleteSuccess: "Предмет удалён",
                        deleteError: "Ошибка при удалении предмета",
                        deleteNotOk: "Не удалось удалить предмет",
                    }}
                />

                <span className={styles.label}>О книге</span>
                <BaseInput
                    label=""
                    value={formData.review}
                    onChange={handleTextChange("review")}
                    error={errors.review}
                    className={styles.reviewInput}
                />

                <span className={styles.info}>
                    Публикация будет размещена после одобрения администрацией
                </span>
            </div>

            <BaseButton variant="primary" type="submit" className={styles.submitButton}>
                Отправить на рассмотрение
            </BaseButton>
        </form>
    );
}

function buildPublicationPayload(form: FormState): ICreatePublicationReqBody {
    const year = form.releaseDate.trim();

    return {
        type: form.type,
        title: form.title.trim(),
        review: form.review.trim(),
        releaseDate: year ? `${year}-01-01` : "",
        cover: form.cover,
        file: form.file,
        authors: form.authors,
        subjects: form.subjects,
        tags: form.tags,
    };
}
