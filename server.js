<<<<<<< HEAD
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./User');
const Product = require('./product');
const Order = require('./order'); 
const cors = require('cors');
const session = require('express-session');
const Question = require('./question');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

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

// אימות ומידלוור
const isAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'אימות נכשל - נדרש טוקן' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'טוקן לא תקין' });
    }
};

const adminAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'אימות נכשל - נדרש טוקן' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'אין לך הרשאות מנהל' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'טוקן לא תקין' });
    }
};

// נתיבי דפים סטטיים
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePage.html'));
});

app.get('/dubai', (req, res) => res.sendFile(path.join(__dirname, 'dubai.html')));
app.get('/london', (req, res) => res.sendFile(path.join(__dirname, 'london.html')));
app.get('/paris', (req, res) => res.sendFile(path.join(__dirname, 'paris.html')));
app.get('/rome', (req, res) => res.sendFile(path.join(__dirname, 'rome.html')));
app.get('/q&a', (req, res) => res.sendFile(path.join(__dirname, 'q&a.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'loginPage.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'adminDeshboard.html')));
app.get('/admin-dashboard', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'adminDeshboard.html'));
});

// התחברות
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // שמירת פרטי המשתמש ב-session
        req.session.userId = user._id;
        req.session.username = username;
        req.session.isAdmin = user.isAdmin;

        // יצירת JWT token
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email || user.username,
            isAdmin: user.isAdmin
        }, JWT_SECRET, { expiresIn: '7d' });

        console.log('Login successful. User isAdmin:', user.isAdmin);
        console.log('Session data:', req.session);

        res.status(200).json({ 
            userId: user._id, 
            displayName: user.displayName,
            email: user.email || user.username,
            isAdmin: user.isAdmin,
            role: user.isAdmin ? "admin" : "user",
            token: token // החזרת הטוקן ללקוח
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// התנתקות
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// הרשמה
app.post('/register', async (req, res) => {
    const { username, password, displayName, email } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        } else {
            // יצירת משתמש חדש
            const newUser = new User({ 
                username, 
                password, 
                displayName,
                email: email || username // אם לא סופק מייל, השתמש בשם המשתמש
            });
            
            await newUser.save(); // ה-pre hook ידאג להצפנה
            
            req.session.username = username;
            return res.status(201).json({ 
                userId: newUser._id, 
                displayName: newUser.displayName,
                email: newUser.email 
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// עגלת קניות
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

        console.log('Current user cart:', user.cart);

        // Update the cart in the user's document
        for (const item of cart) {
            // מחרוזת id מובטחת
            const itemId = item.id.toString();
            
            // Find the existing item in the cart by productId and type
            const existingItemIndex = user.cart.findIndex(cartItem => 
                cartItem.productId === itemId && cartItem.type === item.type
            );
            
            if (existingItemIndex !== -1) {
                // If item already exists, update its quantity
                console.log('Updating existing item:', user.cart[existingItemIndex]);
                user.cart[existingItemIndex].amount += item.amount;
            } else {
                // If item doesn't exist, add it to the cart
                console.log('Adding new item to cart:', item);
                user.cart.push({
                    productId: itemId, // שומר את ה-ID כמחרוזת
                    productName: item.name,
                    category: item.category,
                    contry: item.contry,
                    type: item.type,
                    price: item.price,
                    amount: item.amount
                });
            }
        }

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
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json({ cart: user.cart });
});

app.get('/api/updateCartCount', async (req, res) => {
    const username = req.session.username;
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findOne({ username: username }, 'cart');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
}); 

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

// אטרקציות
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

app.get('/api/attraction/:id', async (req, res) => {
    try {
        const attraction = await Product.findById(req.params.id);
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json(attraction);
    } catch (error) {
        console.error('Error fetching attraction:', error);
        res.status(500).json({ message: 'Error fetching attraction data' });
    }
});

app.put('/api/attraction/:id', isAdmin, async (req, res) => {
    try {
        const attraction = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json({ message: 'Attraction updated successfully', data: attraction });
    } catch (error) {
        console.error('Error updating attraction:', error);
        res.status(500).json({ message: 'Error updating attraction' });
    }
});

app.delete('/api/attraction/:id', isAdmin, async (req, res) => {
    try {
        const attraction = await Product.findByIdAndDelete(req.params.id);
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json({ message: 'Attraction deleted successfully' });
    } catch (error) {
        console.error('Error deleting attraction:', error);
        res.status(500).json({ message: 'Error deleting attraction' });
    }
});

// הזמנות
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

app.get('/api/admin/order/:orderId', isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('userId', 'username');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

// נתיב API להצגת הזמנות של משתמש מסוים
app.get('/api/user/orders', auth, async (req, res) => {
    try {
        // מציאת הזמנות של המשתמש המחובר
        const orders = await Order.find({ userId: req.user.id })
            .sort({ purchaseDate: -1 }); // מיון לפי תאריך - חדש לישן
        
        if (!orders || orders.length === 0) {
            return res.status(200).json({ orders: [] });
        }
        
        // עיבוד הנתונים לפורמט שהלקוח מצפה לו
        const processedOrders = orders.map(order => ({
            id: order._id,
            orderNumber: order.orderNumber,
            orderDate: order.purchaseDate,
            totalAmount: order.totalCost,
            status: 'completed', // אפשר לשנות לפי הסטטוס האמיתי בעתיד
            items: order.items.map(item => ({
                productName: item.productName || "מוצר",
                productDetails: item.category ? `${item.category} - ${item.type}` : item.type || "",
                quantity: item.amount,
                unitPrice: item.price
            }))
        }));
        
        res.status(200).json({ orders: processedOrders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'שגיאה בטעינת ההזמנות' });
    }
});

// נתיב API לקבלת פרטי הזמנה בודדת
app.get('/api/orders/:orderId', auth, async (req, res) => {
    try {
        console.log('Order details requested for:', req.params.orderId);
        
        // בדיקה אם מזהה ההזמנה תקין בפורמט MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
            return res.status(400).json({ message: 'פורמט מזהה הזמנה לא תקין' });
        }
        
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            console.log('Order not found:', req.params.orderId);
            return res.status(404).json({ message: 'הזמנה לא נמצאה' });
        }
        
        // בדיקה שההזמנה שייכת למשתמש המבקש
        const orderUserId = order.userId ? order.userId.toString() : null;
        const requestUserId = req.user.id ? req.user.id.toString() : null;
        
        console.log('Order belongs to user:', orderUserId);
        console.log('Request from user:', requestUserId);
        
        if (orderUserId !== requestUserId) {
            return res.status(403).json({ message: 'אין הרשאה לצפות בהזמנה זו' });
        }
        
        // מציאת פרטי המשתמש
        const user = await User.findById(req.user.id);
        
        // בדיקת מבנה פריטי ההזמנה ותיקון במידת הצורך
        let processedItems = [];
        
        if (Array.isArray(order.items) && order.items.length > 0) {
            // עיבוד כל פריט בהזמנה
            processedItems = order.items.map((item, index) => {
                // וידוא שה-ID של הפריט תקין
                const itemId = item._id || item.productId || `item-${index + 1}`;
                
                return {
                    id: itemId.toString(),
                    productName: item.productName || 'כרטיס כניסה',
                    productDetails: item.productDetails || (item.category ? `${item.category} - ${item.contry || ''}` : ''),
                    quantity: item.amount || 1,
                    unitPrice: item.price || 0
                };
            });
        } else {
            // אם אין פריטים בהזמנה, יצירת פריט ברירת מחדל
            processedItems = [{
                id: 'default-item',
                productName: 'כרטיס כניסה',
                productDetails: '',
                quantity: 1,
                unitPrice: order.totalCost || 0
            }];
        }
        
        // הכנת אובייקט התשובה
        const responseData = {
            id: order._id.toString(),
            orderNumber: order.orderNumber || order._id.toString(),
            orderDate: order.purchaseDate || order.createdAt || new Date(),
            status: order.status || 'completed',
            totalAmount: order.totalCost || 0,
            customerName: user ? user.displayName || user.username : 'לקוח',
            customerEmail: user ? user.email || user.username : '',
            items: processedItems
        };
        
        console.log('Returning order data with items:', responseData.items.length);
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'שגיאה בטעינת פרטי ההזמנה: ' + error.message });
    }
});

// ניהול שאלות ופניות
app.post('/api/submit-question', async (req, res) => {
    console.log('Got request to submit-question:', req.body);
    try {
        const { message, email } = req.body;
        
        console.log('Creating question with:', { message, email });
        const newQuestion = new Question({
            questionText: message,
            userEmail: email || null
        });
        
        const savedQuestion = await newQuestion.save();
        console.log('Question saved successfully:', savedQuestion);
        
        // עדכון השאלה ברפרנס של המשתמש
        if (email) {
            const user = await User.findOne({ username: email });
            if (user) {
                console.log('Found user:', user.username);
                
                // בדיקה אם יש למשתמש שאלות קודמות
                user.questions = user.questions || [];
                
                user.questions.push({
                    questionId: savedQuestion._id,
                    question: message,  // לפי הסכימה הקיימת
                    answer: null
                });
                
                await user.save();
                console.log('User updated with question reference');
            }
        }
        
        res.status(201).json({ message: 'Question submitted successfully' });
    } catch (error) {
        console.error('Error submitting question:', error);
        res.status(500).json({ message: 'Error submitting question' });
    }
});

app.get('/api/user/questions', auth, async (req, res) => {
    try {
        // חיפוש המשתמש וטעינת השאלות שלו
        const user = await User.findById(req.user.id);
        
        if (!user || !user.questions) {
            return res.status(200).json({ questions: [] });
        }
        
        // יצירת מערך של מזהי שאלות
        const questionIds = user.questions.map(q => q.questionId);
        
        // טעינת כל השאלות
        const questions = await Question.find({
            '_id': { $in: questionIds }
        }).sort({ submittedAt: -1 });
        
        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת' });
    }
});

app.get('/api/admin/questions', adminAuth, async (req, res) => {
    try {
        const { status, sort, search, limit } = req.query;
        
        let query = {};
        
        // פילטור לפי סטטוס
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // פילטור לפי חיפוש טקסט
        if (search) {
            query.questionText = { $regex: search, $options: 'i' };
        }
        
        // בניית שאילתת מיון
        let sortQuery = { submittedAt: -1 }; // ברירת מחדל - חדש לישן
        
        if (sort === 'date_asc') {
            sortQuery = { submittedAt: 1 }; // ישן לחדש
        }
        
        // הגבלת התוצאות אם יש פרמטר limit
        let questionQuery = Question.find(query).sort(sortQuery);
        
        if (limit) {
            questionQuery = questionQuery.limit(parseInt(limit));
        }
        
        const questions = await questionQuery.exec();
        
        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת' });
    }
});

app.get('/api/admin/questions/:id', adminAuth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ success: false, message: 'שאלה לא נמצאה' });
        }
        
        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching question details:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת' });
    }
});

