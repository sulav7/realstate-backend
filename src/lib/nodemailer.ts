import nodemailer from "nodemailer";
import { appConfig } from "../config/app-config";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: appConfig.smtpUsername,
    pass: appConfig.smtpPassword,
  },
});
