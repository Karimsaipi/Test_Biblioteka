import { IAuthor } from "../models/IAuthor";
import { ITag } from "../models/ITag";
import { api } from "./axios";

//получить тэги, get
export async function getTags(): Promise<ITag[]> {
    const res = await api.get(`/tags/filter`)
    return res.data as ITag[];
}

// создать тег, create
export async function createTag(name: string): Promise<ITag> {
  const res = await api.post(`/tags/create`, { name });
  return res.data as ITag; // либо {id,name}, либо true/false — зависит от твоего бэка
}

// удалить тег, DELETE /tags/delete/:id 
export async function deleteTag(id: number): Promise<boolean> {
  const res = await api.delete(`/tags/delete/${id}`);
  return res.data as boolean;
}