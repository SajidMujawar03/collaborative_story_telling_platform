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
    const userId = req.user.id;  // assuming user is authenticated, and their ID is in the token

    console.log("hi");
    
    const contribution = await Contribution.findById(id);
    console.log("hi");
    
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    // Check if user has already upvoted
    if (contribution.upvotedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted this contribution' });
    }

    // Check if user has already downvoted
    if (contribution.downvotedBy.includes(userId)) {
      console.log("hi");
      
      contribution.downvotedBy = contribution.downvotedBy.filter(item => item.toString() !== userId);
      contribution.downvotes-=1;
     
    }

    // Add user to upvotedBy and increment upvotes
    contribution.upvotes += 1;
    contribution.upvotedBy.push(userId);
    await contribution.save();

    console.log(contribution)

    res.status(200).json({ message: 'Upvoted successfully', contribution });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Failed to upvote', error });
  }
};

// Downvote a contribution
export const downvoteContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;  // assuming user is authenticated, and their ID is in the token
    // console.log(req.body)

    // console.log(userId)
    // console.log(id);
    

    const contribution = await Contribution.findById(id);
    console.log(contribution);
    

    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    // Check if user has already downvoted
    if (contribution.downvotedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already downvoted this contribution' });
    }

    // Check if user has already upvoted
    if (contribution.upvotedBy.includes(userId)) {
      contribution.upvotedBy = contribution.upvotedBy.filter(item => item.toString() !== userId);
      contribution.upvotes-=1;
     
    }

    // Add user to downvotedBy and increment downvotes
    contribution.downvotes += 1;
    contribution.downvotedBy.push(userId);
    await contribution.save();


    console.log(contribution)

    res.status(200).json({ message: 'Downvoted successfully', contribution });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to downvote', error });
  }
};




export const getContributionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch contributions made by the specific user, populate the story title
    const contributions = await Contribution.find({ contributedBy: userId })
      .populate({
        path: 'storyId', // Assuming 'storyId' is the reference to the Story model
        select: 'title _id'
      })
      .sort({ createdAt: -1 }); // Optional: Sorting contributions by creation date (newest first)

    // Formatting contributions to return the necessary details
    const formattedContributions = contributions.map(contrib => ({
      _id: contrib._id,
      content: contrib.text,
      isSelected: contrib.isSelected,
      story: {
        _id: contrib.storyId._id,
        title: contrib.storyId.title
      }
    }));

    // Send back the formatted list of contributions
    res.status(200).json(formattedContributions);
  } catch (err) {
    console.error("Error fetching user contributions:", err);
    res.status(500).json({ message: "Failed to fetch contributions" });
  }
};
