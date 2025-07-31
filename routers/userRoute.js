const Router = require("express");
const {
  createUser,
  readUser,
  getOneUser,
  editUser,
  editProfile,
  deleteUser,
  getProducts
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authmiddleware");
const userRouter = Router();

//CRUD
userRouter
  .post("/user/register", createUser)

  .get("/users", authMiddleware, readUser)
  .get("/user/:id", getOneUser)

  .put("/user/update/:id", editUser)
  .put("/profile/update/:id", editProfile)

  .delete("/user/delete/:id", authMiddleware, deleteUser)
  .get("/products", getProducts);


module.exports = userRouter;
