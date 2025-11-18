import { IComment, ICommentsResponse, ICreateCommentRequest, IGetCommentParams } from "../models/IComment";
import { api } from "./axios";

//создать коммент/ post
export async function createComment(payload: ICreateCommentRequest): Promise<boolean> {
    const data = new FormData();

    data.append("publicationId", String(payload.publicationId));
    data.append("text", payload.text);

    if (payload.assets) {
        payload.assets.forEach((file) => {
            data.append("assets", file);
        });
    }

    const response = await api.post(`/comments/create`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

//получить коммент/ get
export async function getComment(
    publicationId: number,
    params: IGetCommentParams,
): Promise<ICommentsResponse> {
    const response = await api.get<ICommentsResponse>(`/comments/${publicationId}`,  {
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    });
    return response.data;
}

