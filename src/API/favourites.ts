import { IFavouritesGetParams, IPublicationsFilterResponse } from "../models/IPublication";
import { api } from "./axios";

//получение избранных публикаций, get
export async function getFavourites(
    params: IFavouritesGetParams,
): Promise<IPublicationsFilterResponse> {
    const response = await api.get<IPublicationsFilterResponse>(`favourites`, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    });
    return response.data;
}

//PUT/ обновление списка избранных публикаций
export async function updateFavourite(id: number): Promise<boolean> {
    const response = await api.put<boolean>(`/favourites/update/${id}`, {
        id, 
    });
    return response.data;
}

