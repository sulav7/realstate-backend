import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "OTP is required" }),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "OTP is required" }),
  password: z.string().min(6, { message: "Password must be of 6 characters" }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
