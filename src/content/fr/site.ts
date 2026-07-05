/**
 * French site UI strings.
 * Keeps the same keys as the English canonical file. URLs stay English.
 */

import type { SiteContent } from "../en/site";

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Agence de croissance par la recherche pour Google, la recherche IA et le chiffre d'affaires.",
    marketsLine: "Au service des clients aux États-Unis, au Canada et en Australie.",
  },
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Secteurs", href: "/industries" },
    { label: "Marchés", href: "/markets" },
    { label: "Réalisations", href: "/work" },
    { label: "Preuves", href: "/proof" },
    { label: "Analyses", href: "/insights" },
    { label: "A propos", href: "/about" },
  ],
  primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
  secondaryCta: { label: "Réserver un appel", href: "/book-a-call" },
  footer: {
    groups: [
      {
        title: "Services",
        links: [
          { label: "Stratégie SEO", href: "/services/seo-agency" },
          { label: "SEO technique", href: "/services/technical-seo" },
          { label: "Optimisation pour la recherche IA", href: "/services/ai-search-optimization" },
          { label: "Marketing de contenu", href: "/services/content-marketing" },
          { label: "RP numériques et création de liens", href: "/services/digital-pr-link-building" },
          { label: "Gestion PPC", href: "/services/ppc-management" },
          { label: "SEO local", href: "/services/local-seo" },
          { label: "SEO e-commerce", href: "/services/ecommerce-seo" },
          { label: "SEO international", href: "/services/international-seo" },
          { label: "Audit SEO", href: "/services/seo-audit" },
          { label: "Service de mentorat SEO", href: "/services/seo-mentor-service" },
        ],
      },
      {
        title: "Secteurs",
        links: [
          { label: "SEO Voyage", href: "/industries/travel-seo" },
          { label: "SEO Éducation", href: "/industries/education-seo" },
          { label: "SEO Santé", href: "/industries/healthcare-seo" },
          { label: "SEO Juridique et Immigration", href: "/industries/legal-immigration-seo" },
          { label: "SEO SaaS", href: "/industries/saas-seo" },
          { label: "SEO E-commerce", href: "/industries/ecommerce-seo" },
          { label: "SEO Franchise et Local", href: "/industries/franchise-local-seo" },
        ],
      },
      {
        title: "Marchés",
        links: [
          { label: "Agence SEO États-Unis", href: "/markets/usa-seo-agency" },
          { label: "Agence SEO Canada", href: "/markets/canada-seo-agency" },
          { label: "Agence SEO Australie", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Réalisations",
        links: [
          { label: "Réalisations", href: "/work" },
          { label: "Cas clients", href: "/work/case-studies" },
          { label: "Audits exemples", href: "/work/sample-audits" },
          { label: "Cadres de croissance search", href: "/work/search-growth-frameworks" },
          { label: "Résultats clients", href: "/work/client-results" },
        ],
      },
      {
        title: "Preuves",
        links: [
          { label: "Preuves", href: "/proof" },
          { label: "Expérience de marque", href: "/proof/brand-experience" },
          { label: "Présence média", href: "/proof/media-features" },
          { label: "Avis clients", href: "/proof/client-reviews" },
          { label: "Avis vidéo", href: "/proof/video-reviews" },
          { label: "Porte-parole", href: "/proof/spokesperson" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { label: "A propos", href: "/about" },
          { label: "Methodologie", href: "/methodology" },
          { label: "Comment nous travaillons", href: "/how-we-work" },
          { label: "Audit SEO gratuit", href: "/free-seo-audit" },
          { label: "Prendre rendez-vous", href: "/book-a-call" },
          { label: "Contact", href: "/contact" },
          { label: "Confidentialite", href: "/privacy-policy" },
          { label: "Politique cookies", href: "/cookie-policy" },
          { label: "Preferences cookies", href: "/cookie-preferences" },
          { label: "Conditions", href: "/terms" },
          { label: "Accessibilite", href: "/accessibility" },
          { label: "Demande de donnees", href: "/data-request" },
        ],
      },
    ],
    footnote:
      "L'expérience de l'équipe et des partenaires sélectionnés inclut des marques mondiales et des partenaires. Les noms de marque sont mentionnés à titre indicatif uniquement et n'impliquent aucune approbation sauf mention explicite.",
    rights: "Tous droits réservés.",
  },
  ui: {
    bookCallLabel: "Réserver un appel",
    exploreService: "Découvrir le service",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    auditPreview: "Aperçu de l'audit",
    reportFormat: "Format du rapport",
    auditIncludes: "L'audit comprend",
    module: "Module",
    outcome: "Résultat",
    languageLabel: "Langue",
    home: "Accueil",
    services: "Services",
  },
};
