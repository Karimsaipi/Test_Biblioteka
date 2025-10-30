import React, { useEffect, useState } from "react";
import { IPublication, IPublicationsFilterRequest } from "../../models/IPublication";
import { fetchPublications } from "../../API/publications";

// import BookCard from "../BookCard/BookCard"; 
import styles from "./Publication.module.scss";
import BookCard from "../BookCard/BookCard";

interface PublicationsSectionProps {
  title: string;
  requestParams: IPublicationsFilterRequest;
}

export default function PublicationsSection({
  title,
  requestParams,
}: PublicationsSectionProps) {
  const [items, setItems] = useState<IPublication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchPublications(requestParams)
      .then((data) => {
        setItems(data.items || []);
      })
      .catch(() => {
        setItems([]); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [requestParams]);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>

      {loading ? (
        <div className={styles.placeholder}>Загрузка</div>
      ) : (
        <div className={styles.grid}>
          {items.map((pub) => (
            <BookCard key={pub.id} book={pub} />
          ))}   
          {!items.length && (
            <div className={styles.placeholder}>Ошибка загрузки</div>
          )}
        </div>
      )}
    </section>
  );
}
