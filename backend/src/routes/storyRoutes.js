import express from 'express';
import {
  createStory,
  getAllStories,
  getStoryById,
  addContributionToStory,
  selectContribution,
  getStoriesByUser,
  updateStoryStatus,
} from '../controllers/storyController.js';

const router = express.Router();

router.post('/', createStory); // Create a story
router.get('/', async (req, res) => {
  const { user } = req.query;
  if (user) {
    return getStoriesByUser(req, res); // Only created stories
  }
  return getAllStories(req, res); // All stories
});
router.patch('/:id/status', updateStoryStatus);

router.get('/:id', getStoryById); // Get single story by ID
router.post('/:id/contribute', addContributionToStory); // Add contribution to a story
router.post('/:id/select/:contributionId', selectContribution); // Select contribution for story

export default router;
