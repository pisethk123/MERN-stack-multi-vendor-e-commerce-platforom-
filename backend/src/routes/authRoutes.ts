import { Router } from "express";
import {
  googleAdminLogin,
  googleAdminLoginRedirect,
  googleCustomerLogin,
  googleCustomerLoginRedirect,
  googleVendorLogin,
  googleVendorLoginRedirect,
} from "../controllers/auth/authControllers.ts";

const router: Router = Router();

router.get("/google/customer", googleCustomerLogin);
router.get("/google/customer/callback", googleCustomerLoginRedirect);

router.get("/google/vendor", googleVendorLogin);
router.get("/google/vendor/callback", googleVendorLoginRedirect);

router.get("/google/admin", googleAdminLogin);
router.get("/google/admin/callback", googleAdminLoginRedirect);

export default router;
