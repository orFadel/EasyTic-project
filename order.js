const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: Number, required: true, unique: true }, // מספר הזמנה ייחודי
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // התייחסות למשתמש
    items: [
        {
            productId: { type: Number, required: true },
            productName: { type: String, required: true },
            category: { type: String, required: true },
            contry: { type: String, required: true }, // שינוי ל-country
            type: { type: String, required: true }, // לדוגמה: "מבוגר", "ילד"
            price: { type: Number, required: true, min: 0 },
            amount: { type: Number, default: 1, min: 1 }
        }
    ],
    totalCost: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
