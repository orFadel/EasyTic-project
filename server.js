const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./product');

const app = express();
const PORT = 2001;

app.use(express.static(__dirname));  
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://orfadel13:V80lS9h06s5fXTde@easytic.zd6bg.mongodb.net/EasyTic?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePage.html'));
});

// Route for other pages
app.get('/dubai', (req, res) => res.sendFile(path.join(__dirname, 'dubai.html')));
app.get('/london', (req, res) => res.sendFile(path.join(__dirname, 'london.html')));
app.get('/paris', (req, res) => res.sendFile(path.join(__dirname, 'paris.html')));
app.get('/rome', (req, res) => res.sendFile(path.join(__dirname, 'rome.html')));
app.get('/q&a', (req, res) => res.sendFile(path.join(__dirname, 'q&a.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'loginPage.html')));

// Login or Register Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            user = new User({ username, password });
            await user.save();
            res.status(201).send('User registered and logged in successfully');
        } else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).send('Incorrect password');
            }
            res.status(200).send('Login successful');
        }
    } catch (error) {
        res.status(400).send('Login error: ' + error.message);
    }
});

app.post('/add-attraction', async (req, res) => {
    try {
        const existingAttraction = await Product.findOne({ productId: req.body.productId });
        if (existingAttraction) {
            return res.status(400).json({ message: 'Attraction already exists' });
        }

        const newAttraction = new Product(req.body);
        const savedAttraction = await newAttraction.save();
        res.status(201).json({
            message: 'Attraction added successfully',
            data: savedAttraction
        });
    } catch (error) {
        console.error('Error adding attraction:', error);
        res.status(500).json({ message: 'Error adding attraction', error });
    }
});


// ראוט לשליפת כל האטרקציות מבסיס הנתונים
app.get('/get-attractions', async (req, res) => {
    try {
        const attractions = await Product.find({});
        console.log('Attractions found:', attractions); // לוג נוסף לבדיקת הנתונים
        res.status(200).json(attractions);
    } catch (error) {
        console.error('Error retrieving attractions:', error);
        res.status(500).json({ message: 'Error retrieving attractions', error });
    }
});


// ראוט להוספת רכישה להיסטוריית הקניות של המשתמש
app.post('/add-purchase', async (req, res) => {
    const { username, purchase } = req.body; // נניח ש-purchase מכיל את פרטי הרכישה
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        user.purchaseHistory.push(purchase);
        await user.save();
        
        res.status(200).send('Purchase added to history successfully');
    } catch (error) {
        res.status(500).send('Error adding purchase: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
