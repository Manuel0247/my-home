'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: any) {
    try {
        await connectDB();

        const { email, password, first_name, last_name, phone, role } = formData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'Cet email est déjà utilisé' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone,
            role: role || 'traveler',
        });

        return { success: true, userId: newUser._id.toString() };
    } catch (error: any) {
        console.error('Registration Error:', error);
        return { error: error.message || "Une erreur est survenue lors de l'inscription" };
    }
}
