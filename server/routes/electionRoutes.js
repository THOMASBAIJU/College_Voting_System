const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
// const auth = require('../middleware/auth'); // Need middleware

// Public or Protected routes? Assuming some are protected.
// For now, let's keep it simple and add middleware later or inline.

router.get('/', electionController.getElections);
router.post('/', electionController.createElection); // Admin only usually
router.get('/:electionId/candidates', electionController.getCandidates);
router.post('/apply', electionController.applyCandidacy); // Authenticated user
router.post('/candidate', electionController.addCandidate); // Admin add candidate
router.patch('/:electionId/status', electionController.updateStatus); // Admin update status
router.get('/:electionId/stats', electionController.getElectionStats);

module.exports = router;
