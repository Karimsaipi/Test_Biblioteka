import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createPublication } from "../../api/publications";
import { show } from "../../store/notifySlice";
import styles from "./PublicationCreateForm.module.scss";

import MyInput from "../../UI/Input/MyInput";
import MySelect from "../../UI/Select/MySelect";
import AssetButton from "../../UI/AssetButton/AssetButton";
import MyButton from "../../UI/BaseButton/BaseButton";

import { ICreatePublicationRequest, PublicationType } from "../../models/IPublication";
import { ITag } from "../../models/ITag";
import { IAuthor } from "../../models/IAuthor";
import { ISubject } from "../../models/ISubject";
import { fetchAuthors } from "../../api/author";
import { fetchTags } from "../../api/tags";
import { fetchSubjects } from "../../api/subjects";

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

export default function PublicationCreateForm() {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
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
        fetchAuthors()
            .then((authors) => setAllAuthors(authors))
            .catch(() => setAllAuthors([]));

        fetchSubjects()
            .then((subjects) => setAllSubjects(subjects))
            .catch(() => setAllSubjects([]));

        fetchTags()
            .then((tags) => setAllTags(tags))
            .catch(() => setAllTags([]));
    }, []);

    // --- helpers ---

    const handleTextChange =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            setFormData((prev) => ({ ...prev, [field]: value }));
        };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value) as PublicationType;
        setFormData((prev) => ({ ...prev, type: value }));
    };

    const handleCoverSelected = (files: FileList) => {
        const file = files[0] ?? null;
        setFormData((prev) => ({ ...prev, cover: file }));
    };

    const handleFileSelected = (files: FileList) => {
        const file = files[0] ?? null;
        setFormData((prev) => ({ ...prev, file }));
    };

    // универсальное добавление/удаление
    const addItem = (field: "authors" | "subjects" | "tags", item: RefItem) => {
        setFormData((prev) => {
            const current = prev[field];
            // не дублируем по имени
            if (current.some((x) => x.name.toLowerCase() === item.name.toLowerCase())) {
                return prev;
            }
            return {
                ...prev,
                [field]: [...current, item],
            };
        });
    };

    const removeItem = (field: "authors" | "subjects" | "tags", name: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((x) => x.name !== name),
        }));
    };

    // --- селект АВТОРОВ ---
    const handleAuthorSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;

        if (val === "__new__") {
            const name = window.prompt("Введите имя автора");
            if (name && name.trim()) {
                addItem("authors", { id: null, name: name.trim() });
            }
            e.target.value = "";
            return;
        }

        const id = Number(val);
        const author = allAuthors.find((a) => a.id === id);
        if (author) {
            addItem("authors", { id: author.id, name: author.name });
        }
        e.target.value = "";
    };

    // --- селект ТЕГОВ ---
    const handleTagSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;

        if (val === "__new__") {
            const name = window.prompt("Введите название тега");
            if (name && name.trim()) {
                addItem("tags", { id: null, name: name.trim() });
            }
            e.target.value = "";
            return;
        }

        const id = Number(val);
        const tag = allTags.find((t) => t.id === id);
        if (tag) {
            addItem("tags", { id: tag.id, name: tag.name });
        }
        e.target.value = "";
    };

    // --- селект ПРЕДМЕТОВ ---
    const handleSubjectSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;

        if (val === "__new__") {
            const name = window.prompt("Введите название предмета");
            if (name && name.trim()) {
                addItem("subjects", { id: null, name: name.trim() });
            }
            e.target.value = "";
            return;
        }

        const id = Number(val);
        const subj = allSubjects.find((s) => s.id === id);
        if (subj) {
            addItem("subjects", { id: subj.id, name: subj.name });
        }
        e.target.value = "";
    };

    // --- валидация ---

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) newErrors.title = "error";
        if (!formData.review.trim()) newErrors.review = "error";
        if (!formData.releaseDate.trim()) newErrors.releaseDate = "error";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- сабмит ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = buildPublicationPayload(formData);
            await createPublication(payload);

            dispatch(show({ type: "success", message: "Отправлена на рассмотрение" }));
        } catch (err) {
            console.error("Ошибка создания публикации:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.container}>
            <div className={styles.title}>Создание публикации</div>

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

                        <MySelect
                            label=""
                            value=""
                            onChange={handleAuthorSelectChange}
                            options={[
                                ...allAuthors
                                    .filter(
                                        (a) =>
                                            !formData.authors.some(
                                                (x) =>
                                                    x.id === a.id ||
                                                    x.name.toLowerCase() === a.name.toLowerCase(),
                                            ),
                                    )
                                    .map((a) => ({
                                        value: String(a.id),
                                        label: a.name,
                                    })),
                                { value: "__new__", label: "+ Добавить нового автора" },
                            ]}
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

                        <MySelect
                            label=""
                            value=""
                            onChange={handleTagSelectChange}
                            options={[
                                ...allTags
                                    .filter(
                                        (t) =>
                                            !formData.tags.some(
                                                (x) =>
                                                    x.id === t.id ||
                                                    x.name.toLowerCase() === t.name.toLowerCase(),
                                            ),
                                    )
                                    .map((t) => ({
                                        value: String(t.id),
                                        label: t.name,
                                    })),
                                { value: "__new__", label: "+ Добавить новый тег" },
                            ]}
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

                        <MySelect
                            label=""
                            value=""
                            onChange={handleSubjectSelectChange}
                            options={[
                                ...allSubjects
                                    .filter(
                                        (s) =>
                                            !formData.subjects.some(
                                                (x) =>
                                                    x.id === s.id ||
                                                    x.name.toLowerCase() === s.name.toLowerCase(),
                                            ),
                                    )
                                    .map((s) => ({
                                        value: String(s.id),
                                        label: s.name,
                                    })),
                                { value: "__new__", label: "+ Добавить новый предмет" },
                            ]}
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

                <MyButton
                    variant="primary"
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    Отправить на рассмотрение
                </MyButton>
            </form>
        </section>
    );
}

function buildPublicationPayload(form: FormState): ICreatePublicationRequest {
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

