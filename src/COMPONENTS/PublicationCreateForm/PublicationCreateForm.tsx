import React, { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createPublication } from "../../api/publications";
import { show } from "../../store/notifySlice"; // если путь другой – поправь
import styles from "./PublicationCreateForm.module.scss";

import MyInput from "../../UI/Input/MyInput";
import MySelect from "../../UI/Select/MySelect";
import AssetButton from "../../UI/AssetButton/AssetButton";
import MyButton from "../../UI/BaseButton/BaseButton";

import { ICreatePublicationPayload, PublicationType } from "../../models/IPublication";

interface FormState extends ICreatePublicationPayload {
    // служебные строки для ввода id через запятую
    authorsInput: string;
    subjectsInput: string;
    tagsInput: string;
    file: File | null;
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
        authorsInput: "",
        subjectsInput: "",
        tagsInput: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

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

    // --- валидация ---

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "error";
        }

        if (!formData.review.trim()) {
            newErrors.review = "error";
        }

        if (!formData.releaseDate.trim()) {
            newErrors.releaseDate = "error";
        }

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
            // при желании можно сделать reset формы
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

                    <span className={styles.label}>Автор</span>
                    <MyInput
                        label=""
                        value={formData.authorsInput}
                        onChange={handleTextChange("authorsInput")}
                        error={errors.authorsInput}
                    />

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
                    <span className={styles.label}>Теги</span>
                    <MyInput
                        label="#..."
                        value={formData.tagsInput}
                        onChange={handleTextChange("tagsInput")}
                        error={errors.tagsInput}
                    />

                    <span className={styles.label}>Предметы</span>
                    <MyInput
                        label=""
                        value={formData.subjectsInput}
                        onChange={handleTextChange("subjectsInput")}
                        error={errors.subjectsInput}
                    />

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

function parseIds(value: string): number[] {
    return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));
}

function buildPublicationPayload(form: FormState): ICreatePublicationPayload {
    const year = form.releaseDate.trim();
    return {
        type: form.type,
        title: form.title.trim(),
        review: form.review.trim(),
        releaseDate: year ? `${year}-01-01` : "",
        cover: form.cover,
        file: form.file,
        authors: parseIds(form.authorsInput),
        subjects: parseIds(form.subjectsInput),
        tags: parseIds(form.tagsInput),
    };
}
