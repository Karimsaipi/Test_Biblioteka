import React from "react";
import { IComment } from "@/models/IComment";
import styles from "./CommentItem.module.scss";

interface CommentItemProps {
    comment: IComment;
}

export default function CommentItem({ comment }: CommentItemProps) {
    const firstLetter = comment.author.name?.trim()?.[0]?.toUpperCase() ?? "?";

    const date = new Date(comment.creationDate).toLocaleString("ru-RU", { dateStyle: "short" });

    return (
        <div className={styles.comment}>
            <div className={styles.top}>
                <div className={styles.avatar}>{firstLetter}</div>

                <div className={styles.headerRow}>
                    <div>
                        <div className={styles.authorName}>{comment.author.name}</div>
                        {comment.author.post && (
                            <div className={styles.authorPost}>{comment.author.post}</div>
                        )}
                    </div>
                    <div className={styles.date}>{date}</div>
                </div>
            </div>

            <p className={styles.text}>{comment.textComment}</p>

            {comment.assets?.length > 0 && (
                <div className={styles.assets}>
                    {comment.assets.map((asset) => (
                        <a
                            key={asset.path + asset.name}
                            href={asset.path}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.assetLink}
                        >
                            {asset.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
