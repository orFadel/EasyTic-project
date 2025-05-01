const express = require('express');
const router = express.Router();
const Product = require('./products'); 

router.put('/update-attraction/:productId', async (req, res) => {
    const { productId } = req.params;
    const updatedData = req.body;

    try {
        const result = await Product.findOneAndUpdate(
            { productId },
            { $set: updatedData },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'אטרקציה לא נמצאה לעדכון.' });
        }

        res.json({ message: 'האטרקציה עודכנה בהצלחה', data: result });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת בעת עדכון האטרקציה', error });
    }
});

module.exports = router;
