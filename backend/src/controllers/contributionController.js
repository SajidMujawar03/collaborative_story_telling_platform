import Contribution from '../models/contribution.model.js';

// Get all contributions for a specific story
export const getContributionsByStoryId = async (req, res) => {
  try {
    const { storyId } = req.params;

    const contributions = await Contribution.find({ storyId })
      .populate('contributedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contributions', error });
  }
};

// Upvote a contribution
export const upvoteContribution = async (req, res) => {
  try {
    const { id } = req.params;

    const contribution = await Contribution.findById(id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    contribution.upvotes += 1;
    await contribution.save();

    res.status(200).json({ message: 'Upvoted successfully', contribution });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upvote', error });
  }
};

// Downvote a contribution
export const downvoteContribution = async (req, res) => {
  try {
    const { id } = req.params;

    const contribution = await Contribution.findById(id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    contribution.downvotes += 1;
    await contribution.save();

    res.status(200).json({ message: 'Downvoted successfully', contribution });
  } catch (error) {
    res.status(500).json({ message: 'Failed to downvote', error });
  }
};
