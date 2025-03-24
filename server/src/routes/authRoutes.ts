import express from "express";
import * as authController from "../controllers/authController";
import {
  validateForgotPassword,
  validateGoogleAuth,
  validateRefreshToken,
  validateRegister,
  validateResetPassword,
  validateSignin,
  validateVerifyEmail,
} from "../validation/authValidation";

const router = express.Router();

router.post("/google-signup", validateGoogleAuth, authController.googleSignup);
router.post("/google-signin", validateGoogleAuth, authController.googleSignin);
router.post("/register", validateRegister, authController.register);
router.post("/verify-email", validateVerifyEmail, authController.verifyEmail);
router.get("/verification-email/:email", authController.getVerificationEmail);
router.post("/signin", validateSignin, authController.signin);
router.post(
  "/refresh-token",
  validateRefreshToken,
  authController.refreshToken
);
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
