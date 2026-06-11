'use server';

import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function createBooking(data: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Veuillez vous connecter' };

    try {
        await connectDB();
        await Booking.create({
            ...data,
            // @ts-ignore
            traveler_id: session.user.id,
        });

        revalidatePath('/trips');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getHostBookings() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    try {
        await connectDB();

        // Find all properties owned by user
        // @ts-ignore
        const properties = await Property.find({ host_id: session.user.id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const bookings = await Booking.find({ property_id: { $in: propertyIds } })
            .populate('property_id', 'title') // Populate property title
            .populate('traveler_id', 'first_name last_name email') // Populate traveler info
            .sort({ createdAt: -1 })
            .lean();

        return bookings.map((b: any) => ({
            ...b,
            id: b._id.toString(),
            _id: b._id.toString(),
            property_id: b.property_id ? b.property_id._id.toString() : null,
            traveler_id: b.traveler_id ? b.traveler_id._id.toString() : null,
            // Flatten populated fields for easier consumption if needed
            properties: b.property_id ? { title: b.property_id.title } : { title: 'Logement supprimé' },
            traveler: b.traveler_id
        }));
    } catch (error) {
        console.error('getHostBookings Error', error);
        return [];
    }
}

export async function updateBookingStatus(
    bookingId: string,
    status: 'confirmed' | 'cancelled'
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Non autorisé' };

    try {
        await connectDB();

        const booking = await Booking.findById(bookingId).populate('property_id');

        if (!booking) {
            return { error: 'Réservation introuvable' };
        }

        // Verify ownership
        // @ts-ignore
        if (booking.property_id.host_id.toString() !== session.user.id) {
            return { error: 'Non autorisé' };
        }

        booking.status = status;
        await booking.save();

        revalidatePath('/host/dashboard');
        revalidatePath('/trips'); // In case traveler is viewing
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getUserBookings() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    try {
        await connectDB();

        // @ts-ignore
        const bookings = await Booking.find({ traveler_id: session.user.id })
            .populate('property_id', 'title city images')
            .sort({ createdAt: -1 })
            .lean();

        return bookings.map((b: any) => ({
            ...b,
            id: b._id.toString(),
            _id: b._id.toString(),
            property_id: b.property_id ? b.property_id._id.toString() : null,
            traveler_id: b.traveler_id.toString(),
            property: b.property_id ? {
                title: b.property_id.title,
                city: b.property_id.city,
                image: b.property_id.images?.[0] || null
            } : null
        }));
    } catch (error) {
        console.error('getUserBookings Error', error);
        return [];
    }
}
