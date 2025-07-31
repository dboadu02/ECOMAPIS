const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");

const loggingIn = async (req, res) => {
  const { email, password } = req.body;
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

module.exports = {loggingIn};
// module.exports = { loggingIn };
