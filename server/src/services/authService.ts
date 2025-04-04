import crypto from "crypto";
import AppError from "../utils/AppError";
import emailQueue from "../queues/emailQueue";
import sendEmail from "../utils/sendEmail";
import passwordResetTemplate from "../templates/passwordReset";
import {
  blacklistToken,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  isTokenBlacklisted,
} from "../utils/authUtils";
import {
  AuthResponse,
  RegisterUserParams,
  SignInParams,
} from "../types/authTypes";
import { ROLE } from "@prisma/client";
import logger from "../config/logger";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/authRepository";

class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async registerUser({
    name,
    email,
    password,
    role,
  }: RegisterUserParams): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please sign in"
      );
    }

    const emailVerificationToken = Math.random()
      .toString(36)
      .slice(-6)
      .toUpperCase();
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const newUser = await this.authRepository.createUser({
      email,
      name,
      password,
      emailVerificationToken,
      emailVerificationTokenExpiresAt,
      role: role || ROLE.USER,
      emailVerified: false,
    });

    await emailQueue
      .add("sendVerificationEmail", {
        to: email,
        subject: "Verify Your Email - EgWinch",
        text: `Your verification code is: ${emailVerificationToken}`,
        html: `<p>Your verification code is: <strong>${emailVerificationToken}</strong></p>`,
      })
      .catch((error) => {
        console.error("Failed to add email to queue:", error);
      });

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        avatar: null,
      },
      accessToken,
      refreshToken,
    };
  }

  async sendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const emailVerificationToken = Math.random().toString(36).slice(-6);
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await this.authRepository.updateUserEmailVerification(user.id, {
      emailVerificationToken,
      emailVerificationTokenExpiresAt,
    });

    await emailQueue
      .add("sendVerificationEmail", {
        to: email,
        subject: "Verify Your Email - KgKraft",
        text: `Your verification code is: ${emailVerificationToken}`,
        html: `<p>Your verification code is: <strong>${emailVerificationToken}</strong></p>`,
      })
      .catch((error) => {
        console.error("Failed to add email to queue:", error);
      });

    return { message: "A new verification code has been sent to your email" };
  }

  async verifyEmail(
    emailVerificationToken: string
  ): Promise<{ message: string }> {
    const user = await this.authRepository.findUserByVerificationToken(
      emailVerificationToken
    );

    if (!user) {
      throw new AppError(400, "Invalid or expired verification code.");
    }

    await this.authRepository.updateUserEmailVerification(user.id, {
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      emailVerified: true,
    });

    return { message: "Email verified successfully." };
  }

  async signin({ email, password }: SignInParams): Promise<{
    user: {
      id: string;
      role: ROLE;
      name: string;
      email: string;
      emailVerified: boolean;
      avatar: string | null;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authRepository.findUserByEmailWithPassword(email);

    if (!user) {
      throw new AppError(
        400,
        "No user found with this email, please sign up first"
      );
    }

    if (!user.password) {
      throw new AppError(400, "Invalid credentials");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new AppError(400, "Invalid credentials");

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken, user };
  }

  async signout(): Promise<{ message: string }> {
    return { message: "User logged out successfully" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, "This email is not registered, please sign up");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await this.authRepository.updateUserPasswordReset(email, {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const resetUrl = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;
    const htmlTemplate = passwordResetTemplate(resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: htmlTemplate,
      text: "Reset your password",
    });

    return { message: "Password reset email sent successfully" };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this.authRepository.findUserByResetToken(hashedToken);

    if (!user) {
      throw new AppError(400, "Invalid or expired reset token");
    }

    await this.authRepository.updateUserPassword(user.id, newPassword);

    return { message: "Password reset successful. You can now log in." };
  }

  async refreshToken(oldRefreshToken: string): Promise<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      emailVerified: boolean;
      avatar: string | null;
    };
    newAccessToken: string;
    newRefreshToken: string;
  }> {
    if (await isTokenBlacklisted(oldRefreshToken)) {
      throw new AppError(401, "Refresh token is invalidated");
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; absExp: number };

    const absoluteExpiration = decoded.absExp;
    const now = Math.floor(Date.now() / 1000);
    if (now > absoluteExpiration) {
      throw new AppError(401, "Session expired. Please log in again.");
    }

    const user = await this.authRepository.findUserById(decoded.id);
    console.log("refreshed user: ", user);

    if (!user) {
      throw new AppError(401, "User not found");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id, absoluteExpiration);

    const oldTokenTTL = absoluteExpiration - now;
    if (oldTokenTTL > 0) {
      await blacklistToken(oldRefreshToken, oldTokenTTL);
    } else {
      logger.warn("Refresh token is already expired. No need to blacklist.");
    }

    return { user, newAccessToken, newRefreshToken };
  }
}

export default AuthService;
