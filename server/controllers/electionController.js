const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Vote = require('../models/Vote');

exports.getElections = async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createElection = async (req, res) => {
    try {
        const { title, date, categories } = req.body;
        const newElection = new Election({ title, date, categories });
        await newElection.save();
        res.status(201).json(newElection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCandidates = async (req, res) => {
    try {
        const { electionId } = req.params;
        const candidates = await Candidate.find({ election: electionId }).populate('user', 'username fullName photo course batch');
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.applyCandidacy = async (req, res) => {
    try {
        const { electionId, category, description } = req.body;
        const userId = req.user.id; // From auth middleware

        // Check if election exists
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        // Check if category valid
        const categoryExists = election.categories.some(cat => cat.name === category);
        if (!categoryExists) return res.status(400).json({ message: 'Invalid category' });

        // Check existing candidacy
        const existingCandidacy = await Candidate.findOne({ user: userId, election: electionId });
        if (existingCandidacy) return res.status(400).json({ message: 'Already applied for this election' });

        const newCandidate = new Candidate({
            user: userId,
            election: electionId,
            category,
            description
        });

        await newCandidate.save();
        res.status(201).json(newCandidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addCandidate = async (req, res) => {
    try {
        const { username, electionId, category, manifesto } = req.body;

        // 1. Find User
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 2. Check Election
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        // 3. Check Category
        const categoryExists = election.categories.some(cat => cat.name === category);
        if (!categoryExists) return res.status(400).json({ message: 'Invalid category' });

        // 4. Check if already candidate
        const existingCandidacy = await Candidate.findOne({ user: user._id, election: electionId });
        if (existingCandidacy) return res.status(400).json({ message: 'User is already a candidate in this election' });

        // 5. Create Candidate
        const newCandidate = new Candidate({
            user: user._id,
            election: electionId,
            category,
            description: manifesto,
            status: 'approved' // Auto-approve admin added candidates
        });

        await newCandidate.save();

        // 6. Update User Role
        user.role = 'candidate';
        await user.save();

        res.status(201).json(newCandidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { electionId } = req.params;
        const { status } = req.body;

        const election = await Election.findByIdAndUpdate(
            electionId,
            { status },
            { new: true }
        );

        if (!election) return res.status(404).json({ message: 'Election not found' });

        res.status(200).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getElectionStats = async (req, res) => {
    try {
        const { electionId } = req.params;

        // 1. Total Registered Voters
        const totalVoters = await User.countDocuments({ role: 'voter' });

        // 2. Unique Voted Users for this election
        const uniqueVoters = (await Vote.distinct('voter', { election: electionId })).length;

        // 3. Calculate Percentage
        const turnoutPercentage = totalVoters === 0 ? 0 : ((uniqueVoters / totalVoters) * 100).toFixed(1);

        res.status(200).json({
            totalVoters,
            votedCount: uniqueVoters,
            turnout: turnoutPercentage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
