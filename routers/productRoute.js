const Router = require("express");
const { createProduct, getuserproducts, getAllProducts, getProductsByQuery, editProduct, deleteProduct } = require("../controllers/productController");
const authMiddleware = require("../middlewares/authmiddleware");
const productRouter = Router();

//CRUD
productRouter
  .post("/product/create",authMiddleware, createProduct)

  .get("/products/getUserProducts",authMiddleware, getuserproducts)
  .get("/products/getAll",authMiddleware, getAllProducts)
  .get("/getByQueryParams",authMiddleware, getProductsByQuery)

  .put("/product/update/:id",authMiddleware, editProduct)

  .delete("/product/delete/:id",authMiddleware, deleteProduct)
  

module.exports = productRouter;
