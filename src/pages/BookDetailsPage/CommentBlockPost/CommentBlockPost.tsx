import React, { useEffect, useState } from "react";
import styles from "./CommentBlockPost.module.scss";
import { useAppDispatch } from "@/store/hooks";
import { IComment, ICommentsResponse } from "@/models/IComment";
import { createComment, getComment } from "@/api/comments";
import { show } from "@/store/NotifySlice/notifySlice";
import CommentItem from "@/components/CommentItem/CommentItem";
import { AssetButton } from "@/ui";

interface CommentBlockProps {
    publicationId: number;
}

const PAGE_SIZE = 4;

export default function CommentBlockPost({ publicationId }: CommentBlockProps) {
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<IComment[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [sending, setSending] = useState(false);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [page, setPage] = useState(1);

    const loadComments = async (pageToLoad: number, append: boolean) => {
        try {
            setLoading(true);

            const res: ICommentsResponse = await getComment(publicationId, {
                page: pageToLoad,
                pageSize: PAGE_SIZE,
            });

            const newComments = res.data ?? [];

            setComments((prev) => (append ? [...prev, ...newComments] : newComments));

            if ((res as any).totalCount != null) {
                const totalCount = Number((res as any).totalCount) || 0;
                setHasMore(pageToLoad * PAGE_SIZE < totalCount);
            } else {
                setHasMore(newComments.length === PAGE_SIZE);
            }
        } catch {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setComments([]);
        setPage(1);
        setHasMore(true);
        loadComments(1, false);
    }, [publicationId]);

    const handleLoadMore = () => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadComments(nextPage, true);
    };

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
            setText("");
            setFiles([]);
            setPage(1);
            loadComments(1, false);
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

                {/* "Показать ещё" */}
                {hasMore && !loading && comments.length > 0 && (
                    <button type="button" className={styles.loadMore} onClick={handleLoadMore}>
                        Показать ещё
                    </button>
                )}
            </div>
        </section>
    );
}