app.put('/api/admin/questions/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { answer, status } = req.body;
        
        if (!answer) {
            return res.status(400).json({ success: false, message: 'תשובה נדרשת' });
        }
        
        // עדכון השאלה עם התשובה
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {
                'answer.text': answer,
                'answer.answeredAt': new Date(),
                status: status || 'answered'
            },
            { new: true }
        );
        
        if (!updatedQuestion) {
            return res.status(404).json({ success: false, message: 'שאלה לא נמצאה' });
        }
        
        // אם התשובה מתווספת ל-FAQ
        if (status === 'added_to_faq') {
            // כאן ניתן להוסיף לוגיקה נוספת לטיפול ב-FAQ
        }
        
        // עדכון התשובה ברשומת המשתמש
        // מציאת המשתמש ששאל את השאלה
        const userWithQuestion = await User.findOne({
            'questions.questionId': id
        });
        
        if (userWithQuestion) {
            await User.updateOne(
                { 
                    _id: userWithQuestion._id,
                    'questions.questionId': id
                },
                {
                    $set: {
                        'questions.$.answer': answer
                    }
                }
            );
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'התשובה נשמרה בהצלחה',
            question: updatedQuestion 
        });
    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת' });
    }
});

app.delete('/api/admin/questions/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // מחיקת השאלה
        const deletedQuestion = await Question.findByIdAndDelete(id);
        
        if (!deletedQuestion) {
            return res.status(404).json({ success: false, message: 'שאלה לא נמצאה' });
        }
        
        // הסרת הרפרנס לשאלה מפרופיל המשתמש
        await User.updateOne(
            { 'questions.questionId': id },
            { $pull: { questions: { questionId: id } } }
        );
        
        res.status(200).json({ 
            success: true, 
            message: 'השאלה נמחקה בהצלחה' 
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת' });
    }
});

