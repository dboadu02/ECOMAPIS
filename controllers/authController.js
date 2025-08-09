const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const { sendMail, generateOTP } = require("../utils/sendEmail");
const crypto = require("crypto");

const loggingIn = async (req, res) => {
  const { email, password } = req.body;
  
  const mailObj = {
    mailFrom: `Ecomapis ${process.env.EMAIL_USER}`,
    mailTo: email,
    subject: "Successfully logged in",
    body: `
            <h1>Welcome to Ecommapis😍</h1>
            <p>you have successfully logged into your account</p>
            <p>Please proceed to make a post and enjoy the experience</p>
    `
  };

  if (!email || !password) {
    res.status(400).json({ message: "Please provide email and password" });
    return;
  }


  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "create an account" });
      return;
    }

    const compared = await bcrypt.compare(password, user.password);
    if (!compared) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Send email after successful login
    await sendMail(mailObj);

    const genToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2m",
      });
    };
    // Generate a token for the user
    const token = genToken(user._id);
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "strict", // Helps prevent CSRF attacks
      })
      .status(200)
      .json({ message: "Login successful, Proceed to make a post" });

      
      
  } catch (err) {
    res.status(500).json(err.message);
  }
};



//request password reset
const passwordResetRequest = async (req, res) => { 
const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "User not found please register first to continue" })
            return
        }
           

        const { resetToken, otpExpires } = generateOTP()
        const expiresAt = otpExpires
        user.passwordResetToken = resetToken
        user.passwordResetExpires = expiresAt
        
        await user.save()
         
        await sendMail({
        mailFrom: `Ecommapis ${process.env.EMAIL_USER}`,
        mailTo: email,
        subject: 'Reset Password Request',
        body:`
            <p>click on the link to reset your password</p>
            <a href="https://localhost:3000/pasword/reset/${resetToken}">Reset Password</a>
          `
    })
     res.status(200).json({ message: "Password reset request sent successfully" })
    } catch (error) {
        console.log(error)
    }
}


//reser password
const passwordReset = async (req, res) => { 
    const { resetToken, newPassword } = req.body
    
    try {
        const user = await User.findOne({ passwordResetToken: resetToken, passwordResetExpires: { $gt: Date.now() } })
        if (!user) return res.status(400).json({ message: "Password reset token is invalid or expired" })
        
        user.password = bcrypt.hashSync(newPassword, 10)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

       await user.save()
       res.status(200).json({ message: "Password reset successfully, proceed to login with your new password" })  
    } catch (error) {
        console.log(error)
    }

}


module.exports = {
  loggingIn,
  passwordResetRequest,
  passwordReset
};
// module.exports = { loggingIn };
