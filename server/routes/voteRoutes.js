const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const auth = require('../middleware/auth');

router.post('/', auth, voteController.castVote);
router.get('/:electionId/results', auth, voteController.getResults); // Maybe admin only or public?

module.exports = router;
