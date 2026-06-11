import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Home, Calendar, DollarSign, Eye } from 'lucide-react';
import { getHostProperties } from '@/app/actions/properties';
import { getHostBookings } from '@/app/actions/bookings';
import { BookingActions } from './booking-actions';

export const dynamic = 'force-dynamic';

export default async function HostDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // @ts-ignore
  if (session.user.role !== 'host' && session.user.role !== 'admin') {
    redirect('/');
  }

  const [properties, bookings] = await Promise.all([
    getHostProperties(),
    getHostBookings(),
  ]);

  const activeBookings =
    bookings.filter((b: any) => b.status === 'confirmed').length || 0;
  const totalRevenue =
    bookings
      .filter((b: any) => b.payment_status === 'paid')
      .reduce((acc: number, b: any) => acc + b.total_price, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord Hôte</h1>
        <Link href="/host/properties/new">
          <Button className="bg-brand hover:bg-brand/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes logements
            </CardTitle>
            <Home className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Réservations actives
            </CardTitle>
            <Calendar className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus totaux
            </CardTitle>
            <DollarSign className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalRevenue.toLocaleString()} XOF
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mes annonces</CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Vous n&apos;avez pas encore d&apos;annonce</p>
              <Link href="/host/properties/new">
                <Button className="bg-brand hover:bg-brand/90">
                  Créer ma première annonce
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property: any) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 bg-cover bg-center rounded"
                      style={{
                        backgroundImage: `url(${Array.isArray(property.images) && property.images[0]
                          ? property.images[0]
                          : 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200'
                          })`,
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-gray-600">
                        {property.city} · {property.price_per_night} XOF/nuit
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs rounded ${property.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {property.status === 'approved'
                          ? 'Approuvé'
                          : property.status === 'pending'
                            ? 'En attente'
                            : 'Refusé'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/host/properties/${property.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune réservation pour le moment
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">
                      {booking.properties?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.check_in).toLocaleDateString()} -{' '}
                      {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Voyageur: {booking.traveler.first_name} {booking.traveler.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand">
                      {booking.total_price.toLocaleString()} XOF
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded ${booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {booking.status}
                    </span>
                    {booking.status === 'pending' && (
                      <BookingActions bookingId={booking.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
