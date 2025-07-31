const Router = require("express");
const { loggingIn } = require("../controllers/authController");

const authRouter = Router();




//CRUD
authRouter
  .post("/user/login", loggingIn)
   


module.exports = authRouter;
