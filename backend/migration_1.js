import mongoose from 'mongoose';
import dotenv from "dotenv"
import Contribution from './src/models/contribution.model.js'; // Adjust the import based on your file structure


dotenv.config()

const migrateContributionSchema = async () => {
  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Migrate contributions to add 'upvotedBy' and 'downvotedBy' fields
    const contributions = await Contribution.find();

    for (const contribution of contributions) {
      if (!contribution.upvotedBy) {
        contribution.upvotedBy = [];
      }
      if (!contribution.downvotedBy) {
        contribution.downvotedBy = [];
      }

      // Save each contribution after adding the new fields
      await contribution.save();
    }

    console.log("Migration completed successfully");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

migrateContributionSchema();
