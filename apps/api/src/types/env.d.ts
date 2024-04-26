declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PORT: string;
    readonly CORS_ORIGIN: string;
    readonly MONGO_URI: string;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly ACCESS_TOKEN_EXPIRE: string;
    readonly GMAIL_ID: string;
    readonly GMAIL_PASSWORD: string;
  }
}
