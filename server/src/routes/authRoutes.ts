import express from "express";
import passport from "passport";
import authController from "../controllers/authController";
import {
  validateForgotPassword,
  validateRefreshToken,
  validateRegister,
  validateResetPassword,
  validateSignin,
  validateVerifyEmail,
} from "../validation/authValidation";
import { cookieOptions } from "../constants";

const router = express.Router();

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
  (req, res) => {
    const user = req.user as any;
    const { accessToken, refreshToken } = user;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    res.redirect("http://localhost:3000/oauth-success");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:3000/sign-in",
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;
    const { accessToken, refreshToken } = user;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    res.redirect("http://localhost:3000/oauth-success");
  }
);

router.post("/register", validateRegister, authController.register);
router.post("/verify-email", validateVerifyEmail, authController.verifyEmail);
router.get("/verification-email/:email", authController.getVerificationEmail);
router.post("/sign-in", validateSignin, authController.signin);
router.get("/refresh-token", validateRefreshToken, authController.refreshToken);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);
router.get("/sign-out", authController.signout);

export default router;
