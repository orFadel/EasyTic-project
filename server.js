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
            isAdmin: user.isAdmin
        }, JWT_SECRET, { expiresIn: '7d' });

        console.log('Login successful. User isAdmin:', user.isAdmin);
        console.log('Session data:', req.session);

        res.status(200).json({ 
            userId: user._id, 
            displayName: user.displayName, 
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
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'הזמנה לא נמצאה' });
        }
        
        // בדיקה שההזמנה שייכת למשתמש המבקש
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'אין הרשאה לצפות בהזמנה זו' });
        }
        
        // יש למצוא מידע על המשתמש
        const user = await User.findById(req.user.id);
        
        // פורמט התגובה לפי המבנה שהלקוח מצפה לו
        const orderData = {
            id: order._id,
            orderNumber: order.orderNumber,
            orderDate: order.purchaseDate,
            status: 'completed', // אפשר לשנות בהתאם לנתונים האמיתיים
            totalAmount: order.totalCost,
            customerName: user ? user.displayName || user.username : 'לקוח',
            customerEmail: user ? user.username : '',
            items: order.items.map(item => ({
                productName: item.productName || "מוצר",
                productDetails: item.category ? `${item.category} - ${item.type}` : item.type || "",
                quantity: item.amount,
                unitPrice: item.price
            }))
        };
        
        res.status(200).json(orderData);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'שגיאה בטעינת פרטי ההזמנה' });
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