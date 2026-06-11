import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // Do not return password by default
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
    },
    phone: {
        type: String,
    },
    avatar_url: {
        type: String,
    },
    role: {
        type: String,
        enum: ['traveler', 'host', 'admin'],
        default: 'traveler',
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    identity_document_url: {
        type: String,
    },
}, {
    timestamps: true,
});

const User = models.User || model('User', UserSchema);

export default User;
