import axios from "axios";
import crypto from "crypto";
import AppError from "../utils/AppError";
import prisma from "../config/database";
import emailQueue from "../queues/emailQueue";
import sendEmail from "../utils/sendEmail";
import passwordResetTemplate from "../templates/passwordReset";
import {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
} from "../utils/auth";
import {
  AuthResponse,
  RegisterUserParams,
  GoogleUserData,
  SignInParams,
} from "../types/authTypes";
import { ROLE, User } from "@prisma/client";

class AuthService {
  static async registerUser({
    name,
    email,
    password,
    role,
  }: RegisterUserParams): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please sign in"
      );
    }

    const emailVerificationToken = Math.random().toString(36).slice(-6);
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        role: role || ROLE.USER,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        avatar: true,
      },
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

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id, newUser.role);

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

  static async sendVerificationEmail(
    email: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const emailVerificationToken = Math.random().toString(36).slice(-6);
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
      },
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

  static async verifyEmail(
    emailVerificationToken: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken,
        emailVerificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError(400, "Invalid or expired verification code.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
        emailVerified: true,
      },
    });

    return { message: "Email verified successfully." };
  }

  static async signin({ email, password }: SignInParams): Promise<{
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
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        name: true,
        email: true,
        emailVerified: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new AppError(
        400,
        "No user found with this email, please sign up first"
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new AppError(400, "Invalid credentials");

    const accessToken = await generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id, user.role);

    return { accessToken, refreshToken, user };
  }

  static async signout(): Promise<{ message: string }> {
    return { message: "User logged out successfully" };
  }

  static async googleSignup(access_token: string): Promise<AuthResponse> {
    const googleResponse = await axios.get<GoogleUserData>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const { email, name, picture, googleId } = googleResponse.data;
    console.log("picture: ", picture);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please sign in"
      );
    }

    const newUser = await prisma.user.create({
      data: {
        googleId,
        name,
        email,
        password: "",
        avatar: picture,
        emailVerified: true,
        role: ROLE.USER,
      },
    });

    const accessToken = await generateAccessToken(newUser.id, newUser.role);
    const refreshToken = await generateRefreshToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async googleSignin(
    access_token: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const googleResponse = await axios.get<GoogleUserData>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const { email } = googleResponse.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(404, "This email is not registered, please sign up");
    }

    const accessToken = await generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id, user.role);

    return { user, accessToken, refreshToken };
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(404, "This email is not registered, please sign up");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
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

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError(400, "Invalid or expired reset token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    return { message: "Password reset successful. You can now log in." };
  }
}

export default AuthService;
