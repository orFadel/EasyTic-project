const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./User'); // Adjust the path to wherever User.js is located

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
        // חפש את המשתמש במסד הנתונים
        let user = await User.findOne({ username });

        if (!user) {
            // אם המשתמש לא קיים, צור משתמש חדש
            user = new User({ username, password });
            await user.save();
            res.status(201).send('User registered and logged in successfully');
        } else {
            // אם המשתמש קיים, השווה את הסיסמאות
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).send('סיסמה שגויה');
            }
            res.status(200).send('Login successful');
        }
    } catch (error) {
        res.status(400).send('שגיאה בתהליך החיבור: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
