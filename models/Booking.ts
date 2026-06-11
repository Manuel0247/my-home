import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
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
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    payment_method: String,
    cancellation_reason: String,
}, {
    timestamps: true,
});

// Virtual for id
BookingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

BookingSchema.set('toJSON', {
    virtuals: true,
});

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
