const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'voter', 'candidate'], default: 'voter' },

    // Student Details
    fullName: { type: String },
    regNo: { type: String },
    course: { type: String },
    batch: { type: String },
    phone: { type: String },
    email: { type: String },
    photo: { type: String }, // URL to image

    hasVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Election' }] // Track elections participated in
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
