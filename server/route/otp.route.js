// import express from "express"
// import { sendForgotPasswordOtp, sendSignupOtp, verifySignupOtp, resetPassword, sendUpdatePasswordOtp, updatePasswordAfterLogin} from "../controller/otp.controller.js"
// import { verifyJWT } from "../middleware/jwt.middleware.js";
// import {canSendMessage} from "../utils/ratelimiter.js"
// const otpRouter = express.Router()
// otpRouter.post("/signup/sendotp", canSendMessage ,sendSignupOtp);
// otpRouter.post("/signup/verifyotp", verifySignupOtp);

// otpRouter.post("/forgot/sendotp",canSendMessage, sendForgotPasswordOtp);
// otpRouter.post("/forgot/resetpassword", canSendMessage, resetPassword);

// otpRouter.post("/update/sendotp", verifyJWT, canSendMessage, sendUpdatePasswordOtp);
// otpRouter.post("/update/password", verifyJWT, canSendMessage, updatePasswordAfterLogin);

// export default otpRouter

import express from "express"
import { sendForgotPasswordOtp, sendSignupOtp, verifySignupOtp, resetPassword, sendUpdatePasswordOtp, updatePasswordAfterLogin} from "../controller/otp.controller.js"
import { verifyJWT } from "../middleware/jwt.middleware.js";
import {canSendMessage} from "../utils/ratelimiter.js"
const otpRouter = express.Router()
otpRouter.post("/signup/sendotp"  ,sendSignupOtp);
otpRouter.post("/signup/verifyotp", verifySignupOtp);

otpRouter.post("/forgot/sendotp", sendForgotPasswordOtp);
otpRouter.post("/forgot/resetpassword", resetPassword);

otpRouter.post("/update/sendotp", verifyJWT, sendUpdatePasswordOtp);
otpRouter.post("/update/password", verifyJWT, updatePasswordAfterLogin);

export default otpRouter