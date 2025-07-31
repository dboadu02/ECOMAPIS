const jwt = require('jsonwebtoken');
const userModel = require('../schemas/userSchema');


const authMiddleware = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const jwtSecret = process.env.JWT_SECRET;

    if(!accessToken) {
        return res.status(401).json({message: "Please login first"})
    } try {
        const verifiedToken = jwt.verify(accessToken, jwtSecret)
        if (!verifiedToken) {
          return res.status(401).json({ message: "Invalid token" });
        }
        const verifieduser = await userModel.findById(verifiedToken.id).select("-password");
        if(!verifieduser) {
            return res.status(404).json({message: "Invalid id"})
        }
        req.user = verifieduser
        next()

    } catch (error) {
        return res.status(500).json({message: "jwt token expired, please login again"})
        
    }
}


module.exports = authMiddleware;