import { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "./auth.validation";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import { AppError } from "../../lib/error";
import { generateToken } from "../../lib/jwt";
import otpGenerator from "otp-generator";
import { transporter } from "../../lib/nodemailer";

export class AuthService {
  async checkExistingUser(email: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    return existingUser;
  }

  async findUserFromEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async registerUser(payload: RegisterInput) {
    await this.checkExistingUser(payload.email);

    const hashedPassword = await hashPassword(payload.password);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await prisma.user.create({
      data: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: hashedPassword,
        role: Role.USER,
        otp,
      },
    });

    const msg = {
      from: "test@gmail.com",
      to: payload.email,
      subjects: "Verify Your Account",
      html: `
          <h2>Welcome to Our Platform!</h2>
          <p>Thank you for registering. Please verify your email using the OTP below:</p>
          <h1 style="color: #2563eb; letter-spacing: 5px; font-family: monospace;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't register, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(msg);

    return {
      message:
        "User registered successfully. Please check your email for verification.",
    };
  }

  async checkUserVerifiedOrNot(isVerified: boolean, email: string) {
    const checkUserVerifiedOrNot = await prisma.user.findFirst({
      where: {
        isVerified: isVerified,
        email,
      },
    });

    if (!checkUserVerifiedOrNot) {
      throw new AppError("User is not verified", 401);
    }
  }

  async loginUser(payload: LoginInput) {
    const user = await this.findUserFromEmail(payload.email);

    const checkPassword = await comparePassword(
      payload.password,
      user.password
    );

    if (!checkPassword) {
      throw new AppError("Invalid Credentials", 401);
    }

    await this.checkUserVerifiedOrNot(user.isVerified, user.email);

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user,
    };
  }

  async generateOtp() {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    return otp;
  }

  async verifyOtp(payload: VerifyOtpInput) {
    const { otp, email } = payload;

    const user = await this.findUserFromEmail(email);

    if (user.otp !== otp) {
      throw new AppError("Invalid OTP", 401);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        otp: null,
      },
    });

    return {
      message: "User verified successfully",
    };
  }

  async forgotPassword(email: string) {
    const user = await this.findUserFromEmail(email);

    const otp = await this.generateOtp();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp,
      },
    });

    const msg = {
      from: "test@gmail.com",
      to: email,
      subjects: "Forgot Your Password",
      html: `
          <h2>Forgot Your Password?</h2>
          <p>T Please verify your email using the OTP below:</p>
          <h1 style="color: #2563eb; letter-spacing: 5px; font-family: monospace;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't forget your password, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(msg);

    return {
      message: "OTP sent successfully",
    };
  }

  async resetPassword(payload: ResetPasswordInput) {
    const { email, otp, password: newPassword } = payload;
    const user = await this.findUserFromEmail(email);

    if (user.otp !== otp) {
      throw new AppError("Invalid OTP", 401);
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        otp: null,
      },
    });

    return updatedUser;
  }
}
