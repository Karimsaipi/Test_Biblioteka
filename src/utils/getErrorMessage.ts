import axios from "axios";
import { isServerError } from "../models/IError";


export function getErrorMessage(err: unknown, fallback = "Ошибка") {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (isServerError(data)) {
      return data.message;
    }
    return err.message || fallback;
  }

  // не axios
  if (isServerError(err)) {
    return err.message;
  }

  return fallback;
}
