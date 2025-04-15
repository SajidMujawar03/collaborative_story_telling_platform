import mongoose from 'mongoose';
const { Schema } = mongoose;
const contributionSchema = new Schema({
  storyId: { type: Schema.Types.ObjectId, ref: 'Story', required: true },
  text: { type: String, required: true },
  contributedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isSelected: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Contribution', contributionSchema);
