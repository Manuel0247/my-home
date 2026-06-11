import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import { getProperty } from '@/app/actions/properties';
import { PropertyForm } from '@/components/property-form';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const property = await getProperty(params.id);

    if (!property) {
        notFound();
    }

    // @ts-ignore
    if (property.host_id !== session.user.id) {
        redirect('/host/dashboard');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Modifier l'annonce</h1>
            <PropertyForm mode="edit" initialData={property} />
        </div>
    );
}
