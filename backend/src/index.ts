import express, { type Application } from "express";
import env from "dotenv";
import cors from "cors";
import { mongoUri, connectDB } from "./configs/db.ts";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

import "./configs/googleCustomerStrategy.ts";
import "./configs/googleAdminStrategy.ts";

import authRoutes from "./routes/authRoutes.ts";
import categoryRoutes from "./routes/categoryRoutes.ts";

env.config();
connectDB();

export const app: Application = express();
const port: number =
  process.env.NODE_ENV === "development"
    ? parseInt(process.env.DEV_PORT || "8000")
    : parseInt(process.env.TEST_PORT || "8001");
const allowedOrigins: string[] = [
  process.env.CUSTOMER_ORIGIN || "",
  process.env.VENDOR_ORIGIN || "",
  process.env.ADMIN_ORIGIN || "",
];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store:
      process.env.NODE_ENV === "test"
        ? undefined
        : MongoStore.create({
            mongoUrl: mongoUri || "",
            collectionName: "sessions",
            ttl: 30 * 24 * 60 * 60,
          }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);

app.listen(port, () => console.log("Server is listening on port: " + port));

passport.serializeUser((user: any, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => done(null, user));
