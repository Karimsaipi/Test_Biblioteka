import { api } from "./axios";
import { ISubject } from "../models/ISubject";

//получить Предметы
export async function fetchSubjects(): Promise<ISubject[]> {
  const res = await api.get("/subjects/filter");
  return res.data as ISubject[];
}