const Product = require('../schemas/productSchema')


const createProduct = async (req, res) => {
    const { name, price, color, size } = req.body
    const {id} = req.user

    if (!name || !price || !color || !size) {
         res.status(400).json({ message: "Please fill all the fields" })
         return
    }

    try{
        const newProduct = new Product({...req.body, userId: id})
        await newProduct.save()
        res.status(201).json({ message: "Product created successfully"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}


// Get all products
const getuserproducts = async (req, res) => {
    const { id } = req.user;

    try {
        const products = await Product.find({ userId: id }).populate('userId');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getProductsByQuery = async (req, res) => {
  const { productName, color } = req.query;
  const filter = {};
  if (productName) {
    filter.name = productName;
  }
  if (color) {
    filter.color = color;
  }

  try {
    const product = await User.find(filter);
    if (!product) {
      return res.status(404).json({ message: "No products found!" });
    }
    res.json(product);
  } catch (err) {
    console.log(err.message);
  }
}

const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, color, size } = req.body;
    const reqId = req.user._id;

    try{
        const product = await Product.findOne({_id:id, userId: reqId})
        if(!product){
         res.status(404).json({ message: "Product not found!" });
         return
        }
        
        product.name = name ?? product.name
        product.price = price ?? product.price
        product.color = color ?? product.color
        product.size = size ?? product.size

        await product.save()

        //another method to update the product

    /* await Product.findByIdAndUpdate(id, {
        $set: {
            name: name,
            price: price,
            color: color,
            size: size
        }
    }, { new: true }) */

        res.status(200).json({ message: "Product updated successfully!", product })
    }catch(error){
        res.status(500).json(error.message)
        return

    }



    
}

const deleteProduct = async (req, res) => {
    res.status(501).json({ message: "This feature is not implemented yet" })
}








module.exports = { 
    createProduct, 
    getuserproducts,
    getAllProducts, 
    getProductsByQuery,
    editProduct, 
    deleteProduct
}
