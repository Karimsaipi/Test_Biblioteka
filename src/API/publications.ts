import {
    IPublicationsFilterRequest,
    IPublicationsFilterResponse,
    IPublication,
    PublicationsSortBy,
    PublicationsSortOrder,
} from "../models/IPublication";
import { api } from "./axios";


//Получить get/publications/filter
export async function fetchPublications(
    params: IPublicationsFilterRequest,
): Promise<IPublicationsFilterResponse> {
    const query: Record<string, any> = {
        page: [params.page],
        pageSize: [params.pageSize],
        sortBy: [params.sortBy ?? PublicationsSortBy.CREATION_DATE],
        sortOrder: [params.sortOrder ?? PublicationsSortOrder.ASC],
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

    // // если бэк сказал 304 — вернём пустой, но ПРАВИЛЬНОЙ формы объект
    // if (res.status === 304 || !res.data) {
    //   return {
    //     items: [],
    //     page: params.page ?? 1,
    //     pageSize: params.pageSize ?? 10,
    //     total: 0,
    //   };
    // }

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

//Получаем конкретн одну публикацию по айди

export async function fetchPublicationsID(id: number | string): Promise<IPublication> {
    const res = await api.get(`/publications/${id}`, {
        validateStatus: (s) => s >= 200 && s < 400,
    });
    return res.data as IPublication;
}
