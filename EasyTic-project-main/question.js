const mongoose = require('mongoose');

// Create a Question model for the database
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'answered', 'added_to_faq'],
        default: 'pending'
    },
    answer: {
        text: String,
        answeredAt: Date
    },
    userEmail: String
});

const Question = mongoose.model('Question', questionSchema, 'Questions');

module.exports = Question;