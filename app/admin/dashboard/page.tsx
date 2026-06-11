import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, ShieldCheck, DollarSign } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { PropertyActions } from './property-actions';
import { PropertyDetailsDialog } from '@/components/admin/property-details-dialog';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // @ts-ignore
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();
  const [userCount, propertyCount, bookings, recentProperties] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Booking.find({ status: 'confirmed' }),
    Property.find({ status: 'pending' }).limit(5).populate('host_id', 'first_name last_name email phone').lean(),
  ]);

  const totalRevenue = bookings.reduce((acc, b) => acc + b.total_price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Administrateur</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Utilisateurs
            </CardTitle>
            <Users className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Logements
            </CardTitle>
            <Building className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{propertyCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Volume Réservations
            </CardTitle>
            <ShieldCheck className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Volume d'affaires
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

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Logements en attente de validation</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProperties.length === 0 ? (
              <p className="text-gray-500">Aucun logement en attente.</p>
            ) : (
              <div className="space-y-4">
                {recentProperties.map((property: any) => (
                  <div key={property._id.toString()} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{property.title}</p>
                      <p className="text-sm text-gray-500">
                        Hôte: {property.host_id?.first_name} {property.host_id?.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PropertyDetailsDialog property={{
                        ...property,
                        _id: property._id.toString(),
                        host_id: {
                          ...property.host_id,
                          _id: property.host_id?._id?.toString()
                        }
                      }} />
                      <PropertyActions propertyId={property._id.toString()} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Further Admin panels could go here */}
      </div>
    </div>
  );
}
