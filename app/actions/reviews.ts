'use server';

import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function getPropertyReviews(propertyId: string) {
  try {
    await connectDB();
    const reviews = await Review.find({ property_id: propertyId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return reviews.map((r: any) => ({
      ...r,
      id: r._id.toString(),
      _id: r._id.toString(),
      property_id: r.property_id.toString(),
      traveler_id: r.traveler_id.toString(),
      createdAt: r.createdAt?.toISOString(),
    }));
  } catch (error) {
    console.error('getPropertyReviews Error:', error);
    return [];
  }
}

export async function createReview(data: {
  property_id: string;
  rating: number;
  comment: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Vous devez être connecté pour laisser un avis' };
  }

  if (data.rating < 1 || data.rating > 5) {
    return { error: 'La note doit être entre 1 et 5' };
  }

  try {
    await connectDB();
    await Review.create({
      property_id: data.property_id,
      // @ts-ignore
      traveler_id: session.user.id,
      traveler_name: session.user.name || 'Anonyme',
      rating: data.rating,
      comment: data.comment.trim(),
    });
    revalidatePath(`/properties/${data.property_id}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: 'Vous avez déjà laissé un avis pour ce logement' };
    }
    return { error: error.message };
  }
}
