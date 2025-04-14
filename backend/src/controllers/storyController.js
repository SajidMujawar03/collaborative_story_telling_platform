import Story from '../models/story.model.js';
import Contribution from '../models/contribution.model.js';
import User from '../models/user.model.js';

// Create a new story
export const createStory = async (req, res) => {
  try {
    const { title, text, createdBy } = req.body;

  

    const newStory = new Story({
      title,
      createdBy,
      content: [
        {
          text,
          contributedBy: createdBy,
          selected: true
        }
      ]
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Failed to create story', error });
  }
};

// Get all stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('createdBy', 'name avatar')
      .populate({
        path: 'content.contributedBy',
        select: 'name avatar'
      })
      .sort({ createdAt: -1 });


      // console.log(stories)

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stories', error });
  }
};

// Get story by ID
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id)
      .populate('createdBy', 'name avatar')
      .populate({
        path: 'content.contributedBy',
        select: 'name avatar'
      })
      .populate({
        path: 'contributions',
        populate: { path: 'contributedBy', select: 'name avatar' }
      });

    if (!story) return res.status(404).json({ message: 'Story not found' });

    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch story', error });
  }
};

// Add a contribution to a story
export const addContributionToStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, contributedBy } = req.body;


    console.log(req.body)

console.log(text,contributedBy);



    console.log(id)

    const story = await Story.findById(id);
    if (!story || story.status !== 'open') {
      return res.status(400).json({ message: 'Story not open for contributions' });
    }

    const newContribution = new Contribution({
      storyId: id,
      text,
      contributedBy
    });

    const savedContribution = await newContribution.save();

    story.contributions.push(savedContribution._id);
    await story.save();

    res.status(201).json(savedContribution);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to add contribution', error });
  }
};

// Select a contribution to merge into the story
export const selectContribution = async (req, res) => {
  try {
    const { id, contributionId } = req.params;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const contribution = await Contribution.findById(contributionId);
    if (!contribution || contribution.storyId.toString() !== id) {
      return res.status(400).json({ message: 'Contribution not found for this story' });
    }

    // Mark contribution as selected
    contribution.isSelected = true;
    await contribution.save();

    // Add to story content
    story.content.push({
      text: contribution.text,
      contributedBy: contribution.contributedBy,
      selected: true
    });

    // Optionally close the story if you're building it chapter by chapter
    // story.status = 'closed';

    await story.save();

    res.status(200).json({ message: 'Contribution selected and added to story', story });
  } catch (error) {
    res.status(500).json({ message: 'Failed to select contribution', error });
  }
};
