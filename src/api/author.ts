import { AxiosResponse } from "axios";
import { IAuthor } from "@/models/IAuthor";
import { api } from "./axios";

//получить авторов, get
export async function getAuthors(): Promise<IAuthor[]> {
    const response = await api.get(`/authors/filter`);
    return response.data;
}

//создать авторов
export async function createAuthor(name: string): Promise<IAuthor> {
  const res = await api.post("/authors/create", { name });
  return res.data;
}

// удалить автора, 
export async function deleteAuthor(id: number): Promise<boolean> {
  const res = await api.delete(`/authors/delete/${id}`);
  return res.data;
}
