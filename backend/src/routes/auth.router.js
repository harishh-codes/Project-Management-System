import { Router } from "express";
import { changePassword, forgotPasswordRequest, getCurrentUser, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/auth.controller.js"
import { userChangeCurrentPasswordValidator, userForgotPasswordRequestValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js";
import { userLoginValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

// Unsecure Route

router.route("/register").post(userRegisterValidator(), validate, registerUser)

router.route("/login").post(userLoginValidator(), validate, login)

router.route("/verify-email/:verificationToken").get(verifyEmail)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/forgot-password").post(userForgotPasswordRequestValidator(), validate, forgotPasswordRequest)

router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword)

// Secure Route

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/current-user").post(verifyJWT, getCurrentUser)

router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changePassword)

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)

export default router;