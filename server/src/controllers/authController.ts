import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AuthService from "../services/authService";
import { blacklistToken } from "../utils/authUtils";
import AppError from "../utils/AppError";
import CartService from "../services/cartService";
import { handleCartMergeAfterLogin } from "../utils/cartUtils";
import { SigninDto } from "dtos/authDto";

const { maxAge, ...clearCookieOptions } = cookieOptions;

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService, private cartService?: CartService) {
    this.authService = authService;
    this.cartService = cartService;
  }

  register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, email, password, role } = req.body;
      const { user, accessToken, refreshToken } =
        await this.authService.registerUser({
          name,
          email,
          password,
          role,
        });

      res.cookie("refreshToken", refreshToken, clearCookieOptions);
      res.cookie("accessToken", accessToken, clearCookieOptions);

      await handleCartMergeAfterLogin(req, this.cartService, user.id);

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
        },
        "Signed up successfully. Please verify your email."
      );
    }
  );

  getVerificationEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;
      const result = await this.authService.sendVerificationEmail(email);

      sendResponse(res, 200, {}, result.message);
    }
  );

  verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { emailVerificationToken } = req.body;
      const result = await this.authService.verifyEmail(emailVerificationToken);

      sendResponse(res, 200, {}, result.message);
    }
  );

  signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, clearCookieOptions);
    res.cookie("accessToken", accessToken, clearCookieOptions);

    await handleCartMergeAfterLogin(req, this.cartService, user.id);
    sendResponse(
      res,
      200,
      {
        user: {
          id: user.id,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Signed in successfully"
    );
  });

  signout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req?.cookies?.refreshToken;
    const accessToken = req?.cookies?.accessToken;

    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      if (decoded && decoded.absExp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.absExp - now;
        if (ttl > 0) {
          await blacklistToken(refreshToken, ttl);
        }
      }
    }

    if (accessToken) {
      const decoded: any = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
          await blacklistToken(accessToken, ttl);
        }
      }
    }

    res.clearCookie("refreshToken", clearCookieOptions);
    res.clearCookie("accessToken", clearCookieOptions);

    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
    });
    req.user = undefined;
    sendResponse(res, 200, {}, "Logged out successfully");
  });

  forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const response = await this.authService.forgotPassword(email);

      sendResponse(res, 200, {}, response.message);
    }
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { token, newPassword } = req.body;
      const response = await this.authService.resetPassword(token, newPassword);

      sendResponse(res, 200, {}, response.message);
    }
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const oldRefreshToken = req?.cookies?.refreshToken;

      if (!oldRefreshToken) {
        throw new AppError(401, "Refresh token not found");
      }

      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(oldRefreshToken);

      res.cookie("refreshToken", newRefreshToken, clearCookieOptions);
      res.cookie("accessToken", newAccessToken, clearCookieOptions);

      sendResponse(res, 200, {}, "Token refreshed successfully");
    }
  );
}

export default new AuthController(new AuthService(), new CartService());
