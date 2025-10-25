import React from "react";
import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  iconSrc: string; 
  alt?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Поиск...",
  iconSrc,
  alt = "Поиск",
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <img src={iconSrc} alt={alt} className={styles.icon} />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}
