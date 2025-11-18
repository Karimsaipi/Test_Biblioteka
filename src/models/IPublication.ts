import { IAuthor } from "./IAuthor";
import { ISubject } from "./ISubject";
import { ITag } from "./ITag";

export enum PublicationType {
    книга = 0,
    статья = 1,
    альбом = 2,
    атлас = 3,
    руководство = 4,
    справочник = 5,
    пособие = 6,
}

export interface IPublication {
    id: number;
    userId: number;
    type: PublicationType;

    title: string;
    review: string;

    authors: IAuthor[];
    subjects: ISubject[];
    tags: ITag[];

    isFavourite: boolean;
    releaseDate: string;
    creationDate: string;

    coverPath: string;
    filePath: string;
}

export enum PublicationsSortBy {
    ALPHABET = 0,
    CREATION_DATE = 1,
}

export enum PublicationsSortOrder {
    ASC = 0,
    DESC = 1,
}

export interface IPublicationsFilterRequest {
    type?: PublicationType[];
    authors?: number[];
    subjects?: number[];
    tags?: number[];

    page: number;
    pageSize: number;

    sortBy?: PublicationsSortBy;
    sortOrder?: PublicationsSortOrder;
}

export interface IPublicationsFilterResponse {
    items: IPublication[];
    page: number;
    pageSize: number;
    total: number;
}

export interface ICreatePublicationRequest {
    type: PublicationType;
    title: string;
    review: string;
    releaseDate: string; 
    cover: any;
    authors: any[];
    subjects: any[];
    file?: File | null;
    tags: any[];
}

export interface IFavouritesGetParams {
    page: number;
    pageSize: number;
}

export interface IFavouritesUpdateParams {
    id: BigInteger;
}
