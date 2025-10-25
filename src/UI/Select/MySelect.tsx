import React, { useState } from "react";
import styles from "./MySelect.module.scss";

interface MySelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
}

export default function MySelect({ label, value, onChange, options, error }: MySelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={styles.wrapper}>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${styles.select} ${error ? styles.selectError : ""}`}
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label
        className={`${styles.label} ${
          focused || value ? styles.labelActive : ""
        } ${error ? styles.labelError : ""}`}
      >
        {label}
      </label>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
