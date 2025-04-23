const mongoose = require('mongoose');
const argon2 = require('argon2');

// הגדרת הסכימה (Schema) עבור המשתמשים
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // שם משתמש לצורך התחברות (ייחודי)
  email: { type: String, default: function () { return this.username; } }, // כתובת מייל (ברירת מחדל היא שם המשתמש)
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  cart: [
    {
      // שימוש במחרוזת עבור productId, שתואם את שדה productId במודל Product
      productId: { type: String, required: true },
      productName: { type: String },
      category: { type: String },
      country: { type: String }, // תיקון שגיאת כתיב - 'country' במקום 'contry'
      type: { type: String },
      price: { type: Number },
      amount: { type: Number, default: 1 }
    }
  ],
  purchaseHistory: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // רפרנס להזמנה
      orderNumber: { type: String, required: true } // מספר ההזמנה
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  // שאלות המשתמש
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // רפרנס לשאלה
      question: { type: String, required: true },
      answer: { type: String }
    }
  ],
  favorites: {
    type: [String],
    default: []
  }
});

// Hashing הסיסמה לפני שמירתה במסד הנתונים
userSchema.pre('save', async function (next) {
  const user = this;

  // בודקים אם השדה 'password' שונה ורק אז מצפינים
  if (!user.isModified('password')) return next();

  if (!user.password) {
    return next(new Error('Password is required'));
  }

  try {
    // מבצעים הצפנה של הסיסמה
    user.password = await argon2.hash(user.password);
    next();
  } catch (error) {
    return next(error);
  }
});

// וידוא שיש כתובת מייל לפני שמירה
userSchema.pre('save', function (next) {
  // אם אין כתובת מייל, השתמש בשם המשתמש כברירת מחדל
  if (!this.email) {
    this.email = this.username;
  }
  next();
});

// פונקציה להשוואת סיסמאות מוצפנות
userSchema.methods.comparePassword = async function (password) {
  try {
    if (!this.password) {
      console.error('No password found for this user');
      return false;
    }
    return await argon2.verify(this.password, password);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

// יצירת המודל (Model) עבור משתמשים
const User = mongoose.model('User', userSchema, 'Customers');

module.exports = User;