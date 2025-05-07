const express = require('express');
const router = express.Router();
const User = require('./User');
const Product = require('./product');
const Order = require('./order');


// הוספת אטרקציה לרשימת המועדפים של המשתמש
router.put('/add-attraction', async (req, res) => {
    const { userId, attractionId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { favorites: attractionId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'Attraction added to favorite attractions successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// הסרת אטרקציה מרשימת המועדפים של המשתמש
router.put('/remove-attraction', async (req, res) => {
    const { userId, attractionId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: attractionId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'Attraction removed from favorite attractions successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// החזרת 10 האטרקציות המועדפות ביותר לפי מספר רכישות
router.get('/top-attractions', async (req, res) => {
    try {
        const orders = await Order.find();
        const attractionCountMap = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const name = item.productName;
                attractionCountMap[name] = (attractionCountMap[name] || 0) + item.amount;
            });
        });

        const sorted = Object.entries(attractionCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));

        res.status(200).json({ message: 'Top attractions retrieved', data: sorted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// החזרת 10 האטרקציות האחרונות שנרכשו
router.get('/recent-orders', async (req, res) => {
    try {
        const recentOrders = await Order.find({})
            .sort({ purchaseDate: -1 })
            .limit(10);

        const recentItems = recentOrders.flatMap(order =>
            order.items.map(item => ({
                orderNumber: order.orderNumber,
                purchaseDate: order.purchaseDate,
                productName: item.productName,
                category: item.category,
                country: item.contry,
                type: item.type,
                price: item.price,
                amount: item.amount
            }))
        );

        res.status(200).json({ message: 'Recent orders retrieved successfully', data: recentItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// שליפת רשימת האטרקציות המועדפות של משתמש לפי מזהה
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user || !user.favorites || user.favorites.length === 0) {
            return res.status(404).send({ message: 'No favorite attractions found for this user.' });
        }

        const favoriteAttractions = await Product.find({ _id: { $in: user.favorites } });

        res.status(200).send({
            message: 'Favorite attractions retrieved successfully.',
            favorites: favoriteAttractions
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