app.put('/api/user/profile', auth, async (req, res) => {
    try {
        // לוג לצורך דיבוג
        console.log('בקשה לעדכון פרטי משתמש התקבלה:', req.body);
        console.log('פרטי המשתמש מהטוקן:', req.user);
        
        const { displayName, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // מציאת המשתמש על פי המזהה מהטוקן
        const user = await User.findById(userId);
        
        if (!user) {
            console.error('משתמש לא נמצא:', userId);
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }
        
        console.log('משתמש נמצא:', user.username);
        
        // שינויים שבוצעו בפרטי המשתמש
        let changes = [];

        // אם נשלח שם תצוגה, עדכן אותו
        if (displayName && displayName.trim()) {
            const oldDisplayName = user.displayName;
            user.displayName = displayName.trim();
            changes.push(`שם תצוגה שונה מ-${oldDisplayName || 'ללא שם'} ל-${displayName.trim()}`);
        }

        // אם נשלח מייל, עדכן אותו
        if (email && email.trim()) {
            const oldEmail = user.email || user.username;
            user.email = email.trim();
            changes.push(`כתובת מייל שונתה מ-${oldEmail} ל-${email.trim()}`);
        }

        // אם נשלחה סיסמה חדשה, יש לוודא את הסיסמה הנוכחית ואז לעדכן
        if (newPassword && currentPassword) {
            try {
                // וידוא הסיסמה הנוכחית
                const validPassword = await argon2.verify(user.password, currentPassword);
                
                if (!validPassword) {
                    console.log('סיסמה נוכחית שגויה');
                    return res.status(401).json({ message: 'סיסמה נוכחית שגויה' });
                }
                
                // סיסמה תקפה - עדכן את הסיסמה החדשה
                user.password = newPassword;
                changes.push('סיסמה עודכנה');
            } catch (error) {
                console.error('שגיאה באימות סיסמה:', error);
                return res.status(500).json({ message: 'שגיאה באימות הסיסמה' });
            }
        }

        if (changes.length === 0) {
            console.log('לא בוצעו שינויים בפרטי המשתמש');
            return res.status(200).json({ 
                message: 'לא בוצעו שינויים',
                user: {
                    userId: user._id,
                    username: user.username,
                    email: user.email || user.username,
                    displayName: user.displayName,
                    isAdmin: user.isAdmin
                }
            });
        }

        // שמירת השינויים
        await user.save();
        console.log('פרטי המשתמש עודכנו בהצלחה:', changes);

        // יצירת טוקן חדש עם השם החדש (אם השתנה)
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email || user.username,
            displayName: user.displayName,
            isAdmin: user.isAdmin
        }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'פרטי המשתמש עודכנו בהצלחה',
            changes: changes,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email || user.username,
                displayName: user.displayName,
                isAdmin: user.isAdmin
            },
            token: token // שליחת טוקן חדש למקרה ששם התצוגה השתנה
        });
    } catch (error) {
        console.error('שגיאה בעדכון פרטי משתמש:', error);
        res.status(500).json({ message: 'שגיאת שרת בעדכון פרטי המשתמש' });
    }
});

