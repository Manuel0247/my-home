'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, MapPin, Bed, Bath, Users, Ruler } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { PropertyActions } from '@/app/admin/dashboard/property-actions';

interface PropertyDetailsProps {
    property: {
        _id: string;
        title: string;
        description: string;
        address: string;
        city: string;
        country: string; // Changed from 'state' to 'country' based on my view of Property model
        price_per_night: number;
        currency: string;
        bedrooms: number;
        bathrooms: number;
        max_guests: number;
        amenities: string[];
        images: string[];
        host_id: {
            _id: string;
            first_name: string;
            last_name: string;
            email?: string;
            phone?: string;
        };
        status: string;
    };
}

export function PropertyDetailsDialog({ property }: PropertyDetailsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Voir détails
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold truncate pr-8">
                            {property.title}
                        </DialogTitle>
                        <Badge variant={property.status === 'pending' ? 'secondary' : property.status === 'approved' ? 'default' : 'destructive'}>
                            {property.status === 'pending' ? 'En attente' : property.status === 'approved' ? 'Validé' : 'Refusé'}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                        {/* Images Carousel */}
                        {property.images && property.images.length > 0 ? (
                            <div className="w-full flex justify-center bg-gray-100 rounded-lg p-4">
                                <Carousel className="w-full max-w-2xl">
                                    <CarouselContent>
                                        {property.images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                                    <Image
                                                        src={image}
                                                        alt={`${property.title} - Image ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                Aucune images disponible
                            </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Caractéristiques</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>{property.max_guests} voyageurs</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Bed className="h-4 w-4" />
                                            <span>{property.bedrooms} chambres</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Bath className="h-4 w-4" />
                                            <span>{property.bathrooms} SDB</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Équipements</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((amenity, index) => (
                                            <Badge key={index} variant="secondary">
                                                {amenity}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h3 className="font-semibold text-lg">Informations</h3>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                            <span>
                                                {property.address}<br />
                                                {property.city}, {property.country}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-gray-500">Hôte</p>
                                            <p className="font-medium">
                                                {property.host_id.first_name} {property.host_id.last_name}
                                            </p>
                                            {property.host_id.email && (
                                                <p className="text-sm text-gray-600">{property.host_id.email}</p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-gray-500">Prix par nuit</p>
                                            <p className="text-2xl font-bold text-brand">
                                                {property.price_per_night.toLocaleString()} {property.currency}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <PropertyActions propertyId={property._id} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
