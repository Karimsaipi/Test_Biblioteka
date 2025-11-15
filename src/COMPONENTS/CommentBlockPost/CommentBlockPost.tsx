import React, { useEffect, useState } from "react";
import styles from "./CommentBlockPost.module.scss";
import { useAppDispatch } from "../../store/hooks";
import { IComment, ICommentsResponse } from "../../models/IComment";
import { createComment, getComment } from "../../api/comments";
import { show } from "../../store/notifySlice";
import CommentItem from "../CommentItem/CommentItem";
import AssetButton from "../../UI/AssetButton/AssetButton";

interface CommentBlockProps {
    publicationId: number;
}

const PAGE_SIZE = 2;

export default function CommentBlockPost({ publicationId }: CommentBlockProps) {
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<IComment[]>([]);
    // const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [sending, setSending] = useState(false);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const loadComments = async () => {
        try {
            setLoading(true);

            const res: ICommentsResponse = await getComment(publicationId, {
                page: 1,
                pageSize: PAGE_SIZE,
            });
            setComments(res.data);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [publicationId]);

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        try {
            setSending(true);
            await createComment({
                publicationId: publicationId,
                text: trimmed,
                assets: files,
            });
            dispatch(show({ type: "success", message: "Комментарий отправлен" }));
        } catch (error) {
        } finally {
            setSending(false);
        }
    };

    const handleFilesSelected = (fileList: FileList) => {
        setFiles(Array.from(fileList));
    };

    const isSendDisabled = sending || !text.trim();

    return (
        <section className={styles.root}>
            <div className={styles.title}>Комментарии</div>

            {/* форма отправки */}
            <div className={styles.form}>
                <div className={styles.formTop}>
                    <AssetButton
                        size={22}
                        title="Прикрепить файл"
                        onFilesSelected={handleFilesSelected}
                    />
                    <button
                        type="button"
                        className={styles.sendButton}
                        onClick={handleSend}
                        disabled={isSendDisabled}
                    >
                        Отправить
                    </button>
                </div>

                <textarea
                    className={styles.textarea}
                    placeholder="Введите текст обращения"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                />

                {files.length > 0 && (
                    <div className={styles.files}>
                        {files.map((f) => (
                            <span key={f.name} className={styles.fileChip}>
                                {f.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* список комментариев */}
            <div className={styles.list}>
                {comments.length === 0 && (
                    <div className={styles.info}>Пока нет ни одного комментария</div>
                )}

                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </section>
    );
}
