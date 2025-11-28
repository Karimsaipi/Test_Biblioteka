import React, { useRef } from "react";
import styles from "./AssetButton.module.scss";
import clipIcon from "../../assets/icons/clip-svgrepo-com 1.svg";

interface AssetButtonProps {
    style?: any;
    size?: number;
    title?: string;
    multiple?: boolean;
    accept?: string;
    onFilesSelected?: (files: FileList) => void;
}

export default function AssetButton({
    style,
    size = 22,
    multiple = true,
    title = "Добавь файл",
    accept,
    onFilesSelected,
}: AssetButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && onFilesSelected) {
            onFilesSelected(e.target.files);
        }
    };

    return (
        <>
            <button
                type="button"
                style={style}
                className={styles.assetButton}
                onClick={handleClick}
                title={title}
            >
                <img src={clipIcon} alt={title} width={size} height={size} />
            </button>

            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
                className={styles.hiddenFileInput}
            />
        </>
    );
}
