import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AuthService from "../services/authService";
import prisma from "../config/database";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;
    console.log("req.body: ", req.body);
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
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return sendResponse(res, 401, {}, "Refresh token is required");
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          return sendResponse(res, 403, {}, "Invalid or expired refresh token");
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
          return sendResponse(res, 404, {}, "User not found");
        }

        const newAccessToken = await generateAccessToken(user.id, user.role);
        const newRefreshToken = await generateRefreshToken(user.id, user.role);

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
