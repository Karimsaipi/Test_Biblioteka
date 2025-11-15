import { ICreateCommentPayload } from "../models/IComment";
import {
    IPublicationsFilterRequest,
    IPublicationsFilterResponse,
    IPublication,
    PublicationsSortBy,
    PublicationsSortOrder,
    ICreatePublicationPayload,
} from "../models/IPublication";
import { api } from "./axios";

//Получить get/publications/filter
export async function fetchPublications(
    params: IPublicationsFilterRequest,
): Promise<IPublicationsFilterResponse> {
    const query: Record<string, any> = {
        page: params.page,
        pageSize: params.pageSize,
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

//Получаем конкретн одну публикацию по айди

export async function fetchPublicationsID(id: number | string): Promise<IPublication> {
    const res = await api.get(`/publications/${id}`, {
        validateStatus: (s) => s >= 200 && s < 400,
    });
    return res.data as IPublication;
}

export async function createPublication(payload: ICreatePublicationPayload): Promise<boolean> {
    const data = new FormData();

    data.append("type", String(payload.type));
    data.append("title", payload.title);
    data.append("review", payload.review);
    data.append("releaseDate", payload.releaseDate);

    if (payload.file) {
        data.append("file", payload.file); 
    }

    if (payload.cover) {
        data.append("cover", payload.cover);
    }

    if (payload.authors && payload.authors.length > 0) {
        payload.authors.forEach((id) => {
            data.append("authors", String(id));
        });
    }

    if (payload.subjects && payload.subjects.length > 0) {
        payload.subjects.forEach((id) => {
            data.append("subjects", String(id));
        });
    }

    if (payload.tags && payload.tags.length > 0) {
        payload.tags.forEach((id) => {
            data.append("tags", String(id));
        });
    }

    const response = await api.post(`/publications/create`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
