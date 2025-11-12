import { IAuthor } from "../models/IAuthor";
import { ITag } from "../models/ITag";
import { api } from "./axios";

//получить тэги, get
export async function fetchTags(): Promise<ITag[]> {
    const res = await api.get(`/tags/filter`)
    return res.data as ITag[];
}