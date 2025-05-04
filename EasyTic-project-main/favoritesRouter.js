const express = require('express');
const router = express.Router();

const User = require('./User');

// Fetch all favorite attractions of a user
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user || !user.favorites || user.favorites.length === 0) {
            return res.status(404).send({ message: 'No favorite attractions found for this user.' });
        }

        res.status(200).send({ message: 'Favorite attractions retrieved successfully.', favorites: user.favorites });
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

module.exports = router;