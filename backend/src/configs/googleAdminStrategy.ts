import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Admin } from "../models/User.ts";
import env from "dotenv";

env.config();

passport.use(
  "google_admin",
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_ADMIN_CALLBACK_URL || "",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const admin = await Admin.findOne({
          googleId: profile.id,
        });

        if (!admin) {
          const newAdmin = new Admin({
            displayName: profile.displayName,
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            role: "admin",
            profilePicture: profile.photos?.[0]?.value || "",
          });
          await newAdmin.save();
          return done(null, newAdmin);
        }
        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
