import { IAccountEditPayload } from "../models/IAccountEdit";
import { Gender } from "../models/IUser";

export function makeFormState(user: any) {
  return {
    name: user?.name ?? "",
    login: user?.login ?? "",
    email: user?.email ?? "",
    birthDate: user?.birthDate ?? "",
    gender:
      (user?.gender ?? Gender.Male) === Gender.Male ? "male" : "female",
    occupation: Array.isArray(user?.career)
      ? user?.career[0]?.value ?? ""
      : user?.career ?? "",
    position: Array.isArray(user?.post)
      ? user?.post[0]?.value ?? ""
      : user?.post ?? "",
  };
}

export function buildPayload(form: {
  name: string;
  login: string;
  email: string;
  birthDate: string;
  gender: "male" | "female";
  occupation: string;
  position: string;
}): IAccountEditPayload {
  return {
    name: form.name.trim(),
    login: form.login.trim(),
    email: form.email.trim(),
    gender: form.gender === "male" ? Gender.Male : Gender.Female,
    birthDate: form.birthDate,
    career: form.occupation.trim(),
    post: form.position.trim(),
  };
}