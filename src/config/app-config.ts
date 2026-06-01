import "dotenv/config";

export const appConfig = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL || "",
};
