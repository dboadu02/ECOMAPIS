const Cart = require("../schemas/cartSchema");
const Product = require("../schemas/productSchema");

const createCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    //check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    //check for cart existence
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      cart = new Cart({
        userId: userId,
        products: [
          {
            productId: product._id,
            quantity: 1,
            price: product.price,
          },
        ],
      });
      await cart.save();
    } else {
      //check if product already exists in the cart
      const existingCartItem = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingCartItem) {
        // if Product already exists in the cart, update quantity
        existingCartItem.quantity += 1;
      } else {
        // Product does not exist in the cart, add new item
        cart.products.push({
          productId: product._id,
          quantity: 1,
          price: product.price,
        });
      }
    }
    //update totalItemPrice of each member of cart array
    cart.products.forEach(
      (item) => (item.totalItemPrice = item.quantity * item.price)
    );

    //update the totalCartPrice of the cart
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    //save the cart both existing or newly created cart
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//UPDATE CART ITEM

const editCartItem = async (req, res) => {
  const { productId, type } = req.body; //types can be "increase" or "decrease"
  //const { productId, type } = req.params
  if (!productId || !type) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }
  const userid = req.user._id;
  try {
    //check for users cart
    const cart = await Cart.findOne({ userId: userid });
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }
    //check for the specific item in the products array
    const existingCartItem = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (type === "increase") {
      existingCartItem.quantity += 1;
    } else if (type === "decrease" && existingCartItem.quantity > 1) {
      existingCartItem.quantity -= 1;
    } else {
      res
        .status(400)
        .json({ message: "type can be either increase or decrease" });
      return;
    }
    //update totalItemPrice of each member of the cart array
    cart.products.forEach((item) => {
      item.totalItemPrice = item.price * item.quantity;
    });
    //update the totalCartPrice of the cart
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    //save the cart both existing or newly created cart
    await cart.save();
    await cart.populate("products.productId");
    res.status(200).json(cart);
  } catch (error) {
    console.log(error.message);
  }
};

//GET CART ITEMS
const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
};

const clearCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }
    cart.products = [];
    cart.totalCartPrice = 0;
    await cart.save();
    res.status(200).json({ mess: "Cart deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

//delete a particular item
const deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }

    //check if the product exists in the cart
    const existingCartItem = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingCartItem) {
      res.status(400).json({ message: "Product not found in cart" });
      return;
    }

    /* removing product to deleted by returing all items
    except the one to be deleted */
    const filteredCart = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );
    cart.products = filteredCart;
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Item deleted successfully", cart });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  createCartItem,
  getCartItems,
  editCartItem,
  clearCartItems,
  deleteCartItem,
};
