import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as AppleStrategy } from "passport-apple";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Profile as AppleProfile } from "passport-apple";
import { Profile } from "passport";
import { oauthCallback } from "../utils/authUtils";
import { VerifyCallback } from "jsonwebtoken";

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => oauthCallback("googleId", accessToken, refreshToken, profile, done)
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
      (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
      ) => {
        console.log("facebook profile: ", profile);
        oauthCallback("facebookId", accessToken, refreshToken, profile, done);
      }
    )
  );

  // passport.use(
  //   new AppleStrategy(
  //     {
  //       clientID: process.env.APPLE_CLIENT_ID!,
  //       teamID: process.env.APPLE_TEAM_ID!,
  //       keyID: process.env.APPLE_KEY_ID!,
  //       privateKeyLocation: process.env.APPLE_PRIVATE_KEY!.replace(
  //         /\\n/g,
  //         "\n"
  //       ),
  //       callbackURL:
  //         process.env.NODE_ENV === "production"
  //           ? process.env.APPLE_CALLBACK_URL_PROD!
  //           : process.env.APPLE_CALLBACK_URL_DEV!,
  //       passReqToCallback: false as const,
  //     },
  //     (
  //       accessToken: string,
  //       refreshToken: string,
  //       decodedIdToken: any,
  //       profile: Profile,
  //       done: VerifyCallback
  //     ) => oauthCallback("appleId", accessToken, refreshToken, profile, done)
  //   )
  // );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY! || "sdslfkjisej",
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.TWITTER_CALLBACK_URL_PROD!
            : process.env.TWITTER_CALLBACK_URL_DEV!,
        includeEmail: true,
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => oauthCallback("twitterId", accessToken, refreshToken, profile, done)
    )
  );
}
