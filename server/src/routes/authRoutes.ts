import express from "express";
import passport from "passport";
import authController from "../controllers/authController";
import { cookieOptions } from "../constants";
import { validateDto } from "../middlewares/validateDto";
import {
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
  SigninDto,
  VerifyEmailDto,
} from "../dtos/authDto";
import CartService from "../services/cartService";

const router = express.Router();

const cartService = new CartService();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/sign-in",
  }),
  async (req, res) => {
    const user = req.user as any;
    const { accessToken, refreshToken } = user;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    const userId = user.id;
    const sessionId = req.session.id;
    await cartService?.mergeCartsOnLogin(sessionId, userId);

    res.redirect("http://localhost:3000/oauth-success");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:3000/sign-in",
    session: false,
  }),
  async (req, res) => {
    const user = req.user as any;
    console.log("user in facebook callback: ", user);
    const { accessToken, refreshToken } = user;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    const userId = user.id;
    const sessionId = req.session.id;
    await cartService?.mergeCartsOnLogin(sessionId, userId);

    res.redirect("http://localhost:3000/oauth-success");
  }
);

router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["email", "profile"] })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "http://localhost:3000/sign-in",
    session: false,
  }),
  async (req, res) => {
    const user = req.user as any;
    console.log("user in twitter callback: ", user);
    const { accessToken, refreshToken } = user;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
    const userId = user.id;
    const sessionId = req.session.id;
    await cartService?.mergeCartsOnLogin(sessionId, userId);

    res.redirect("http://localhost:3000/oauth-success");
  }
);

router.post("/register", validateDto(RegisterDto), authController.register);
router.post(
  "/verify-email",
  validateDto(VerifyEmailDto),
  authController.verifyEmail
);
router.get("/verification-email/:email", authController.getVerificationEmail);
router.post("/sign-in", validateDto(SigninDto), authController.signin);
router.get("/refresh-token", authController.refreshToken);
router.post(
  "/forgot-password",
  validateDto(ForgotPasswordDto),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateDto(ResetPasswordDto),
  authController.resetPassword
);
router.get("/sign-out", authController.signout);

export default router;
