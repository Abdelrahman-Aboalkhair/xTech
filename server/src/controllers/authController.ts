import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AuthService from "../services/authService";
import prisma from "../config/database";
import {
  blacklistToken,
  generateAccessToken,
  generateRefreshToken,
  isTokenBlacklisted,
} from "../utils/auth";
import AppError from "../utils/AppError";
import logger from "../config/logger";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.registerUser({
      name,
      email,
      password,
      role,
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse(
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
      "Signed up successfully. Please verify your email."
    );
  }
);

export const getVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
    const result = await AuthService.sendVerificationEmail(email);

    sendResponse(res, 200, {}, result.message);
  }
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { emailVerificationToken } = req.body;
    const result = await AuthService.verifyEmail(emailVerificationToken);

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

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse(
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
      "Signed in successfully"
    );
  }
);

export const signout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req?.cookies?.refreshToken;

    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      if (decoded && decoded.absExp) {
        const now = Math.floor(Date.now() / 1000);
        /* Check if the refresh token still has time to live 
        (In order to invalidate it cause the user is signing out) */
        const ttl = decoded.absExp - now;
        if (ttl > 0) {
          // Blacklist it if it still has time to live
          await blacklistToken(refreshToken, ttl);
        }
      }
    }

    res.clearCookie("refreshToken", cookieOptions);

    sendResponse(res, 200, {}, "Logged out successfully");
  }
);

export const googleSignup = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { access_token } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.googleSignup(
      access_token
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse(
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

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse(
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
    const oldRefreshToken = req?.cookies?.refreshToken;

    if (!oldRefreshToken) {
      throw new AppError(401, "Refresh token not found");
    }

    if (await isTokenBlacklisted(oldRefreshToken)) {
      throw new AppError(401, "Refresh token is invalidated");
    }

    jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          throw new AppError(401, "Invalid or expired refresh token");
        }

        const absoluteExpiration = decoded.absExp;
        const now = Math.floor(Date.now() / 1000);
        if (now > absoluteExpiration) {
          throw new AppError(401, "Session expired. Please log in again.");
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
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
          throw new AppError(401, "User not found");
        }

        const newAccessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(
          user.id,
          user.role,
          absoluteExpiration
        );

        const oldTokenTTL = absoluteExpiration - now; // * old token remaining time to live
        if (oldTokenTTL > 0) {
          await blacklistToken(oldRefreshToken, oldTokenTTL);
        } else {
          logger.warn(
            "Refresh token is already expired. No need to blacklist."
          );
        }

        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        sendResponse(
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
