import { IFeedbackRequest } from "../models/IFeedback";
import { api } from "./axios";

export async function feedbackCreate(body: IFeedbackRequest): Promise<boolean> {
  const {data} =  await api.post<boolean>("/feedbacks/create", body);
  return data;
}
