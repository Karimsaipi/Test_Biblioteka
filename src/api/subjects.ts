import { api } from "./axios";
import { ISubject } from "@/models/ISubject";

//получить Предметы
export async function getSubjects(): Promise<ISubject[]> {
    const res = await api.get(`/subjects/filter`);
    return res.data;
}

//создать предмет, create
export async function createSubject(name: string): Promise<ISubject> {
    const res = await api.post(`/subjects/create`, { name });
    return res.data;
}

// удалить предмет, DELETE
export async function deleteSubject(id: number): Promise<boolean> {
    const res = await api.delete(`/subjects/delete/${id}`);
    return res.data;
}
