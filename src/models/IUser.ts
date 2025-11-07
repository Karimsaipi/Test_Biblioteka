export type Gender = "male" | "female";

export type LabeledItem = { id: number; value: string };

export interface IUser {//Юзер.
  role: number;
  login: string;
  name: string;
  gender: Gender;
  email: string;
  birthDate: string;
  career: LabeledItem[];
  post: LabeledItem[];
  canPublish: boolean;
  creationDate: string;
  token?: string;
}






