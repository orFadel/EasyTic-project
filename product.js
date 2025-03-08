<<<<<<< HEAD
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    attractionName: { type: String, required: true },
    ticketTypes: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
    }],
});


const Product = mongoose.model('product', productSchema, 'products');

module.exports = Product;
=======
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    attractionName: { type: String, required: true },
    ticketTypes: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
    }],
});


const Product = mongoose.model('product', productSchema, 'products');

module.exports = Product;
>>>>>>> 6ab9571fae77d3e9e904904252e5c58053a79d66
