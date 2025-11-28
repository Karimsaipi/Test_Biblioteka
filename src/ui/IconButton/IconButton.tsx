import React from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
    style?: any;
    icon: string;
    alt: string;
    onClick?: () => void;
    size?: number;
    title?: string;
}

export default function IconButton({ style, icon, alt, onClick, title, size }: IconButtonProps) {
    return (
        <button style={style} className={styles.iconButton} onClick={onClick} title={title || alt}>
            <img src={icon} alt={alt} width={size} height={size} />
        </button>
    );
}
