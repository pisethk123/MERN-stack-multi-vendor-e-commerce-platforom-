import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Vendor } from "../models/User.ts";
import env from "dotenv";

env.config();

passport.use(
  "google_vendor",
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_VENDOR_CALLBACK_URL || "",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const vendor = await Vendor.findOne({
          googleId: profile.id,
        });

        if (!vendor) {
          const newVendor = new Vendor({
            displayName: profile.displayName,
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            role: "vendor",
            profilePicture: profile.photos?.[0]?.value || "",
          });
          await newVendor.save();
          return done(null, newVendor);
        }
        return done(null, vendor);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
