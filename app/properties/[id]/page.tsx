import { getProperty } from '@/app/actions/properties';
import { getPropertyReviews } from '@/app/actions/reviews';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewForm } from '@/components/review-form';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Star,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Maison',
  studio: 'Studio',
  room: 'Chambre',
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${h} ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`}
        />
      ))}
    </span>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, reviews, session] = await Promise.all([
    getProperty(params.id),
    getPropertyReviews(params.id),
    getServerSession(authOptions),
  ]);

  if (!property) notFound();

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  const images: string[] =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/properties" className="hover:text-blue-600 transition-colors">Logements</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium line-clamp-1">{property.title}</span>
        </nav>

        {/* Title block */}
        <div className="mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                  {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                </Badge>
                {reviews.length > 0 && (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <strong>{averageRating.toFixed(1)}</strong>
                    <span className="text-gray-400">({reviews.length} avis)</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {property.address ? `${property.address}, ` : ''}{property.city}, {property.country}
              </p>
            </div>
          </div>
        </div>

        {/* Image gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="col-span-1 row-span-1 overflow-hidden">
              <img
                src={img}
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {/* Fill empty slots with a placeholder style */}
          {images.length < 5 &&
            Array.from({ length: 5 - images.length }).map((_, i) => (
              <div key={`empty-${i}`} className="col-span-1 row-span-1 bg-gray-100" />
            ))}
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="md:col-span-2 space-y-6">

            {/* Quick stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du logement</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{property.max_guests}</p>
                  <p className="text-xs text-gray-500">Personnes</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{property.bedrooms}</p>
                  <p className="text-xs text-gray-500">Chambre{property.bedrooms > 1 ? 's' : ''}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{property.bathrooms}</p>
                  <p className="text-xs text-gray-500">Salle{property.bathrooms > 1 ? 's' : ''} de bain</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">
                    {reviews.length > 0 ? averageRating.toFixed(1) : '—'}
                  </p>
                  <p className="text-xs text-gray-500">{reviews.length} avis</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House rules */}
            {property.house_rules && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Règles de la maison</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.house_rules}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Avis des voyageurs
                  <span className="ml-2 text-base font-normal text-gray-400">
                    ({reviews.length})
                  </span>
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} size="sm" />
                    <span className="text-sm font-semibold text-gray-800">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-5 mb-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {review.traveler_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{review.traveler_name}</span>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-6">
                  Aucun avis pour ce logement. Soyez le premier à partager votre expérience !
                </p>
              )}

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Laisser un avis</h3>
                {session?.user ? (
                  <ReviewForm propertyId={params.id} />
                ) : (
                  <p className="text-sm text-gray-500">
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Connectez-vous
                    </Link>{' '}
                    pour laisser un avis.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column — Booking card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 sticky top-24">
              <div className="mb-5">
                <p className="text-3xl font-bold text-blue-600">
                  {property.price_per_night.toLocaleString()} XOF
                </p>
                <p className="text-sm text-gray-500">par nuit · {property.currency}</p>
              </div>

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
                  <StarRating rating={averageRating} size="sm" />
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} avis)
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="font-medium text-gray-900">
                    {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capacité</span>
                  <span className="font-medium text-gray-900">{property.max_guests} pers.</span>
                </div>
                <div className="flex justify-between">
                  <span>Chambres</span>
                  <span className="font-medium text-gray-900">{property.bedrooms}</span>
                </div>
              </div>

              <Link href={`/booking/${property.id}`} className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Réserver maintenant
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-400 mt-3">
                Aucun frais avant la confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux logements
          </Link>
        </div>
      </div>
    </div>
  );
}
