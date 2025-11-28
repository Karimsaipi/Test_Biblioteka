import React, { useState } from "react";
import PublicationsSection from "../../components/PublicationSection/PublicationSection";
import { IFavouritesGetReqParams } from "../../models/IPublication";
import { getFavourites } from "../../api/favourites";
import Pagination from "../../UI/Pagination/Pagination";
import styles from "./Favourites.module.scss";

const PAGE_SIZE = 8;

export default function Favourites() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const requestParams: IFavouritesGetReqParams = {
        page,
        pageSize: PAGE_SIZE,
    };

    const totalPages = PAGE_SIZE > 0 ? Math.ceil(total / PAGE_SIZE) : 0;

    return (
        <>
            <PublicationsSection
                title="Избранные"
                requestParams={requestParams}
                onChangeTotal={setTotal}
                fetcher={getFavourites}
            />
            <div className={styles.pagination}>
                <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
            </div>
        </>
    );
}
