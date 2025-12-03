import {
    IFavouritesApiResponse,
    IFavouritesGetReqParams,
    IPublicationsFilterResponse,
} from "@/models/IPublication";
import { api } from "./axios";

//получение избранных публикаций, get
export async function getFavourites(
    params: IFavouritesGetReqParams,
): Promise<IPublicationsFilterResponse> {
    const response = await api.get<IFavouritesApiResponse>(`favourites`, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    });
    return {
        items: response.data.data,
        total: response.data.totalCount,
        page: params.page,
        pageSize: params.pageSize,
    };
}

//PUT/ обновление списка избранных публикаций
export async function updateFavourite(id: number): Promise<boolean> {
    const response = await api.put<boolean>(`/favourites/update/${id}`, {
        id,
    });
    return response.data;
}
