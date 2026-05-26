import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Customer } from "../models/User.ts";
import env from "dotenv";

env.config();

passport.use(
  "google_customer",
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CUSTOMER_CALLBACK_URL || "",
    },
    // @ts-ignore
    async (accessToken, refreshToken, profile, done) => {
      try {
        const customer = await Customer.findOne({
          googleId: profile.id,
        });
        if (!customer) {
          const newCustomer = new Customer({
            displayName: profile.displayName,
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            role: "customer",
            profilePicture: profile.photos?.[0]?.value || "",
          });
          await newCustomer.save();
          return done(null, newCustomer);
        }
        return done(null, customer);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
