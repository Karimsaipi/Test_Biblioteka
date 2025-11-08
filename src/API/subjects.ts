import { api } from "./axios";
import { ISubject } from "../models/ISubject";

export async function fetchSubjects(): Promise<ISubject[]> {
  const res = await api.get("/subjects/filter", {
    validateStatus: (s) => s >= 200 && s < 400,
  });
  return res.data as ISubject[];
}