const loggingOut = async (req, res) => {
  try {
    // Clear the accessToken cookie
    return res
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { loggingOut };