# MyHome — CLAUDE.md

Plateforme de logement étudiant en Afrique (priorité Côte d'Ivoire). Connecte étudiants/jeunes actifs avec des hôtes vérifiés.

## Stack technique

- **Framework**: Next.js 13.5 App Router (TypeScript)
- **Base de données**: MongoDB Atlas via Mongoose
- **Auth**: NextAuth.js v4 — Credentials Provider, JWT
- **UI**: Tailwind CSS + shadcn/ui + Lucide icons
- **Uploads**: Cloudinary
- **Forms**: react-hook-form + Zod
- **Notifications**: Sonner (toasts)

## Structure du projet

```
app/
  (auth)/login|register/   # Pages d'authentification
  admin/dashboard/         # Tableau de bord admin
  host/dashboard/          # Tableau de bord hôte
  host/properties/new|[id]/edit/
  booking/[id]/            # Formulaire de réservation
  properties/              # Liste + détail
  trips/                   # Réservations utilisateur
  profile/                 # Profil
  about/                   # Page À propos
  actions/                 # Server Actions (auth, properties, bookings, reviews, upload)
  api/auth/[...nextauth]/  # Config NextAuth

components/
  layout/navbar.tsx        # Navbar sticky responsive
  layout/footer.tsx        # Footer 4 colonnes
  review-form.tsx          # Formulaire d'avis (client component)
  property-form.tsx        # Formulaire propriété (hôte)
  admin/property-details-dialog.tsx
  ui/                      # shadcn/ui (48 composants)

models/
  User.ts       # roles: traveler | host | admin
  Property.ts   # status: pending | approved | rejected
  Booking.ts    # status: pending | confirmed | cancelled | completed
  Review.ts     # rating 1-5, par propriété/utilisateur
```

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `traveler` | Browse, réserver, laisser des avis |
| `host` | Créer/gérer propriétés, gérer réservations |
| `admin` | Tout + validation des propriétés |

## Palette de couleurs (bleu/blanc)

```
brand.DEFAULT  = #2563EB  (blue-600)  — boutons CTA, liens actifs
brand.dark     = #1E3A8A  (blue-900)  — titres, éléments importants
brand.medium   = #3B82F6  (blue-500)  — accents secondaires
brand.light    = #BFDBFE  (blue-200)  — bordures, highlights
brand.lighter  = #EFF6FF  (blue-50)   — fonds de sections
```

## Variables d'environnement requises

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Commandes

```bash
npm run dev       # Dev server (port 3000 par défaut)
npm run build     # Build production
npm run lint      # ESLint
npm run typecheck # TypeScript check
```

## Conventions

- **Server Actions** dans `app/actions/` avec `'use server'` en tête
- **Composants client** avec `'use client'` uniquement si état/événements requis
- **Auth check** via `getServerSession(authOptions)` dans les server actions et pages
- **IDs MongoDB** toujours convertis en string : `id: p._id.toString()`
- **Langue**: toujours en français dans l'UI
- Les propriétés doivent être `status: 'approved'` pour apparaître publiquement
- Le modèle `Review` a un index unique `(property_id, traveler_id)` — un seul avis par logement

## Ajouter une nouvelle feature

1. Créer le modèle Mongoose dans `models/`
2. Créer les server actions dans `app/actions/`
3. Créer les composants UI dans `components/`
4. Créer/modifier les pages dans `app/`
5. Appeler `revalidatePath()` dans les actions qui modifient des données

## Pages existantes

| Route | Description |
|-------|-------------|
| `/` | Accueil avec hero, stats, features, logements en vedette |
| `/properties` | Liste filtrée (ville, type, prix) |
| `/properties/[id]` | Détail + avis + bouton réservation |
| `/booking/[id]` | Formulaire de réservation (auth requis) |
| `/trips` | Mes réservations (auth requis) |
| `/profile` | Mon profil (auth requis) |
| `/host/dashboard` | Dashboard hôte (role: host/admin) |
| `/admin/dashboard` | Dashboard admin (role: admin) |
| `/about` | À propos de la plateforme |
| `/login` `/register` | Authentification |

## Fonctionnalités planifiées (non implémentées)

- Intégration paiement (Mobile Money, Wave, Orange Money)
- Messagerie temps réel hôte ↔ voyageur
- Carte interactive des propriétés
- Notifications push/email
- Calendrier de disponibilité pour les hôtes
- Wishlist / Favoris
