import express from "express";
import authController from "../controllers/authController";
import {
  validateForgotPassword,
  validateRefreshToken,
  validateRegister,
  validateResetPassword,
  validateSignin,
  validateVerifyEmail,
} from "../validation/authValidation";
import passport from "passport";

const router = express.Router();

router.get(
  "google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/sign-in",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
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
router.get("/signout", authController.signout);

export default router;
