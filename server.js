const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./User');
const Product = require('./product');
const Order = require('./order'); 
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 2001;

app.use(express.static(__dirname)); 
app.use(cors()); 
app.use(express.json()); // For parsing application/json
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://orfadel13:V80lS9h06s5fXTde@easytic.zd6bg.mongodb.net/EasyTic?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
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

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt with:', username, password); // בדיקה של הסיסמה שהוזנה

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // השוואת הסיסמה באמצעות argon2.verify
        const validPassword = await argon2.verify(user.password, password);
        console.log('Entered Password:', password); // סיסמה שהוזנה
        console.log('Hashed Password from DB:', user.password); // הסיסמה המוצפנת ממסד הנתונים
        console.log('Is valid password:', validPassword); // אם התוצאה נכונה או לא

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        req.session.username = username;
        return res.status(200).json({ userId: user._id, displayName: user.displayName });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Registration Route
app.post('/register', async (req, res) => {
    const { username, password, displayName } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        } else {
            // פשוט צור את המשתמש בלי להכניס הצפנה
            const newUser = new User({ username, password, displayName });
            await newUser.save(); // ה-pre hook ידאג להצפנה
            
            req.session.username = username;
            return res.status(201).json({ userId: newUser._id, displayName: newUser.displayName });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update the user's cart
app.post('/api/cart/update', async (req, res) => {
    console.log('Received cart update:', req.body);
    const { username, cart } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty or undefined' });
    }

    if (!username || !cart) {
        return res.status(400).json({ message: 'Username or cart is missing' });
    }

    try {
        let user = await User.findOne({ username: username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the cart in the user's document
        cart.forEach(item => {
            // Find the existing item in the cart by productId and type
            const existingItemIndex = user.cart.findIndex(cartItem => 
                cartItem.productId === item.id && cartItem.type === item.type
            );
            
            if (existingItemIndex !== -1) {
                // If item already exists, update its quantity
                console.log('Updating existing item:', user.cart[existingItemIndex]);
                user.cart[existingItemIndex].amount += item.amount;
            } else {
                // If item doesn't exist, add it to the cart
                console.log('Adding new item to cart:', item);
                user.cart.push({
                    productId: item.id,  // Use the item.id for productId
                    productName: item.name,
                    category: item.category,
                    contry: item.contry,
                    type: item.type,
                    price: item.price,
                    amount: item.amount
                });
            }
        });

        await user.save();
        console.log('Cart updated successfully for user:', username);
        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/cart', async (req, res) => {
    const { username } = req.query;

    try {
        let user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId); // Make sure you handle this correctly
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json({ cart: user.cart });
});

app.get('/api/updateCartCount', async (req, res) => {
    const username = req.session.username; // נניח שאתה שומר את שם המשתמש בסשן
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findOne({ username: username }, 'cart'); // מחזיר רק את העגלה
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user.cart); // מחזיר את העגלה
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
}); 

// נתיב למחיקת פריט מעגלת הקניות
app.post('/api/cart/delete', async (req, res) => {
    const { username, productId, type } = req.body;

    if (!username || !productId || !type) {
        return res.status(400).json({ message: "Missing parameters" });
    }

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Current cart before removal:', user.cart);

        // Filter out the item to be removed
        user.cart = user.cart.filter(item => !(item.productId === productId && item.type === type));

        // Save the updated user document
        await user.save(); 

        console.log('Updated cart after removal:', user.cart);

        res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        console.error('Error during item removal:', error);
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
});

// Route to add an attraction
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

// Route to retrieve all attractions
app.get('/get-attractions', async (req, res) => {
    try {
        const attractions = await Product.find({});
        console.log('Attractions found:', attractions);
        res.status(200).json(attractions);
    } catch (error) {
        console.error('Error retrieving attractions:', error);
        res.status(500).json({ message: 'Error retrieving attractions', error });
    }
});

// Route to add purchase to user's history
app.post('/add-purchase', async (req, res) => {
    const { username, purchase } = req.body;
    
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

app.post('/create-order', async (req, res) => {
    const { userId, items } = req.body;

    // חישוב עלות כוללת
    const totalCost = items.reduce((total, item) => total + item.price * item.amount, 0);
    
    // יצירת הזמנה חדשה
    const order = new Order({
        orderNumber: Date.now(), // או מספר ייחודי אחר
        userId,
        items,
        totalCost
    });

    try {
        // שמירת ההזמנה במסד הנתונים
        const savedOrder = await order.save();
        
        // עדכון המשתמש עם הרפרנס להזמנה
        await User.findByIdAndUpdate(userId, {
            $push: { purchaseHistory: { orderNumber: savedOrder.orderNumber } } // הוספת הזמנה להיסטורית רכישות
        });

        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});

// פונקציה לטיפול בתשלום ויצירת הזמנה
app.post('/payment', async (req, res) => {
    const { userId } = req.body;  // קבלת ה-userId מהבקשה

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // חיפוש המשתמש על ידי userId
        const user = await User.findById(userId);
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // חישוב העלות הכוללת
        const totalCost = user.cart.reduce((total, item) => total + item.price * item.amount, 0);

        // יצירת הזמנה חדשה ושמירתה במודל Order
        const newOrder = new Order({
            orderNumber: Date.now(), // שימוש ב- Date.now() כמספר הזמנה ייחודי
            userId: userId,
            items: user.cart,
            totalCost: totalCost,
            purchaseDate: new Date()
        });

        // שמירת ההזמנה במסד הנתונים
        await newOrder.save();

        // הוספת רפרנס להזמנה ב-purchaseHistory של המשתמש
        user.purchaseHistory.push({
            orderNumber: newOrder.orderNumber,  // רפרנס להזמנה
        });

        // מחיקת העגלה לאחר ביצוע ההזמנה
        user.cart = [];
        await user.save();

        // החזרת התגובה ללקוח עם מספר ההזמנה
        res.status(200).json({ message: 'Order placed successfully', orderNumber: newOrder.orderNumber });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Error processing order' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
