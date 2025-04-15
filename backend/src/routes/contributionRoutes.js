import express from 'express';
import {
  getContributionsByStoryId,
  upvoteContribution,
  downvoteContribution,
  getContributionsByUser
} from '../controllers/contributionController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/story/:storyId', getContributionsByStoryId);
router.post('/:id/upvote', authenticateUser,upvoteContribution);
router.post('/:id/downvote', authenticateUser,downvoteContribution);
router.get('/user/:userId', getContributionsByUser);

export default router;
