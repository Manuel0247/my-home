'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createProperty, updateProperty } from '@/app/actions/properties';
import { uploadImage } from '@/app/actions/upload';
import { useSession } from 'next-auth/react';

const propertySchema = z.object({
    title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
    description: z.string().min(20, 'La description doit faire au moins 20 caractères'),
    property_type: z.enum(['apartment', 'house', 'studio', 'room']),
    address: z.string().min(5, "L'adresse est requise"),
    city: z.string().min(2, 'La ville est requise'),
    country: z.string().min(2, 'Le pays est requis'),
    price_per_night: z.coerce.number().min(1000, 'Le prix minimum est 1000 XOF'),
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    max_guests: z.coerce.number().min(1),
    amenities: z.array(z.string()).default([]),
    house_rules: z.string().optional(),
    images: z.array(z.string()).min(1, 'Au moins une image est requise'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const AMENITIES_LIST = [
    'Wifi',
    'Climatisation',
    'Cuisine',
    'Télévision',
    'Lave-linge',
    'Parking gratuit',
    'Piscine',
    'Jacuzzi',
    'Salle de sport',
    'Espace de travail',
];

interface PropertyFormProps {
    initialData?: any;
    mode: 'create' | 'edit';
}

export function PropertyForm({ initialData, mode }: PropertyFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: initialData ? {
            ...initialData,
            // Ensure arrays are initialized
            amenities: initialData.amenities || [],
            images: initialData.images || []
        } : {
            title: '',
            description: '',
            property_type: 'apartment',
            address: '',
            city: 'Abidjan',
            country: "Côte d'Ivoire",
            price_per_night: 25000,
            bedrooms: 1,
            bathrooms: 1,
            max_guests: 2,
            amenities: [],
            house_rules: '',
            images: [],
        },
    });

    async function onSubmit(data: PropertyFormValues) {
        if (!session) {
            toast.error('Vous devez être connecté');
            return;
        }
        setLoading(true);

        try {
            if (mode === 'create') {
                const result = await createProperty(data);
                if (result.error) throw new Error(result.error);

                toast.success('Propriété créée avec succès !');
                router.push('/host/dashboard');
            } else {
                const result = await updateProperty(initialData.id, data);
                if (result.error) throw new Error(result.error);

                toast.success('Propriété mise à jour !');
                router.push('/host/dashboard');
            }
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);
                const result = await uploadImage(formData);

                if (result.error) {
                    toast.error(`Erreur lors de l'upload de ${files[i].name}: ${result.error}`);
                } else if (result.url) {
                    newUrls.push(result.url);
                }
            }

            if (newUrls.length > 0) {
                const currentImages = form.getValues('images');
                form.setValue('images', [...currentImages, ...newUrls]);
                toast.success(`${newUrls.length} image(s) ajoutée(s)`);
            }
        } catch (error) {
            toast.error("Erreur lors de l'upload");
        } finally {
            setLoading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues('images');
        form.setValue(
            'images',
            currentImages.filter((_, i) => i !== index)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Informations de base */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations de base</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Titre de l&apos;annonce</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Appartement cosy à Cocody" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="property_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type de logement</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="apartment">Appartement</SelectItem>
                                            <SelectItem value="house">Maison</SelectItem>
                                            <SelectItem value="studio">Studio</SelectItem>
                                            <SelectItem value="room">Chambre privée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price_per_night"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prix par nuit (XOF)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description détaillée</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Décrivez votre logement..."
                                        className="h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 2: Localisation */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Localisation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Rue, quartier..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ville</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pays</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Section 3: Détails */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Détails et Capacité</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="max_guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Voyageurs max</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chambres</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salles de bain</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Section 4: Équipements */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Équipements</h3>
                    <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {AMENITIES_LIST.map((item) => (
                                        <FormField
                                            key={item}
                                            control={form.control}
                                            name="amenities"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item
                                                                            )
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 5: Photos */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Photos</h3>
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photos du logement</FormLabel>
                                <div className="space-y-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleUpload}
                                        disabled={loading}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Formats acceptés: JPG, PNG, WEBP.
                                    </p>
                                </div>
                                <FormMessage />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {field.value.map((url, index) => (
                                        <div key={index} className="relative group aspect-video">
                                            <img
                                                src={url}
                                                alt={`Photo ${index + 1}`}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 6: Règles */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Règles de la maison</h3>
                    <FormField
                        control={form.control}
                        name="house_rules"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Pas de fêtes, pas d'animaux..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'create' ? 'Créer l\'annonce' : 'Mettre à jour'}
                </Button>
            </form>
        </Form>
    );
}
