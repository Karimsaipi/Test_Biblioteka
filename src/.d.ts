declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

declare namespace NodeJS {
    interface ProcessEnv {
        API_URL?: string;
        NODE_ENV?: "development" | "production" | "test";
    }
}
