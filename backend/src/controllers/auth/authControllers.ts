import passport from "passport";

export const googleCustomerLogin = passport.authenticate("google_customer", {
  scope: ["profile", "email"],
});

export const googleCustomerLoginRedirect = passport.authenticate(
  "google_customer",
  {
    failureRedirect: "/login-failed",
    successRedirect: "/login-success",
  },
);

export const googleVendorLogin = passport.authenticate("google_vendor", {
  scope: ["profile", "email"],
});

export const googleVendorLoginRedirect = passport.authenticate(
  "google_vendor",
  {
    failureRedirect: "/login-failed",
    successRedirect: "/login-success",
  },
);

export const googleAdminLogin = passport.authenticate("google_admin", {
  scope: ["profile", "email"],
});

export const googleAdminLoginRedirect = passport.authenticate("google_admin", {
  failureRedirect: "/login-failed",
  successRedirect: "/login-success",
});
