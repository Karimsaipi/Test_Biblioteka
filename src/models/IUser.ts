export enum Gender {
  Male = 0,
  Female = 1,
}

export type LabeledItem = { id: number; value: string };

export interface IUser {
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

export interface AuthResponse {
  user: IUser;
  token: string;
}




