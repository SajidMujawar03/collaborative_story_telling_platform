import Story from '../models/story.model.js';
import Contribution from '../models/contribution.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
const createNotification = async (user, message, storyId) => {
  try {
    const notification = new Notification({
      user,
      message,
      story: storyId,
    });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};










// Create a new story



export const createStory = async (req, res) => {
  try {
    const { title, text, createdBy, genre } = req.body;

    // Clean trailing spaces from each line in the text
    const cleanedText = text
      .split('\n')
      .map(line => line.replace(/\s+$/, '')) // Remove trailing spaces
      .join('\n');

    const newStory = new Story({
      title,
      genre,
      createdBy,
      content: [
        {
          text: cleanedText,
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
    console.log("hi");
    
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
    console.log("hi");
    
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

// // Select a contribution to merge into the story
// export const selectContribution = async (req, res) => {
//   try {
//     const { id, contributionId } = req.params;

//     const story = await Story.findById(id);
//     if (!story) return res.status(404).json({ message: 'Story not found' });

//     const contribution = await Contribution.findById(contributionId);
//     if (!contribution || contribution.storyId.toString() !== id) {
//       return res.status(400).json({ message: 'Contribution not found for this story' });
//     }

//     // Mark contribution as selected
//     contribution.isSelected = true;
//     await contribution.save();

//     // Add to story content
//     story.content.push({
//       text: contribution.text,
//       contributedBy: contribution.contributedBy,
//       selected: true
//     });

//     // Optionally close the story if you're building it chapter by chapter
//     // story.status = 'closed';

//     await story.save();

//     res.status(200).json({ message: 'Contribution selected and added to story', story });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to select contribution', error });
//   }
// };



export const selectContribution = async (req, res) => {
  const { id, contributionId } = req.params;
  try {
    // Find the story
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Find the contribution
    const contribution = await Contribution.findById(contributionId);
    if (!contribution || contribution.storyId.toString() !== id) {
      return res.status(400).json({ message: 'Contribution not found for this story' });
    }

    // Mark the contribution as selected
    contribution.isSelected = true;
    await contribution.save();

    // Add the selected contribution to the story content
    story.content.push({
      text: contribution.text,
      contributedBy: contribution.contributedBy,
      selected: true,
    });

    // Optionally close the story if needed
    // story.status = 'closed';

    await story.save();

    // Send notification to the contributor
    const contributor = contribution.contributedBy;
    const message = `Your contribution has been selected for the story "${story.title}"!`;
    await createNotification(contributor, message, id);

    res.status(200).json({ message: 'Contribution selected and contributor notified', story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to select contribution and notify contributor', error });
  }
};








// Get stories created by a specific user
export const getStoriesByUser = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required in the query parameter' });
    }

    const stories = await Story.find({ createdBy: user })
      .populate('createdBy', 'name avatar')
      .populate({
        path: 'content.contributedBy',
        select: 'name avatar'
      })
      .populate({
        path: 'contributions',
        populate: { path: 'contributedBy', select: 'name avatar' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Failed to fetch stories by user', error });
  }
};



export const updateStoryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Story.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Failed to update story status:', err);
    res.status(500).json({ error: 'Could not update status' });
  }
};
