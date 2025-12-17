import {
    IPublicationsFilterReqBody,
    IPublicationsFilterResponse,
    IPublication,
    PublicationsSortBy,
    PublicationsSortOrder,
    ICreatePublicationReqBody,
    ISearchApiResponse,
} from "@/models/IPublication";
import { api } from "./axios";
import { IPaginatedResponse } from "@/models/IPaginatedResponse";
import { createPublicationFormData } from "@/shared/utils/createPublicationFormData";

//Получить get/publications/filter
export async function getPublications(
    params: IPublicationsFilterReqBody,
): Promise<IPublicationsFilterResponse> {
    const page = Number.isFinite(Number(params.page)) ? Number(params.page) : 1;
    const pageSize = Number.isFinite(Number(params.pageSize)) ? Number(params.pageSize) : 8;

    const query = {
        page,
        pageSize,
        sortBy: params.sortBy ?? PublicationsSortBy.CREATION_DATE,
        sortOrder: params.sortOrder ?? PublicationsSortOrder.ASC,

        ...(params.type?.length && { type: params.type }),
        ...(params.authors?.length && { authors: params.authors }),
        ...(params.subjects?.length && { subjects: params.subjects }),
        ...(params.tags?.length && { tags: params.tags }),
    };

    const res = await api.get<IPaginatedResponse<IPublication>>("/publications/filter", {
        params: query,
        headers: {
            "Cache-Control": "no-cache",
        },
        validateStatus: (s) => s >= 200 && s < 400,
    });

    const { data, totalCount } = res.data;

    return {
        items: data ?? [],
        page,
        pageSize,
        total: totalCount ?? (data ? data.length : 0),
    };
}

//Получаем одну публикацию по айди
export async function getPublicationsID(id: number | string): Promise<IPublication> {
    const res = await api.get(`/publications/${id}`);
    return res.data;
}

//Создать публикацию
export async function createPublication(payload: ICreatePublicationReqBody): Promise<boolean> {
    const data = createPublicationFormData(payload);

    const { data: result } = await api.post<boolean>("/publications/create", data);

    return result;
}

//Поиск публикации
export async function searchPublications(substr: string): Promise<IPublication[]> {
    const query = substr.trim();
    if (!query) return [];

    const url = "/publications/search" + `?page=1&pageSize=5&substr=${encodeURIComponent(query)}`;

    const { data } = await api.get<ISearchApiResponse>(url);

    return data.data;
}
