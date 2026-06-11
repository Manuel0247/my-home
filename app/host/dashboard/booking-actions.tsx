'use client';

import { useState } from 'react';
import { updateBookingStatus } from '@/app/actions/bookings';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function BookingActions({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (status: 'confirmed' | 'cancelled') => {
        setLoading(true);
        try {
            const result = await updateBookingStatus(bookingId, status);
            if (result.error) throw new Error(result.error);
            toast.success(
                status === 'confirmed' ? 'Réservation acceptée' : 'Réservation refusée'
            );
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end mt-2">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Check className="h-4 w-4 mr-1" />
                )}
                Accepter
            </Button>

            <Button
                size="sm"
                variant="destructive"
                className="h-8"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <X className="h-4 w-4 mr-1" />
                )}
                Refuser
            </Button>
        </div>
    );
}
