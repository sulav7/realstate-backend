import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { success } from "../../lib/error";

export class AuthController {
  private authService = new AuthService();

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = registerSchema.parse(req.body);
      const user = await this.authService.registerUser(parsedData);

      res.json(success("User Created", 201, user));
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.verifyOtp(req.body);

      res.json(success("User Verified", 200, user));
    } catch (error) {
      next(error);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = loginSchema.parse(req.body);
      const user = await this.authService.loginUser(parsedData);

      res.json(success("User Logged In", 200, user));
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const forgotPassword = await this.authService.forgotPassword(email);

      res.json(success("OTP Sent Successfully", 200, forgotPassword));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = resetPasswordSchema.parse(req.body);
      const resetPassword = await this.authService.resetPassword(parsedData);

      res.json(success("Password Reset Successfully", 200, resetPassword));
    } catch (error) {
      next(error);
    }
  };
}
