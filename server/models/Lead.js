import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    campaignSlug: { type: String, required: true, trim: true, index: true },
    ref: { type: String, default: 'direct', trim: true },
    clickedInstagram: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
