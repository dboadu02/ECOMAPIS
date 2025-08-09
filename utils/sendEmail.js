const nodemailer = require("nodemailer");
const crypto = require("crypto");


const sendMail = async ({mailFrom, mailTo, subject, body}) => {
    
    try{
        
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        //send mail
        const info = await transporter.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: subject,   
            html: body
    })
    return info
    } catch(err){
        console.log(err.message)
    }
    

}


const generateOTP = () => {
  return {
    otp: Math.floor(100000 + Math.random() * 900000).toString(),
    otpExpires: new Date(Date.now() + 2 * 60 * 1000),

    resetToken : crypto.randomBytes(32).toString("hex"),
  };
};


module.exports = {
    sendMail,
    generateOTP
}