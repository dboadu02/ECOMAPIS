const Router = require("express")
const { verifyOTP, resendOTP } = require("../controllers/otpController")

const otpRouter = Router()


otpRouter
        .post("/otp/verify", verifyOTP)
        .post("/otp/resend", resendOTP)





module.exports = otpRouter