const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'finished'], default: 'upcoming' },
    categories: [{
        name: { type: String, required: true }
        // Candidates will be linked via Candidate model
    }]
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
