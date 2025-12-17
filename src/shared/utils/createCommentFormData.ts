import { ICreateCommentReqBody } from "@/models/IComment";

export function createCommentFormData(payload: ICreateCommentReqBody): FormData {
    const data = new FormData();

    data.append("publicationId", String(payload.publicationId));
    data.append("text", payload.text);

    payload.assets?.forEach((file) => {
        data.append("assets", file);
    });

    return data;
}
