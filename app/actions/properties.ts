'use server';

import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function getProperties(filters: any = {}) {
    try {
        await connectDB();

        const query: any = { status: 'approved', is_active: true };

        if (filters.city) {
            query.city = { $regex: filters.city, $options: 'i' };
        }
        if (filters.propertyType) {
            query.property_type = filters.propertyType;
        }
        if (filters.minPrice) {
            query.price_per_night = { ...query.price_per_night, $gte: parseFloat(filters.minPrice) };
        }
        if (filters.maxPrice) {
            query.price_per_night = { ...query.price_per_night, $lte: parseFloat(filters.maxPrice) };
        }

        const properties = await Property.find(query).sort({ createdAt: -1 }).lean();

        // Convert _id to string for serialization
        return properties.map((p: any) => ({ ...p, id: p._id.toString(), _id: p._id.toString(), host_id: p.host_id.toString() }));
    } catch (error) {
        console.error('getProperties Error:', error);
        return [];
    }
}

export async function getProperty(id: string) {
    try {
        await connectDB();
        const property = await Property.findById(id).lean();
        if (!property) return null;
        return { ...property, id: property._id.toString(), _id: property._id.toString(), host_id: property.host_id.toString() };
    } catch (error) {
        console.error('getProperty Error:', error);
        return null;
    }
}

export async function getFeaturedProperties() {
    try {
        await connectDB();
        const properties = await Property.find({ status: 'approved', is_active: true })
            .limit(6)
            .sort({ createdAt: -1 })
            .lean();
        return properties.map((p: any) => ({ ...p, id: p._id.toString(), _id: p._id.toString(), host_id: p.host_id.toString() }));
    } catch (error) {
        console.error('getFeaturedProperties Error:', error);
        return [];
    }
}

export async function getHostProperties() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    try {
        await connectDB();
        // @ts-ignore
        const properties = await Property.find({ host_id: session.user.id }).sort({ createdAt: -1 }).lean();
        return properties.map((p: any) => ({ ...p, id: p._id.toString(), _id: p._id.toString(), host_id: p.host_id.toString() }));
    } catch (error) {
        console.error('getHostProperties Error', error);
        return [];
    }
}

export async function createProperty(data: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Non autorisé' };

    try {
        await connectDB();
        const newProperty = await Property.create({
            ...data,
            // @ts-ignore
            host_id: session.user.id,
            status: 'pending',
        }) as any;

        revalidatePath('/host/dashboard');
        return { success: true, id: newProperty._id.toString() };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateProperty(id: string, data: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Non autorisé' };

    try {
        await connectDB();
        // @ts-ignore
        await Property.findOneAndUpdate({ _id: id, host_id: session.user.id }, data);

        revalidatePath('/host/dashboard');
        revalidatePath(`/host/properties/${id}/edit`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updatePropertyStatus(
    id: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== 'admin') {
        return { error: 'Non autorisé' };
    }

    try {
        await connectDB();
        await Property.findByIdAndUpdate(id, {
            status,
            rejection_reason: rejectionReason,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/properties');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
