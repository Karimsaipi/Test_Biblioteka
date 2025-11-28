import React from "react";
import styles from "./GenderSwitch.module.scss";

type Gender = "male" | "female";

interface GenderSwitchProps {
    style?: any;
    value: Gender;
    onChange: (value: Gender) => void;
}

export default function GenderSwitch({ value, onChange }: GenderSwitchProps) {
    const handleToggle = () => {
        onChange(value === "male" ? "female" : "male");
    };

    return (
        <div className={styles.container}>
            <span className={`${styles.label} ${value === "male" ? styles.activeMale : ""}`}>
                М
            </span>

            <div
                className={`${styles.switch} ${
                    value === "female" ? styles.right : ""
                } ${value === "male" ? styles.male : styles.female}`}
                onClick={handleToggle}
            >
                <div className={styles.thumb} />
            </div>

            <span className={`${styles.label} ${value === "female" ? styles.activeFemale : ""}`}>
                Ж
            </span>
        </div>
    );
}
