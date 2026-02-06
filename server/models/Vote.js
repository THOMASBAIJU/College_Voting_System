const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    category: { type: String, required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    timestamp: { type: Date, default: Date.now }
});

// Prevent multiple votes for same category in same election by one user?
// Or just track "hasVoted" in User model for simplicity per election. 
// Ideally, a voter votes once per election (for all categories) or per category.
// Let's assume unique compound index for voter+election+category.
voteSchema.index({ voter: 1, election: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
