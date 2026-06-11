import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    traveler_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    traveler_name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

// Un seul avis par voyageur par logement
ReviewSchema.index({ property_id: 1, traveler_id: 1 }, { unique: true });

const Review = models.Review || model('Review', ReviewSchema);
export default Review;
