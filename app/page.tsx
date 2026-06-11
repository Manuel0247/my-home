import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Users,
  ShieldCheck,
  Star,
  ArrowRight,
  Building2,
  Home as HomeIcon,
  School,
  Briefcase,
} from 'lucide-react';
import { getFeaturedProperties } from '@/app/actions/properties';

export const dynamic = 'force-dynamic';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Maison',
  studio: 'Studio',
  room: 'Chambre',
};

const features = [
  {
    icon: ShieldCheck,
    title: 'Hôtes vérifiés',
    description: 'Chaque hôte est contrôlé avant publication. Votre sécurité est notre priorité.',
  },
  {
    icon: MapPin,
    title: 'Partout en Côte d\'Ivoire',
    description: 'Abidjan, Yamoussoukro, Bouaké, San-Pedro… Des logements dans toutes les grandes villes.',
  },
  {
    icon: Users,
    title: 'Communauté étudiante',
    description: 'Une plateforme pensée pour les étudiants, stagiaires et jeunes professionnels.',
  },
];

const profiles = [
  { icon: School, label: 'Étudiants', desc: 'Logements proches des universités' },
  { icon: Briefcase, label: 'Stagiaires', desc: 'Séjours courts et flexibles' },
  { icon: Users, label: 'Jeunes actifs', desc: 'Locations longue durée' },
  { icon: HomeIcon, label: 'Familles', desc: 'Maisons et appartements spacieux' },
];

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative h-[580px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-blue-950/65" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            Plateforme #1 de logement étudiant en Côte d&apos;Ivoire
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Trouvez votre logement{' '}
            <span className="text-blue-300">idéal</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            La plateforme de confiance pour étudiants, stagiaires et jeunes actifs en Afrique.
          </p>

          <form
            action="/properties"
            className="bg-white rounded-xl shadow-2xl p-2 flex gap-2 max-w-lg mx-auto"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                name="city"
                placeholder="Ville (Abidjan, Yamoussoukro…)"
                className="w-full text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400 py-2"
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-5 flex-shrink-0"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Logements' },
              { value: '12', label: 'Villes couvertes' },
              { value: '1 000+', label: 'Étudiants logés' },
              { value: '4.8 ★', label: 'Note moyenne' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pourquoi choisir MyHome ?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Une plateforme pensée pour les besoins réels des étudiants africains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Logements en vedette</h2>
              <p className="text-gray-500 mt-1">Sélectionnés pour leur qualité et leur rapport qualité/prix</p>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium mb-1">Aucun logement disponible pour le moment</p>
              <p className="text-sm mb-4">Soyez le premier à publier une annonce.</p>
              <Link href="/host/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">Devenir hôte</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredProperties.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={
                          Array.isArray(property.images) && property.images[0]
                            ? property.images[0]
                            : 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                        }
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-700 hover:bg-white text-xs font-medium shadow-sm">
                          {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        {property.city}, {property.country}
                      </p>
                      <div className="flex justify-between items-end">
                        <p className="text-xs text-gray-400">
                          {property.bedrooms} ch. · {property.max_guests} pers.
                        </p>
                        <div className="text-right">
                          <span className="text-base font-bold text-blue-600">
                            {property.price_per_night.toLocaleString()} XOF
                          </span>
                          <span className="text-xs text-gray-400 ml-1">/nuit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/properties">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Voir tous les logements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who is it for ─────────────────────────────────── */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pour qui est MyHome ?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profiles.map((p) => (
              <div
                key={p.label}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center"
              >
                <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-100">
                  <p.icon className="h-5 w-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{p.label}</p>
                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Host CTA ──────────────────────────────────────── */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">
            Devenez hôte sur MyHome
          </h2>
          <p className="text-blue-100 mb-8 text-base leading-relaxed">
            Louez votre logement et générez des revenus supplémentaires en accueillant des étudiants et jeunes professionnels vérifiés.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/host/dashboard">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold w-full sm:w-auto">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-white hover:bg-blue-600 hover:border-blue-400 w-full sm:w-auto"
              >
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
