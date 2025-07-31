const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    name : {
        type: String,
        required: true,
        
    },
    price : {
        type: Number,
        required: true,
        
    },
    color : {
        type: String,
        required: true
    },
    size : {
        type: Number,
        required: true
    },
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;





