import mongoose, { Schema, model, models } from 'mongoose';

const PropertySchema = new Schema({
    host_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
    },
    property_type: {
        type: String,
        enum: ['apartment', 'house', 'studio', 'room'],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "Côte d'Ivoire",
        required: true,
    },
    latitude: Number,
    longitude: Number,
    price_per_night: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'XOF',
    },
    bedrooms: {
        type: Number,
        default: 1,
    },
    bathrooms: {
        type: Number,
        default: 1,
    },
    max_guests: {
        type: Number,
        default: 1,
    },
    amenities: {
        type: [String],
        default: [],
    },
    house_rules: String,
    images: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    rejection_reason: String,
}, {
    timestamps: true,
});

// Virtual for id to match frontend expectation
PropertySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

PropertySchema.set('toJSON', {
    virtuals: true,
});

const Property = models.Property || model('Property', PropertySchema);

export default Property;
