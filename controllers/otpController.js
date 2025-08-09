const User = require("../schemas/userSchema")
const { sendMail, generateOTP } = require("../utils/sendEmail");


const verifyOTP = async (req, res) => {
  const { otp, email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      res
        .status(400)
        .json({ message: "User not found please register first to continue" });
      return;
    }
    if (user.isVerified) return res.status(400).json({ message: "OTP is already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "OTP is incorrect" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP is expired" });

    //verify otp
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;

    await user.save()

    //send verification email
    await sendMail({
      mailFrom: `Ecommapis ${process.env.EMAIL_USER}`,
      mailTo: email,
      subject: "Verification",
      body: `
            <p>Your email has successfully been verified.</p>
            <p>Thank you!</p>
          `,
    });

    res
      .status(200)
      .json({ message: "OTP is verified, please proceed to login" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const { otp, otpExpires } = generateOTP();

    const time = Date.now()

    if (!user) {
      res
        .status(400)
        .json({ message: "User not found, please register first" });
      return;
    }
    if (user.isVerified) return res.status(400).json({ message: "OTP is already verified" });
    if (time - user.otpCreatedAt < 2 * 60 * 1000){
      return res
        .status(400)
        .json({ message: "Wait for 2mins before resending OTP" })
      }

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpCreatedAt = time;
    await user.save();

    await sendMail({
      mailFrom: `Ecommapis ${process.env.EMAIL_USER}`,
      mailTo: email,
      subject: "Updated OTP",
      body: `
            <p>Here is your OTP ${otp}, proceed to verify</p>
          `,
    })
    res.status(200).json({ message: "OTP is resent successfully" });
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  verifyOTP,    
  resendOTP
}