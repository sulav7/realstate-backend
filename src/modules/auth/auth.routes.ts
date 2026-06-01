import { Router } from "express";
import { AuthController } from "./auth.controller";
import validate from "../../lib/zod";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

authRoutes.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyOtp
);

authRoutes.post("/login", validate(loginSchema), authController.loginUser);

authRoutes.post(
  "/forgot-password",
  validate(verifyOtpSchema),
  authController.forgotPassword
);

authRoutes.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default authRoutes;
