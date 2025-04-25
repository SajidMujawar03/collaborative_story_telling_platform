import mongoose from 'mongoose';
const { Schema } = mongoose;

const storyContentSchema = new Schema({
  text: { type: String, required: true },
  contributedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  selected: { type: Boolean, default: false }
}, { _id: false });


const storySchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, enum: ['fantasy', 'sci-fi', 'romance', 'thriller', 'mystery', 'horror', 'comedy', 'drama', 'adventure', 'historical'], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: [storyContentSchema], // evolving story parts
  contributions: [{ type: Schema.Types.ObjectId, ref: 'Contribution' }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });


export default mongoose.model('Story', storySchema);
