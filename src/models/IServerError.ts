export interface IServerError {
  code: string;
  name: string;
  message: string;
}

export const isServerError = (x: unknown): x is IServerError =>
  !!x && typeof x === "object"
  && typeof (x as any).code === "string"
  && typeof (x as any).name === "string"
  && typeof (x as any).message === "string";