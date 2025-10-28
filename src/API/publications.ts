import { IPublicationsFilterRequest, IPublicationsFilterResponse } from "../models/IPublication";
import { api } from "./axios";

// GET /publications/filter
export async function fetchPublications(
  params: IPublicationsFilterRequest
): Promise<IPublicationsFilterResponse> {
  const { data } = await api.get<IPublicationsFilterResponse>(
    "/publications/filter",
    { params }
  );
  return data;
}
