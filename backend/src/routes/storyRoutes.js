import express from 'express';
import {
  createStory,
  getAllStories,
  getStoryById,
  addContributionToStory,
  selectContribution,
} from '../controllers/storyController.js';

const router = express.Router();

router.post('/', createStory); // Create a story
router.get('/', getAllStories); // Get all stories
router.get('/:id', getStoryById); // Get single story by ID
router.post('/:id/contribute', addContributionToStory); // Add contribution to a story
router.post('/:id/select/:contributionId', selectContribution); // Select contribution for story

export default router;