app.get('/api/tickets/:ticketId', auth, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { orderId } = req.query;
        
        console.log('API request for ticket:', { ticketId, orderId, userId: req.user.id });
        
        if (!ticketId || !orderId) {
            return res.status(400).json({ message: 'חסרים פרמטרים בבקשה' });
        }
        
        // בדיקה האם orderId הוא מזהה מונגו תקין
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.log('Invalid orderId format:', orderId);
            return res.status(400).json({ message: 'מזהה הזמנה בפורמט לא תקין' });
        }
        
        // חיפוש ההזמנה במסד הנתונים
        const order = await Order.findById(orderId);
        
        console.log('Order found:', order ? 'Yes' : 'No');
        if (!order) {
            return res.status(404).json({ message: 'הזמנה לא נמצאה' });
        }
        
        // בדיקת מבנה ההזמנה לצרכי דיבאג
        console.log('Order structure check:');
        console.log('  Order ID:', order._id);
        console.log('  Order userId:', order.userId);
        console.log('  Current user ID:', req.user.id);
        console.log('  Order has items array:', Array.isArray(order.items));
        if (Array.isArray(order.items)) {
            console.log('  Items count:', order.items.length);
        } else {
            console.log('  Order items structure:', typeof order.items, order.items);
            // במקרה שהמבנה לא כפי שציפינו, ניצור מערך ריק
            order.items = [];
        }
        
        // בדיקה שההזמנה שייכת למשתמש המבקש - מיישרים למחרוזות
        const orderUserId = order.userId ? order.userId.toString() : null;
        const requestUserId = req.user.id ? req.user.id.toString() : null;
        
        if (orderUserId !== requestUserId) {
            console.log(`User ID mismatch: Order belongs to ${orderUserId}, request from ${requestUserId}`);
            return res.status(403).json({ message: 'אין הרשאה לצפות בהזמנה זו' });
        }
        
        // מציאת פרטי המשתמש
        let user = null;
        try {
            user = await User.findById(req.user.id);
            console.log('User found:', user ? 'Yes' : 'No');
        } catch (userError) {
            console.error('Error fetching user:', userError);
            // ממשיכים גם אם לא מצאנו את המשתמש
        }
        
        // ניסיון למצוא את הפריט בהזמנה
        let item = null;
        if (Array.isArray(order.items) && order.items.length > 0) {
            // חיפוש לפי ID
            item = order.items.find(item => 
                (item._id && item._id.toString() === ticketId) || 
                (item.productId && item.productId.toString() === ticketId)
            );
            
            // אם לא נמצא, ניקח את הפריט הראשון
            if (!item) {
                console.log('Specific item not found, using first item');
                item = order.items[0];
            }
        }
        
        // אם עדיין אין פריט, נייצר פריט ברירת מחדל
        if (!item) {
            console.log('Creating default item');
            item = {
                productName: "כרטיס כניסה",
                amount: 1,
                type: "כרטיס"
            };
        }
        
        // הכנת נתוני הכרטיס לשליחה
        const ticketData = {
            id: item._id || ticketId,
            orderNumber: order.orderNumber || orderId,
            orderDate: order.purchaseDate || new Date(),
            name: item.productName || "כרטיס",
            quantity: item.amount || 1,
            customerName: user ? user.displayName || user.username : 'לקוח',
            customerEmail: user ? user.email || user.username : '',
            barcode: `${order.orderNumber || orderId}-${ticketId}`,
            ticketType: item.type || "כרטיס כניסה",
            additionalInfo: item.category ? `${item.category} ${item.contry || ''}` : ''
        };
        
        console.log('Returning ticket data:', ticketData);
        res.status(200).json(ticketData);
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).json({ message: 'שגיאה בטעינת פרטי הכרטיס: ' + error.message });
    }
});

