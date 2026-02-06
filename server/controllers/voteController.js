const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

exports.castVote = async (req, res) => {
    try {
        const { electionId, category, candidateId } = req.body;
        const userId = req.user.id;

        // Check Election
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });
        if (election.status !== 'active') return res.status(400).json({ message: 'Election is not active' });

        // Check Candidate
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

        // Check Duplicate Vote
        const existingVote = await Vote.findOne({ voter: userId, election: electionId, category });
        if (existingVote) return res.status(400).json({ message: 'You have already voted in this category' });

        // Record Vote
        const newVote = new Vote({
            voter: userId,
            election: electionId,
            category,
            candidate: candidateId
        });

        await newVote.save();

        // Update Candidate Vote Count
        candidate.voteCount += 1;
        await candidate.save();

        // Update User hasVoted (optional, or just rely on Vote model)
        await User.findByIdAndUpdate(userId, { $addToSet: { hasVoted: electionId } });

        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const { electionId } = req.params;
        // Simple aggregation or just fetch candidates sorted by voice count
        const candidates = await Candidate.find({ election: electionId })
            .sort({ voteCount: -1 })
            .populate('user', 'username fullName photo');

        // Group by category
        const results = candidates.reduce((acc, curr) => {
            if (!acc[curr.category]) acc[curr.category] = [];
            acc[curr.category].push(curr);
            return acc;
        }, {});

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
