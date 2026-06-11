import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { getProperties } from '@/app/actions/properties';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Maison',
  studio: 'Studio',
  room: 'Chambre',
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    city: searchParams.city as string,
    propertyType: searchParams.propertyType as string,
    minPrice: searchParams.minPrice as string,
    maxPrice: searchParams.maxPrice as string,
  };

  const properties = await getProperties(filters);

  const hasFilters = filters.city || filters.propertyType || filters.minPrice || filters.maxPrice;

  async function searchAction(formData: FormData) {
    'use server';
    const params = new URLSearchParams();
    const city = formData.get('city') as string;
    const propertyType = formData.get('propertyType') as string;
    const minPrice = formData.get('minPrice') as string;
    const maxPrice = formData.get('maxPrice') as string;

    if (city) params.set('city', city);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    redirect(`/properties?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tous les logements</h1>
          <p className="text-sm text-gray-500">
            {properties.length} logement{properties.length !== 1 ? 's' : ''} disponible{properties.length !== 1 ? 's' : ''}
            {filters.city ? ` à ${filters.city}` : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <form action={searchAction}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-colors">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  name="city"
                  placeholder="Ville…"
                  defaultValue={filters.city}
                  className="w-full text-sm bg-transparent outline-none py-2.5 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <Select name="propertyType" defaultValue={filters.propertyType || 'all'}>
                <SelectTrigger className="md:w-44">
                  <SelectValue placeholder="Type de logement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="room">Chambre</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-colors flex-1 md:w-36">
                  <span className="text-xs text-gray-400 flex-shrink-0">Min</span>
                  <input
                    name="minPrice"
                    type="number"
                    placeholder="0"
                    defaultValue={filters.minPrice}
                    className="w-full text-sm bg-transparent outline-none py-2.5 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-colors flex-1 md:w-36">
                  <span className="text-xs text-gray-400 flex-shrink-0">Max</span>
                  <input
                    name="maxPrice"
                    type="number"
                    placeholder="∞"
                    defaultValue={filters.maxPrice}
                    className="w-full text-sm bg-transparent outline-none py-2.5 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                {hasFilters && (
                  <Link href="/properties">
                    <Button type="button" variant="outline" className="text-gray-500">
                      Effacer
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtres actifs :
            </div>
            {filters.city && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Ville : {filters.city}
              </Badge>
            )}
            {filters.propertyType && filters.propertyType !== 'all' && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {PROPERTY_TYPE_LABELS[filters.propertyType] || filters.propertyType}
              </Badge>
            )}
            {filters.minPrice && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Min : {parseInt(filters.minPrice).toLocaleString()} XOF
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Max : {parseInt(filters.maxPrice).toLocaleString()} XOF
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Aucun logement trouvé</p>
            <p className="text-sm text-gray-400 mb-4">Essayez d&apos;élargir vos critères de recherche.</p>
            <Link href="/properties">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Voir tous les logements
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {properties.map((property: any) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        Array.isArray(property.images) && property.images[0]
                          ? property.images[0]
                          : 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                      }
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-700 hover:bg-white text-xs font-medium shadow-sm">
                        {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      {property.city}, {property.country}
                    </p>
                    <div className="flex justify-between items-end pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400">
                        {property.bedrooms} ch. · {property.max_guests} pers.
                      </p>
                      <div className="text-right">
                        <span className="text-base font-bold text-blue-600">
                          {property.price_per_night.toLocaleString()} XOF
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/nuit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
