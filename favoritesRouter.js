const express = require('express');
const router = express.Router();
const User = require('./User');
const Attraction = require('./Attraction');
const Product = require('./product'); 
const Order = require('./order');


// Fetch all favorite attractions of a user
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user || !user.favorites || user.favorites.length === 0) {
            return res.status(404).send({ message: 'No favorite attractions found for this user.' });
        }

        // שליפת פרטי האטרקציות המלאים לפי מזהים
        const favoriteAttractions = await Attraction.find({ _id: { $in: user.favorites } });

        res.status(200).send({
            message: 'Favorite attractions retrieved successfully.',
            favorites: favoriteAttractions
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Remove an attraction from the user's list of favorite attractions
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

// Add an attraction to the user's list of favorite attractions
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

// החזרת 10 האטרקציות המועדפות ביותר
router.get('/top-attractions', async (req, res) => {
    try {
        const orders = await Order.find();

        const attractionCountMap = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const name = item.productName;
                if (!attractionCountMap[name]) {
                    attractionCountMap[name] = 0;
                }
                attractionCountMap[name] += item.amount;
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
            .sort({ purchaseDate: -1 }) // מהכי חדש
            .limit(10);

        // הפיכת פריטי ההזמנה לרשימה שטוחה של פרטי אטרקציות
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


module.exports = router;
