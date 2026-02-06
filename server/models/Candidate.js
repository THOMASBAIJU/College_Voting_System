const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    category: { type: String, required: true }, // Matches category name in Election
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    voteCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
