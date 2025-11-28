import React from "react";
import { Link } from "react-router-dom";
import styles from "./BaseLink.module.scss";

interface BaseLinkProps {
    to: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export default function BaseLink({ to, children, style }: BaseLinkProps) {
    return (
        <Link to={to} className={styles.link} style={style}>
            {children}
        </Link>
    );
}
