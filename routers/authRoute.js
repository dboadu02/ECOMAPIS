const Router = require("express");
const { loggingIn, passwordResetRequest, passwordReset } = require("../controllers/authController");

const authRouter = Router();




//CRUD
authRouter
  .post("/user/login", loggingIn)
  .post('/password/resetRequest', passwordResetRequest)
  .post('/password/reset', passwordReset)
   


module.exports = authRouter;
