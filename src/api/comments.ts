import { ICommentsResponse, ICreateCommentReqBody, IGetCommentReqParams } from "@/models/IComment";
import { api } from "./axios";
import { createCommentFormData } from "@/shared/utils/createCommentFormData";

//создать коммент/ post
export async function createComment(payload: ICreateCommentReqBody): Promise<boolean> {
    const data = createCommentFormData(payload);

    const response = await api.post(`/comments/create`, data);
    return response.data;
}

//получить коммент/ get
export async function getComment(
    publicationId: number,
    params: IGetCommentReqParams,
): Promise<ICommentsResponse> {
    const response = await api.get<ICommentsResponse>(`/comments/${publicationId}`, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    });
    return response.data;
}
