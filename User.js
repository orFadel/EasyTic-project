const mongoose = require('mongoose');
const argon2 = require('argon2');

// הגדרת הסכימה (Schema) עבור המשתמשים
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  cart: [
    {
      productId: { type: Number, required: true }, // Refers to Product model
      productName: { type: String },
      category: { type: String },
      contry: { type: String },
      type: { type: String },
      price: { type: Number },
      amount: { type: Number, default: 1 }
    }
  ],
  purchaseHistory: [
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // רפרנס להזמנה
        orderNumber: { type: Number, required: true } // מספר ההזמנה
    }
]
});

// Hashing הסיסמה לפני שמירתה במסד הנתונים
userSchema.pre('save', async function (next) {
  const user = this;
  
  // בודקים אם השדה 'password' שונה ורק אז מצפינים
  if (!user.isModified('password')) return next();
  
  try {
    console.log("Original password:", user.password); // הסיסמה שהוזנה לפני ההצפנה
    
    // מבצעים את ההצפנה רק אם הסיסמה לא מוצפנת
    user.password = await argon2.hash(user.password);
    
    console.log("Hashed password:", user.password); // הסיסמה אחרי ההצפנה
    next();
  } catch (error) {
    return next(error);
  }
});

// פונקציה להשוואת סיסמאות מוצפנות
userSchema.methods.comparePassword = async function (password) {
  try {
    console.log("Entered password:", password); // הצגת הסיסמה שהוזנה
    console.log("Hashed password from DB:", this.password); // הצגת הסיסמה השמורה במסד
    return await argon2.verify(this.password, password);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

// יצירת המודל (Model) עבור משתמשים
const User = mongoose.model('User', userSchema, 'Customers');

module.exports = User;
