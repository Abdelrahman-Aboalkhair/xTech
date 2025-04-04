import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { oauthCallback } from "../utils/authUtils";

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) =>
        oauthCallback("googleId", accessToken, refreshToken, profile, done)
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.FACEBOOK_CALLBACK_URL_PROD!
            : process.env.FACEBOOK_CALLBACK_URL_DEV!,
        profileFields: ["id", "emails", "name"],
      },
      (accessToken, refreshToken, profile, done) =>
        oauthCallback("facebookId", accessToken, refreshToken, profile, done)
    )
  );
}
