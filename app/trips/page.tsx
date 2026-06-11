import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getUserBookings } from '@/app/actions/bookings';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const bookings = await getUserBookings();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Aucun voyage prévu</h2>
                    <p className="text-gray-500 mb-8">
                        Il est temps de dépoussiérer vos valises et de commencer à planifier
                        votre prochaine aventure.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-brand hover:bg-brand/90">
                            Explorer les logements
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking: any) => (
                        <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100">
                                    {booking.property?.image && (
                                        <img
                                            src={booking.property.image}
                                            alt={booking.property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <CardContent className="flex-1 p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div>
                                            {booking.property ? (
                                                <>
                                                    <h3 className="text-xl font-bold mb-2">
                                                        {booking.property.title}
                                                    </h3>
                                                    <div className="flex items-center text-gray-500 mb-4">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {booking.property.city}
                                                    </div>
                                                </>
                                            ) : (
                                                <h3 className="text-xl font-bold mb-2 text-red-500">
                                                    Logement indisponible
                                                </h3>
                                            )}

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-brand" />
                                                    {new Date(booking.check_in).toLocaleDateString()} -{' '}
                                                    {new Date(booking.check_out).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <span className="font-semibold">Prix total: </span>
                                                {booking.total_price.toLocaleString()} XOF
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {booking.status === 'confirmed'
                                                    ? 'Confirmé'
                                                    : booking.status === 'pending'
                                                        ? 'En attente'
                                                        : 'Annulé'}
                                            </span>
                                            {booking.property_id && (
                                                <Link href={`/properties/${booking.property_id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Voir le logement
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
