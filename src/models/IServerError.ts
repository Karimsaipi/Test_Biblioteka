export interface IServerError { //пример ошибки от бэка
  code: string | number;
  name: string;
  error: string;
  message: string;
}

export const isServerError = (x: unknown): x is IServerError =>
  !!x && typeof x === "object"
  && typeof (x as any).code === "string"
  && typeof (x as any).name === "string"
  && typeof (x as any).message === "string";
