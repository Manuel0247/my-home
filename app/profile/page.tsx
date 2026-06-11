import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Shield } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    await connectDB();
    // @ts-ignore
    const user = await UserModel.findById(session.user.id).lean();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-8">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.image} alt={user.first_name} />
                        <AvatarFallback className="text-2xl bg-brand text-white">
                            {user.first_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">
                            {user.first_name} {user.last_name}
                        </CardTitle>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                            <Phone className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Téléphone</p>
                                <p className="font-medium">{user.phone || 'Non renseigné'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                            <Shield className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Statut du compte</p>
                                <p className="font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Actif
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
