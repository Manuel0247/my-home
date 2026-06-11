'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createBooking } from '@/app/actions/bookings';
import { useSession } from 'next-auth/react';

export default function BookingPage({ params, searchParams }: any) {
    // Note: params and searchParams in standard client components are props, 
    // but fetching property details should ideally be passed down or fetched via SWR/effect if completely client side,
    // OR this component remains server side for fetching property, then uses a client component for the form.
    // For simplicity in this migration, let's assume this page receives property data, 
    // BUT since we just refactored it, let's make it a wrapper.
    // However, to keep it simple with the previous structure:
    // We will make this a Client Component that unfortunately has to fetch property details client-side 
    // or we should have made it a Server Component.
    // Given the previous implementation was Client Side, let's stick to Client Side for the interaction, 
    // but we need to fetch property. 
    // actually, let's switch this to a Server Component that renders a Client Form.
    return <BookingForm propertyId={params.id} />
}

import { useEffect } from 'react';
import { getProperty } from '@/app/actions/properties';

function BookingForm({ propertyId }: { propertyId: string }) {
    const router = useRouter();
    const { data: session } = useSession();

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [date, setDate] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        loadPropertyData();
    }, [propertyId]);

    async function loadPropertyData() {
        const data = await getProperty(propertyId);
        if (!data) {
            toast.error("Propriété introuvable");
            router.push('/');
            return;
        }
        setProperty(data);
        setLoading(false);
    }

    const handleBooking = async () => {
        if (!session) {
            toast.error('Veuillez vous connecter pour réserver');
            router.push('/login');
            return;
        }

        if (!date?.from || !date?.to) {
            toast.error('Veuillez sélectionner des dates');
            return;
        }

        setSubmitting(true);

        try {
            const nights = differenceInDays(date.to, date.from);
            const totalPrice = nights * property.price_per_night;

            const result = await createBooking({
                property_id: property.id,
                check_in: date.from.toISOString(),
                check_out: date.to.toISOString(),
                guests: guests,
                total_price: totalPrice,
                status: 'pending',
                payment_status: 'pending'
            });

            if (result.error) throw new Error(result.error);

            toast.success('Demande de réservation envoyée !');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!property) return null;

    const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
    const totalPrice = nights * property.price_per_night;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Finaliser votre réservation</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recapitualtif */}
                <Card>
                    <CardHeader>
                        <CardTitle>Détails du logement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full bg-gray-100 rounded-md mb-4 overflow-hidden">
                            {property.images?.[0] && (
                                <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                        <p className="text-gray-600 mb-4">{property.city}, {property.country}</p>
                        <div className="flex justify-between items-center py-4 border-t">
                            <span className="font-medium">Prix par nuit</span>
                            <span>{property.price_per_night.toLocaleString()} XOF</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulaire */}
                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la réservation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Dates du séjour</Label>
                            <div className={cn("grid gap-2")}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "d LLL y", { locale: fr })} -{" "}
                                                        {format(date.to, "d LLL y", { locale: fr })}
                                                    </>
                                                ) : (
                                                    format(date.from, "d LLL y", { locale: fr })
                                                )
                                            ) : (
                                                <span>Sélectionner des dates</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Voyageurs</Label>
                            <Input
                                type="number"
                                min={1}
                                max={property.max_guests}
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                            />
                            <p className="text-xs text-gray-500">Maximum: {property.max_guests} personnes</p>
                        </div>

                        {nights > 0 && (
                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between">
                                    <span>{property.price_per_night.toLocaleString()} x {nights} nuits</span>
                                    <span>{totalPrice.toLocaleString()} XOF</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>{totalPrice.toLocaleString()} XOF</span>
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full bg-brand hover:bg-brand/90"
                            size="lg"
                            onClick={handleBooking}
                            disabled={submitting || !date?.from || !date?.to}
                        >
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmer la réservation
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
