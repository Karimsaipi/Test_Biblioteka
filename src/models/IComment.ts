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

export interface ICreateCommentPayload {
    publicationId: number;
    text: string;
    assets?: File[];
}

export interface IGetCommentParams {
    page: number;
    pageSize: number;
}

export interface ICommentsResponse {
  totalCount: number;
  data: IComment[];
}