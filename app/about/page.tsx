import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Shield,
  MapPin,
  Users,
  Star,
  Building2,
  HeartHandshake,
  CheckCircle2,
  School,
  Briefcase,
} from 'lucide-react';

export const metadata = {
  title: 'À propos — MyHome',
  description: "Découvrez la mission d'MyHome, la plateforme de référence pour le logement étudiant en Côte d'Ivoire.",
};

const stats = [
  { icon: Building2, value: '500+', label: 'Logements référencés' },
  { icon: Users, value: '1 000+', label: 'Étudiants logés' },
  { icon: MapPin, value: '12', label: 'Villes couvertes' },
  { icon: Star, value: '4.8 / 5', label: 'Note moyenne' },
];

const values = [
  {
    icon: Shield,
    title: 'Sécurité avant tout',
    desc: 'Chaque hôte et chaque logement est contrôlé et validé par notre équipe avant toute publication. Votre sécurité est notre engagement.',
  },
  {
    icon: HeartHandshake,
    title: 'Communauté de confiance',
    desc: 'Nous créons des liens durables entre étudiants et hôtes sérieux. La transparence et le respect mutuel sont au cœur de notre plateforme.',
  },
  {
    icon: Star,
    title: 'Qualité & accessibilité',
    desc: 'Des logements soigneusement sélectionnés à des prix adaptés aux budgets étudiants, partout en Côte d\'Ivoire.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Recherchez',
    desc: 'Trouvez un logement par ville, type ou budget grâce à notre moteur de recherche.',
  },
  {
    step: '02',
    title: 'Réservez',
    desc: 'Sélectionnez vos dates et envoyez une demande de réservation en quelques clics.',
  },
  {
    step: '03',
    title: 'Emménagez',
    desc: 'Votre hôte confirme et vous disposez d\'un logement sécurisé dès votre arrivée.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
            <Building2 className="h-4 w-4" />
            La plateforme #1 en Côte d&apos;Ivoire
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            À propos d&apos;MyHome
          </h1>
          <p className="text-xl text-blue-100 max-w-xl mx-auto">
            Nous simplifions l&apos;accès au logement pour les étudiants et jeunes actifs africains.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 block">Notre mission</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Logement étudiant, simplifié
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                MyHome est né d&apos;un constat simple : trouver un logement abordable et sûr est l&apos;un des plus grands défis pour les étudiants en Afrique. Chaque année, des milliers de jeunes arrivent dans les grandes villes sans savoir où dormir.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notre plateforme met en relation directe les étudiants, stagiaires et jeunes professionnels avec des hôtes vérifiés qui proposent des logements de qualité à des prix transparents.
              </p>
              <div className="space-y-2.5">
                {[
                  'Logements vérifiés et approuvés par notre équipe',
                  'Processus de réservation simple et sécurisé',
                  'Assistance disponible 7j/7',
                  'Prix transparents, sans frais cachés',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-blue-50 rounded-xl p-5 text-center border border-blue-100"
                >
                  <stat.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 block">Nos valeurs</span>
            <h2 className="text-3xl font-bold text-gray-900">Ce qui nous guide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 block">Processus</span>
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Fait pour vous</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: School, label: 'Étudiants', desc: 'Proches des campus et universités' },
              { icon: Briefcase, label: 'Stagiaires', desc: 'Séjours courts et flexibles' },
              { icon: Users, label: 'Jeunes actifs', desc: 'Contrats longue durée disponibles' },
            ].map((p) => (
              <div
                key={p.label}
                className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm text-center"
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

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Rejoignez MyHome aujourd&apos;hui</h2>
          <p className="text-blue-100 mb-8 text-base">
            Que vous cherchiez un logement ou souhaitiez proposer le vôtre, c&apos;est simple et gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold w-full sm:w-auto">
                Trouver un logement
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-white hover:bg-blue-600 hover:border-blue-400 w-full sm:w-auto"
              >
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
