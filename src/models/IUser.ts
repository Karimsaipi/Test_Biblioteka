export type Gender = "male" | "female";

export type LabeledItem = { id: number; value: string };

export interface IUser {
  role: number;
  login: string;
  name: string;
  gender: Gender;
  email: string;
  birthDate: string;
  career: /*LabeledItem[]*/ string;
  post: /*LabeledItem[]*/ string;
  canPublish: boolean;
  creationDate: string;
  token?: string;
}




