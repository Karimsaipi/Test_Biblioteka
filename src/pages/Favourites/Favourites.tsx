import React from "react";
import PublicationsSection from "../../components/PublicationSection/PublicationSection";
import { IFavouritesGetParams } from "../../models/IPublication";
import { getFavourites } from "../../api/favourites";

export default function Favourites() {
    return (
        <PublicationsSection
            title="Избранные"
            requestParams={{ page: 1, pageSize: 100 } as IFavouritesGetParams}
            fetcher={getFavourites}
        />
    );
}
