import { ICreatePublicationReqBody } from "@/models/IPublication";

export function createPublicationFormData(payload: ICreatePublicationReqBody): FormData {
    const data = new FormData();

    data.append("type", String(payload.type));
    data.append("title", payload.title);
    data.append("review", payload.review);
    data.append("releaseDate", payload.releaseDate);

    if (payload.file) data.append("file", payload.file);
    if (payload.cover) data.append("cover", payload.cover);

    data.append("authors", JSON.stringify(payload.authors));
    data.append("subjects", JSON.stringify(payload.subjects));
    data.append("tags", JSON.stringify(payload.tags));

    return data;
}
