import {
    IPublicationsFilterReqBody,
    IPublicationsFilterResponse,
    IPublication,
    PublicationsSortBy,
    PublicationsSortOrder,
    ICreatePublicationReqBody,
    ISearchApiResponse,
} from "../models/IPublication";
import { api } from "./axios";

//Получить get/publications/filter
export async function getPublications(
    params: IPublicationsFilterReqBody,
): Promise<IPublicationsFilterResponse> {
    const page = Number.isFinite(Number(params.page)) ? Number(params.page) : 1;
    const pageSize = Number.isFinite(Number(params.pageSize)) ? Number(params.pageSize) : 8;

    const query: Record<string, any> = {
        page: page,
        pageSize: pageSize,
        sortBy: params.sortBy ?? PublicationsSortBy.CREATION_DATE,
        sortOrder: params.sortOrder ?? PublicationsSortOrder.ASC,
    };

    if (params.type?.length) query.type = params.type;
    if (params.authors?.length) query.authors = params.authors;
    if (params.subjects?.length) query.subjects = params.subjects;
    if (params.tags?.length) query.tags = params.tags;

    const res = await api.get("/publications/filter", {
        params: query,
        headers: {
            "Cache-Control": "no-cache",
        },
        validateStatus: (s) => s >= 200 && s < 400,
    });

    const data = res.data as {
        data?: IPublication[];
        totalCount?: number;
        page?: number;
        pageSize?: number;
    };

    return {
        items: data.data ?? [],
        page: data.page ?? params.page,
        pageSize: data.pageSize ?? params.pageSize,
        total: data.totalCount ?? (data.data ? data.data.length : 0),
    };
}

//Получаем одну публикацию по айди
export async function getPublicationsID(id: number | string): Promise<IPublication> {
    const res = await api.get(`/publications/${id}`, {
        validateStatus: (s) => s >= 200 && s < 400,
    });
    return res.data as IPublication;
}

//Создать публикацию
export async function createPublication(payload: ICreatePublicationReqBody): Promise<boolean> {
    const data = new FormData();

    data.append("type", String(payload.type));
    data.append("title", payload.title);
    data.append("review", payload.review);
    data.append("releaseDate", payload.releaseDate);

    if (payload.file) data.append("file", payload.file);
    if (payload.cover) data.append("cover", payload.cover);

    // Шлём в виде JSON
    data.append("authors", JSON.stringify(payload.authors));
    data.append("subjects", JSON.stringify(payload.subjects));
    data.append("tags", JSON.stringify(payload.tags));

    const response = await api.post(`/publications/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

//Поиск публикации
export async function searchPublications(substr: string): Promise<IPublication[]> {
    const query = substr.trim();
    if (!query) return [];

    const url = "/publications/search" + `?page=1&pageSize=5&substr=${encodeURIComponent(query)}`;

    const { data } = await api.get<ISearchApiResponse>(url);

    return data.data;
}
