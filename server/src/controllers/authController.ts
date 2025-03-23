import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieParserOptions } from "../constants";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AuthService from "../services/authService";
import prisma from "../config/database"; // Assuming this is your Prisma client import
import { generateAccessToken, generateRefreshToken } from "../utils/auth";

// Define user response type based on schema
interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "SUPERADMIN";
  emailVerified: boolean;
  avatar?: string | null;
}

interface AuthResponseData {
  user: UserResponse;
  accessToken: string;
  refreshToken?: string;
}

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.registerUser({
      name,
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, cookieParserOptions);

    sendResponse<AuthResponseData>(
      res,
      201,
      {
        user: {
          id: user.id, // Changed from _id to id to match Prisma schema
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar || null, // Changed from profilePicture to avatar
        },
        accessToken,
      },
      "Signed up successfully. Please verify your email."
    );
  }
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { emailVerificationCode } = req.body;
    const result = await AuthService.verifyEmail(emailVerificationCode);

    sendResponse(res, 200, {}, result.message);
  }
);

export const signin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.signin({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, cookieParserOptions);

    sendResponse<AuthResponseData>(
      res,
      200,
      {
        user: {
          id: user.id, // Changed from _id to id
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar || null, // Removed phoneNumber and complex profilePicture
        },
        accessToken,
      },
      "Signed in successfully"
    );
  }
);

export const signout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.signout();
    res.clearCookie("refreshToken");

    sendResponse(res, 200, {}, result.message);
  }
);

export const googleSignup = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { access_token } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.googleSignup(
      access_token
    );

    res.cookie("refreshToken", refreshToken, cookieParserOptions);

    sendResponse<AuthResponseData>(
      res,
      201,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar || null,
        },
        accessToken,
      },
      "Sign-up successful"
    );
  }
);

export const googleSignin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { access_token } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.googleSignin(
      access_token
    );

    res.cookie("refreshToken", refreshToken, cookieParserOptions);

    sendResponse<AuthResponseData>(
      res,
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar || null,
        },
        accessToken,
      },
      "Login successful"
    );
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const response = await AuthService.forgotPassword(email);

    sendResponse(res, 200, {}, response.message);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    const response = await AuthService.resetPassword(token, newPassword);

    sendResponse(res, 200, {}, response.message);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return sendResponse(res, 401, {}, "Refresh token is required");
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          return sendResponse(res, 403, {}, "Invalid or expired refresh token");
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            avatar: true,
          },
        });

        if (!user) {
          return sendResponse(res, 404, {}, "User not found");
        }

        const newAccessToken = await generateAccessToken(user.id, user.role);
        const newRefreshToken = await generateRefreshToken(user.id, user.role);

        res.cookie("refreshToken", newRefreshToken, cookieParserOptions);

        sendResponse<AuthResponseData>(
          res,
          200,
          {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified,
              avatar: user.avatar || null,
            },
            accessToken: newAccessToken,
          },
          "Token refreshed successfully"
        );
      }
    );
  }
);
