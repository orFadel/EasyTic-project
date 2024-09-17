const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// הגדרת הסכימה (Schema) עבור המשתמשים
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchaseHistory: { type: Array, default: [] } // אפשר לשמור היסטוריית רכישות כאן
});

// Hashing הסיסמה לפני שמירתה במסד הנתונים
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// פונקציה להשוואת סיסמאות מוצפנות
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// יצירת המודל (Model) עבור משתמשים
const User = mongoose.model('User', userSchema, 'Customers');

module.exports = User;
