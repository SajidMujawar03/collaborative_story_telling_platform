import express from 'express';
import {
  getContributionsByStoryId,
  upvoteContribution,
  downvoteContribution
} from '../controllers/contributionController.js';

const router = express.Router();

router.get('/story/:storyId', getContributionsByStoryId);
router.post('/:id/upvote', upvoteContribution);
router.post('/:id/downvote', downvoteContribution);

export default router;