// סטטיסטיקות מכירות
app.get('/api/admin/sales-stats', isAdmin, async (req, res) => {
    try {
        const { range, startDate, endDate } = req.query;
        
        let dateFilter = {};
        const currentDate = new Date();
        
        if (range === 'month') {
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            dateFilter = { purchaseDate: { $gte: firstDayOfMonth, $lte: currentDate } };
        } else if (range === 'year') {
            const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
            dateFilter = { purchaseDate: { $gte: firstDayOfYear, $lte: currentDate } };
        } else if (range === 'custom' && startDate && endDate) {
            dateFilter = { 
                purchaseDate: { 
                    $gte: new Date(startDate), 
                    $lte: new Date(endDate) 
                } 
            };
        }
        
        // Get orders within the date range
        const orders = await Order.find(dateFilter).populate('userId', 'username');
        
        // Calculate total sales
        const totalSales = orders.reduce((sum, order) => sum + order.totalCost, 0);
        
        // Calculate average order value
        const averageOrder = orders.length > 0 ? totalSales / orders.length : 0;
        
        // Find the top-selling attraction
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const itemId = item.productId;
                itemCounts[itemId] = (itemCounts[itemId] || 0) + item.amount;
            });
        });
        
        let topAttractionId = null;
        let topAttractionCount = 0;
        
        for (const [itemId, count] of Object.entries(itemCounts)) {
            if (count > topAttractionCount) {
                topAttractionId = itemId;
                topAttractionCount = count;
            }
        }
        
        // Get the name of the top attraction
        let topAttractionName = '-';
        if (topAttractionId) {
            const attraction = await Product.findOne({ productId: topAttractionId });
            if (attraction) {
                topAttractionName = attraction.name;
            }
        }
        
        // Prepare data for chart (e.g., daily or monthly sales)
        let chartData = [];
        
        if (range === 'month') {
            // Group by day for current month
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            chartData = Array(daysInMonth).fill(0);
            
            orders.forEach(order => {
                const day = order.purchaseDate.getDate();
                chartData[day - 1] += order.totalCost;
            });
            
            chartData = chartData.map((value, index) => ({
                label: `${index + 1}/${currentDate.getMonth() + 1}`,
                value
            }));
        } else {
            // Group by month for year or custom range
            const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
            const monthlyData = Array(12).fill(0);
            
            orders.forEach(order => {
                const month = order.purchaseDate.getMonth();
                monthlyData[month] += order.totalCost;
            });
            
            chartData = monthlyData.map((value, index) => ({
                label: monthNames[index],
                value
            }));
        }
        
        // Prepare recent orders data
        const recentOrders = await Order.find()
            .sort({ purchaseDate: -1 })
            .limit(10)
            .populate('userId', 'username');
        
        const formattedRecentOrders = recentOrders.map(order => ({
            orderNumber: order.orderNumber,
            date: order.purchaseDate,
            customer: order.userId ? order.userId.username : 'אורח',
            total: order.totalCost,
            id: order._id
        }));
        
        res.status(200).json({
            totalSales,
            ordersCount: orders.length,
            averageOrder,
            topAttraction: topAttractionName,
            chartData,
            recentOrders: formattedRecentOrders
        });
    } catch (error) {
        console.error('Error fetching sales statistics:', error);
        res.status(500).json({ message: 'Error fetching sales statistics' });
    }
});

// Admin: Get order details
app.get('/api/admin/order/:orderId', isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('userId', 'username');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

// Get individual attraction data
app.get('/api/attraction/:id', async (req, res) => {
    try {
        const attraction = await Product.findById(req.params.id);
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json(attraction);
    } catch (error) {
        console.error('Error fetching attraction:', error);
        res.status(500).json({ message: 'Error fetching attraction data' });
    }
});

// Update an attraction
app.put('/api/attraction/:id', isAdmin, async (req, res) => {
    try {
        const attraction = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json({ message: 'Attraction updated successfully', data: attraction });
    } catch (error) {
        console.error('Error updating attraction:', error);
        res.status(500).json({ message: 'Error updating attraction' });
    }
});

// Delete an attraction
app.delete('/api/attraction/:id', isAdmin, async (req, res) => {
    try {
        const attraction = await Product.findByIdAndDelete(req.params.id);
        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }
        res.status(200).json({ message: 'Attraction deleted successfully' });
    } catch (error) {
        console.error('Error deleting attraction:', error);
        res.status(500).json({ message: 'Error deleting attraction' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
=======
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
>>>>>>> 6ab9571fae77d3e9e904904252e5c58053a79d66
