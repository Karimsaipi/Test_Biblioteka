import React from "react";
import { Link } from "react-router-dom";
import styles from "./MyLink.module.scss";

interface MyLinkProps {
  to: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function MyLink({ to, children, style}: MyLinkProps) {
  return (
    <Link to={to} className={styles.link} style={style}>
      {children}
    </Link>
  );
}
