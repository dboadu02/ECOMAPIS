const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchemaItem = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  totalItemPrice: {
    type: Number,
  },
  price: {
    type: Number
  }
});

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    products: [cartSchemaItem],
    totalCartPrice: {
        type: Number,
        required: true,
      }

    
}, {timestamps: true});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;