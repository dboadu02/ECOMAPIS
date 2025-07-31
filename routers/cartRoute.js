const Router = require("express");
const {
  createCartItem,
  getCartItems,
  editCartItem,
  clearCartItems,
  deleteCartItem
} = require("../controllers/cartController")
const authMiddleware = require("../middlewares/authmiddleware");

const cartRouter = Router()

//CRUD
cartRouter
  .post("/cart/create/:productId", authMiddleware, createCartItem)
  .get("/carts", authMiddleware, getCartItems)
  .put("/cart/update", authMiddleware, editCartItem)
  .delete("/cart/delete", authMiddleware, clearCartItems)
  .delete("/cart/delete/:productId", authMiddleware, deleteCartItem)

// .get("/products/getUserProducts", authMiddleware, getuserproducts)
module.exports = cartRouter;
