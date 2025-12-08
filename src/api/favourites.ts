import {
    IFavouritesGetReqParams,
    IPublication,
    IPublicationsFilterResponse,
} from "@/models/IPublication";
import { api } from "./axios";
import { IPaginatedResponse } from "@/models/IPaginatedResponse";

//получение избранных публикаций, get
export async function getFavourites(
    params: IFavouritesGetReqParams,
): Promise<IPublicationsFilterResponse> {
    const page = Number.isFinite(Number(params.page)) ? Number(params.page) : 1;
    const pageSize = Number.isFinite(Number(params.pageSize)) ? Number(params.pageSize) : 8;

    const res = await api.get<IPaginatedResponse<IPublication>>("/favourites", {
        params: {
            page,
            pageSize,
        },
    });

    const { data, totalCount } = res.data;

    return {
        items: data ?? [],
        page,
        pageSize,
        total: totalCount ?? (data ? data.length : 0),
    };
}

//PUT/ обновление списка избранных публикаций
export async function updateFavourite(id: number): Promise<boolean> {
    const response = await api.put<boolean>(`/favourites/update/${id}`, {
        id,
    });
    return response.data;
}
