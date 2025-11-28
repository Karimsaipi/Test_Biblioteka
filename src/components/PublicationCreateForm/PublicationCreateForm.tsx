import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createPublication } from "../../api/publications";
import { show } from "../../store/NotifySlice/notifySlice";
import styles from "./PublicationCreateForm.module.scss";

import MyInput from "../../ui/BaseInput/BaseInput";
import MySelect from "../../ui/BaseSelect/BaseSelect";
import AssetButton from "../../ui/AssetButton/AssetButton";
import MyButton from "../../ui/BaseButton/BaseButton";

import { ICreatePublicationReqBody, PublicationType } from "../../models/IPublication";
import { ITag } from "../../models/ITag";
import { IAuthor } from "../../models/IAuthor";
import { ISubject } from "../../models/ISubject";
import { createAuthor, deleteAuthor, getAuthors } from "../../api/author";
import { createTag, deleteTag, getTags } from "../../api/tags";
import { createSubject, deleteSubject, getSubjects } from "../../api/subjects";
import SelectSearchAdd from "../../ui/SelectSearchedAdd/SelectSearchedAdd";

type RefItem = { id: number | null; name: string };

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

    const addItem = (field: "authors" | "subjects" | "tags", item: RefItem) => {
        const name = (item.name ?? "").trim();
        if (!name) return;

        setFormData((prev) => {
            const current = prev[field];
            const key = norm(name);

            if (item.id != null && current.some((x) => x.id === item.id)) return prev;
            if (current.some((x) => norm(x.name) === key)) return prev;

            return { ...prev, [field]: [...current, { id: item.id ?? null, name }] };
        });
    };

    const removeItem = (field: "authors" | "subjects" | "tags", name: string) => {
        const key = norm(name);
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((x) => norm(x.name) !== key),
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

    const makeOptions = (arr: Array<{ id: number | null; name?: string | null }>) =>
        (arr ?? []).flatMap((x) => {
            const label = (x.name ?? "").trim();
            if (!label) return [];
            if (x.id == null) return [];
            return [{ value: String(x.id), label }];
        });

    const pickFromList =
        (
            list: Array<{ id: number | null; name?: string | null }>,
            field: "authors" | "subjects" | "tags",
        ) =>
        (val: string) => {
            const id = Number(val);
            if (!Number.isFinite(id)) return;
            const item = list.find((x) => x.id === id);
            if (!item) return;
            addItem(field, { id: item.id ?? null, name: item.name ?? "" });
        };

    const createAndAdd =
        <T extends { id: number | null; name?: string | null }>(
            field: "authors" | "subjects" | "tags",
            createFn: (name: string) => Promise<T>,
            setAll: React.Dispatch<React.SetStateAction<T[]>>,
        ) =>
        async (name: string) => {
            const clean = name.trim();
            if (!clean) return { value: "", label: "" };

            const created = await createFn(clean);
            setAll((prev) => (prev.some((x) => x.id === created.id) ? prev : [...prev, created]));
            addItem(field, { id: created.id ?? null, name: created.name ?? clean });

            return { value: String(created.id), label: created.name ?? clean };
        };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Левая колонка */}
            <div className={styles.left}>
                <span className={styles.label}>Тип</span>
                <MySelect
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
                <MyInput
                    label=""
                    value={formData.title}
                    onChange={handleTextChange("title")}
                    error={errors.title}
                />

                {/* АВТОРЫ */}
                <span className={styles.label}>Автор(ы)</span>
                <div className={styles.multiField}>
                    <div className={styles.chipsRow}>
                        {formData.authors.map((a) => (
                            <button
                                key={`author-${a.id ?? a.name}`}
                                type="button"
                                className={styles.chip}
                                onClick={() => removeItem("authors", a.name)}
                            >
                                <span className={styles.chipText}>{a.name}</span>
                                <span className={styles.chipRemove}>×</span>
                            </button>
                        ))}
                    </div>

                    <SelectSearchAdd
                        value=""
                        options={makeOptions(allAuthors)}
                        onChange={pickFromList(allAuthors, "authors")}
                        onCreate={async (name) => {
                            try {
                                const opt = await createAndAdd(
                                    "authors",
                                    createAuthor,
                                    setAllAuthors,
                                )(name);
                                dispatch(show({ type: "success", message: "Автор добавлен" }));
                                return opt;
                            } catch (e) {
                                dispatch(
                                    show({ type: "error", message: "Не удалось добавить автора" }),
                                );
                                throw e;
                            }
                        }}
                        onDelete={async (opt) => {
                            const id = Number(opt.value);
                            if (!Number.isFinite(id) || !id) return;

                            try {
                                const ok = await deleteAuthor(id);
                                if (!ok) {
                                    dispatch(
                                        show({
                                            type: "error",
                                            message: "Не удалось удалить автора",
                                        }),
                                    );
                                    return;
                                }

                                setAllAuthors((prev) => prev.filter((a) => a.id !== id));
                                setFormData((prev) => ({
                                    ...prev,
                                    authors: prev.authors.filter((a) => a.id !== id),
                                }));
                                dispatch(show({ type: "success", message: "Автор удалён" }));
                            } catch {
                                dispatch(
                                    show({ type: "error", message: "Ошибка при удалении автора" }),
                                );
                            }
                        }}
                    />
                </div>

                <span className={styles.label}>Год</span>
                <MyInput
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
                    <MyButton className={styles.button} type="button">
                        Написать здесь
                    </MyButton>
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
                <span className={styles.label}>Теги</span>
                <div className={styles.multiField}>
                    <div className={styles.chipsRow}>
                        {formData.tags.map((t) => (
                            <button
                                key={`tag-${t.id ?? t.name}`}
                                type="button"
                                className={styles.chip}
                                onClick={() => removeItem("tags", t.name)}
                            >
                                <span className={styles.chipText}>{t.name}</span>
                                <span className={styles.chipRemove}>×</span>
                            </button>
                        ))}
                    </div>

                    <SelectSearchAdd
                        value=""
                        options={makeOptions(allTags)}
                        onChange={pickFromList(allTags, "tags")}
                        onCreate={async (name) => {
                            try {
                                const opt = await createAndAdd("tags", createTag, setAllTags)(name);
                                dispatch(show({ type: "success", message: "Тег добавлен" }));
                                return opt;
                            } catch (e) {
                                dispatch(
                                    show({ type: "error", message: "Не удалось добавить тег" }),
                                );
                                throw e;
                            }
                        }}
                        onDelete={async (opt) => {
                            const id = Number(opt.value);
                            if (!Number.isFinite(id) || !id) return;

                            try {
                                const ok = await deleteTag(id);
                                if (!ok) {
                                    dispatch(
                                        show({ type: "error", message: "Не удалось удалить тег" }),
                                    );
                                    return;
                                }

                                setAllTags((prev) => prev.filter((t) => t.id !== id));
                                setFormData((prev) => ({
                                    ...prev,
                                    tags: prev.tags.filter((t) => t.id !== id),
                                }));
                                dispatch(show({ type: "success", message: "Тег удалён" }));
                            } catch {
                                dispatch(
                                    show({ type: "error", message: "Ошибка при удалении тега" }),
                                );
                            }
                        }}
                    />
                </div>

                {/* ПРЕДМЕТЫ */}
                <span className={styles.label}>Предметы</span>
                <div className={styles.multiField}>
                    <div className={styles.chipsRow}>
                        {formData.subjects.map((s) => (
                            <button
                                key={`subject-${s.id ?? s.name}`}
                                type="button"
                                className={styles.chip}
                                onClick={() => removeItem("subjects", s.name)}
                            >
                                <span className={styles.chipText}>{s.name}</span>
                                <span className={styles.chipRemove}>×</span>
                            </button>
                        ))}
                    </div>

                    <SelectSearchAdd
                        value=""
                        options={makeOptions(allSubjects)}
                        onChange={pickFromList(allSubjects, "subjects")}
                        onCreate={async (name) => {
                            try {
                                const opt = await createAndAdd(
                                    "subjects",
                                    createSubject,
                                    setAllSubjects,
                                )(name);
                                dispatch(show({ type: "success", message: "Предмет добавлен" }));
                                return opt;
                            } catch (e) {
                                dispatch(
                                    show({ type: "error", message: "Не удалось добавить предмет" }),
                                );
                                throw e;
                            }
                        }}
                        onDelete={async (opt) => {
                            const id = Number(opt.value);
                            if (!Number.isFinite(id) || !id) return;

                            try {
                                const ok = await deleteSubject(id);
                                if (!ok) {
                                    dispatch(
                                        show({
                                            type: "error",
                                            message: "Не удалось удалить предмет",
                                        }),
                                    );
                                    return;
                                }

                                setAllSubjects((prev) => prev.filter((s) => s.id !== id));
                                setFormData((prev) => ({
                                    ...prev,
                                    subjects: prev.subjects.filter((s) => s.id !== id),
                                }));
                                dispatch(show({ type: "success", message: "Предмет удалён" }));
                            } catch {
                                dispatch(
                                    show({
                                        type: "error",
                                        message: "Ошибка при удалении предмета",
                                    }),
                                );
                            }
                        }}
                    />
                </div>

                <span className={styles.label}>О книге</span>
                <MyInput
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

            <MyButton variant="primary" type="submit" className={styles.submitButton}>
                Отправить на рассмотрение
            </MyButton>
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
