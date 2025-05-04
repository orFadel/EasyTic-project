const mongoose = require('mongoose');

const searchesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    createdAt: { type: Date, required: true }
});


const Searches = mongoose.model('searche', searchesSchema, 'searches');

module.exports = Searches;
