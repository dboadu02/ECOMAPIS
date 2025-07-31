const Router = require("express");
const {  loggingOut } = require("../controllers/logOutController");

const logOutRouter = Router();

//CRUD
logOutRouter
            .post("/user/logout", loggingOut);

module.exports = logOutRouter;
