import "dotenv/config";

export const appConfig = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  smtpUsername: process.env.SMTP_USERNAME || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
};
