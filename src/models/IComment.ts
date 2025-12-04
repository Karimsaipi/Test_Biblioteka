// ================ ENTITIES (доменные типы) ============

export interface ICommentAuthor {
    id: number;
    name: string;
    post: string;
}

export interface IAssets {
    extension: string;
    name: string;
    path: string;
}

export interface IComment {
    id: number;
    author: ICommentAuthor;
    textComment: string;
    assets: IAssets[];
    creationDate: string;
}

// ===================== DTO (API) ======================

export interface ICreateCommentReqBody {
    publicationId: number;
    text: string;
    assets?: File[];
}

export interface IGetCommentReqParams {
    page: number;
    pageSize: number;
}

export interface ICommentsResponse {
    totalCount: number;
    data: IComment[];
}
