const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    /* profile: {
      country: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        required: true,
      },
    }, */
    otp: String,
    otpExpires: Date,
    otpCreatedAt: Date,
    isVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  }, { timestamps: true });

const User = mongoose.model('user', userSchema);
module.exports = User;





