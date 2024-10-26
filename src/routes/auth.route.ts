import { Router } from "express";
import { register } from "../controllers/auth/register.controller";
import { login } from "../controllers/auth/login.controller";
import { logout } from "../controllers/auth/logout.controller";
import { send_email_otp } from "../controllers/auth/send_email_otp.controller";
import { verify_email_otp } from "../controllers/auth/verify_email_otp.controller";
import { change_password } from "../controllers/auth/change_password";
import { isAuthenticated } from "../middleware/auth.middleware";
import upload from "../utils/multer";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login); //Done
router.get("/logout", isAuthenticated, logout); //Done
router.post("/send-email-otp", send_email_otp); //Done
router.post("/verify-email-otp", verify_email_otp); //Done
router.post("/change-password", change_password); //Done

export default router;
