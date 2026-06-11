'use client';

import { PropertyForm } from '@/components/property-form';

export default function NewPropertyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Ajouter une nouvelle annonce</h1>
            <PropertyForm mode="create" />
        </div>
    );
}
