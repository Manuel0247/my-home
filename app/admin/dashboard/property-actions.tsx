'use client';

import { useState } from 'react';
import { updatePropertyStatus } from '@/app/actions/properties';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function PropertyActions({ propertyId }: { propertyId: string }) {
    const [loading, setLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleStatusUpdate = async (
        status: 'approved' | 'rejected',
        reason?: string
    ) => {
        setLoading(true);
        try {
            const result = await updatePropertyStatus(propertyId, status, reason);
            if (result.error) throw new Error(result.error);
            toast.success(
                status === 'approved' ? 'Logement validé' : 'Logement refusé'
            );
            setIsRejectDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
                onClick={() => handleStatusUpdate('approved')}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Check className="h-4 w-4 mr-1" />
                )}
                Valider
            </Button>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        disabled={loading}
                    >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refuser le logement</DialogTitle>
                        <DialogDescription>
                            Veuillez indiquer la raison du refus pour l'hôte.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        <Label htmlFor="reason">Motif du refus</Label>
                        <Textarea
                            id="reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ex: Photos floues, description incomplète..."
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleStatusUpdate('rejected', rejectionReason)}
                            disabled={loading || !rejectionReason.trim()}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Confirmer le refus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
