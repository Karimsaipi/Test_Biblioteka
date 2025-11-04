import React, { useEffect, useState } from "react";
import BookHeaderDetails from "../../COMPONENTS/BookCoverDetails/BookHeaderDetails";
import { useParams } from "react-router-dom";
import { IPublication } from "../../models/IPublication";
import { fetchPublicationsID } from "../../API/publications";

export default function BookDetails() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IPublication | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchPublicationsID(id)
            .then(setBook)
            .catch(() => setBook(null));
    }, [id]);

    if (!book) return <div>Загрузка книги</div>;
    return <BookHeaderDetails book={book} />;
}
