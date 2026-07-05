/**
 * French site UI strings.
 * Keeps the same keys as the English canonical file. URLs stay English.
 */

import type { SiteContent } from "../en/site";

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Agence de croissance par la recherche pour Google, la recherche IA et le chiffre d'affaires.",
    marketsLine: "Au service de clients aux Etats-Unis, au Canada et en Australie.",
  },
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Solutions", href: "/industries" },
    { label: "Realisations", href: "/work" },
    { label: "Analyses", href: "/insights" },
    { label: "Entreprise", href: "/about" },
    { label: "Tarifs", href: "/pricing" },
  ],
  megaMenu: [
    {
      id: "services",
      label: "Services",
      description: "Choisir la capacite de croissance search adaptee au probleme commercial.",
      groups: [
        {
          title: "Services principaux",
          links: [
            {
              label: "Strategie SEO et audit",
              href: "/services/seo-agency",
              description: "Feuilles de route, diagnostic, priorisation et plan de croissance search.",
              chip: "Strategie",
            },
            {
              label: "SEO technique",
              href: "/services/technical-seo",
              description: "Exploration, indexation, rendu, performance et architecture de site.",
              chip: "Fondation",
            },
            {
              label: "Recherche IA / GEO",
              href: "/services/ai-search-optimization",
              description: "Preparation aux surfaces de reponse, entites, citations et qualite des sources.",
              chip: "IA",
            },
            {
              label: "Autorite de contenu",
              href: "/services/content-marketing",
              description: "Systemes de contenu experts relies a l'intention de revenu.",
              chip: "Autorite",
            },
          ],
        },
        {
          title: "Canaux de croissance",
          links: [
            {
              label: "SEO local et international",
              href: "/services/international-seo",
              description: "Architecture multi-marche, visibilite locale et expansion hreflang fiable.",
              chip: "Marches",
            },
            {
              label: "Gestion PPC",
              href: "/services/ppc-management",
              description: "Capture de demande payante alignee sur l'intelligence organique.",
              chip: "Paid",
            },
            {
              label: "Mentorat SEO",
              href: "/services/seo-mentor-service",
              description: "Conseil, accompagnement fondateur et montee en competence des equipes.",
              chip: "Conseil",
            },
          ],
        },
      ],
      cta: {
        label: "Commencer par un audit SEO gratuit",
        href: "/free-seo-audit",
        description: "Vous hesitez sur le besoin prioritaire ? Demandez d'abord un diagnostic.",
      },
    },
    {
      id: "solutions",
      label: "Solutions",
      description: "Explorer les systemes de croissance search par secteur et par marche.",
      groups: [
        {
          title: "Par secteur",
          links: [
            {
              label: "Voyage et hotellerie",
              href: "/industries/travel-seo",
              description: "Demandes destination, hotel, restaurant et reservation.",
            },
            {
              label: "Education",
              href: "/industries/education-seo",
              description: "Parcours de recherche autour des programmes, institutions et inscriptions.",
            },
            {
              label: "Sante et bien-etre",
              href: "/industries/healthcare-seo",
              description: "Recherche locale et autorite de contenu pour les secteurs sensibles.",
            },
            {
              label: "Juridique et immigration",
              href: "/industries/legal-immigration-seo",
              description: "Reputation, juridiction et demandes a forte intention.",
            },
            {
              label: "SaaS et technologie",
              href: "/industries/saas-seo",
              description: "Categories, alternatives, integrations et visibilite IA.",
            },
            {
              label: "eCommerce",
              href: "/industries/ecommerce-seo",
              description: "Architecture search par categories, produits et transactions.",
            },
            {
              label: "Franchise et multi-sites",
              href: "/industries/franchise-local-seo",
              description: "Systemes de recherche a l'echelle locale sans pages satellite.",
            },
          ],
        },
        {
          title: "Par marche",
          links: [
            {
              label: "Etats-Unis",
              href: "/markets/usa-seo-agency",
              description: "Concurrence nationale, locale, avis, PPC et recherche IA.",
            },
            {
              label: "Canada",
              href: "/markets/canada-seo-agency",
              description: "Comportements de recherche bilingues et provinciaux EN/FR.",
            },
            {
              label: "Australie",
              href: "/markets/australia-seo-agency",
              description: "Demande metropolitaine, local packs, reputation et paid search.",
            },
            {
              label: "SEO international / recherche multi-marche",
              href: "/services/international-seo",
              description: "Architecture de croissance cross-market sans duplication de contenu.",
            },
          ],
        },
      ],
    },
    {
      id: "work",
      label: "Realisations",
      description: "Consulter les cas clients verifies, exemples de livrables et standards de preuve.",
      groups: [
        {
          title: "Realisations et preuves",
          links: [
            {
              label: "Hub realisations",
              href: "/work",
              description: "Comment Taskcover transforme la methode en livrables.",
            },
            {
              label: "Cas clients",
              href: "/work/case-studies",
              description: "Etudes de cas publiques de croissance search verifiee.",
            },
            {
              label: "Audits exemples",
              href: "/work/sample-audits",
              description: "Livrables illustratifs qui montrent la methode.",
            },
            {
              label: "Resultats clients",
              href: "/work/client-results",
              description: "Standards de publication et gestion des resultats verifies.",
            },
            {
              label: "Systeme de preuve",
              href: "/proof",
              description: "Regles d'evidence, standards d'autorite et parcours de confiance.",
            },
            {
              label: "Cadres de croissance search",
              href: "/work/search-growth-frameworks",
              description: "Modeles operationnels et cadres strategiques.",
            },
          ],
        },
      ],
      cta: {
        label: "Demander une reference privee",
        href: "/contact?intent=private-reference",
        description: "Les references privees qualifiees sont traitees au cas par cas.",
      },
    },
    {
      id: "insights",
      label: "Analyses",
      description: "Lire des guides pratiques par sujet de croissance search.",
      groups: [
        {
          title: "Categories editoriales",
          links: [
            {
              label: "Guides SEO",
              href: "/insights/seo-guides",
              description: "Strategie search, croissance du revenu et SEO moderne.",
            },
            {
              label: "Recherche IA et GEO",
              href: "/insights/ai-search",
              description: "Visibilite IA, citations, surfaces de reponse et mesure.",
            },
            {
              label: "SEO technique",
              href: "/insights/technical-seo",
              description: "Exploration, rendu, performance et indexation.",
            },
            {
              label: "Autorite de contenu",
              href: "/insights/content-authority",
              description: "Information gain, autorite thematique et citations.",
            },
            {
              label: "SEO local et international",
              href: "/insights/local-international-seo",
              description: "Expansion de marche, recherche locale et structure multilingue.",
            },
            {
              label: "PPC et intelligence search",
              href: "/insights/ppc-search-intelligence",
              description: "Alignement des signaux payants et organiques.",
            },
            {
              label: "Mentorat SEO",
              href: "/insights/seo-mentor",
              description: "Conseil, formation et leadership search.",
            },
          ],
        },
      ],
      cta: {
        label: "Explorer le hub Analyses",
        href: "/insights",
        description: "Les articles soutiennent la bonne page commerciale sans la remplacer.",
      },
    },
    {
      id: "company",
      label: "Entreprise",
      description: "Comprendre le modele operationnel, les standards de confiance et les contacts.",
      groups: [
        {
          title: "Entreprise",
          links: [
            {
              label: "A propos",
              href: "/about",
              description: "Identite, principes operationnels et regles de preuve.",
            },
            {
              label: "Methodologie",
              href: "/methodology",
              description: "Search Growth Operating System et approche diagnostique.",
            },
            {
              label: "Comment nous travaillons",
              href: "/how-we-work",
              description: "Flux d'engagement, entrees, validations et rythme de collaboration.",
            },
            {
              label: "Contact",
              href: "/contact",
              description: "Routage vente, media, partenariat et demandes generales.",
            },
            {
              label: "Accessibilite",
              href: "/accessibility",
              description: "Approche accessibilite et canal de retour.",
            },
            {
              label: "Demande de donnees",
              href: "/data-request",
              description: "Parcours privacy et demande de donnees.",
            },
          ],
        },
      ],
    },
  ],
  primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
  secondaryCta: { label: "Reserver un appel", href: "/book-a-call" },
  footer: {
    groups: [
      {
        title: "Services",
        links: [
          { label: "Strategie SEO", href: "/services/seo-agency" },
          { label: "SEO technique", href: "/services/technical-seo" },
          { label: "Optimisation recherche IA", href: "/services/ai-search-optimization" },
          { label: "Marketing de contenu", href: "/services/content-marketing" },
          { label: "RP numeriques et liens", href: "/services/digital-pr-link-building" },
          { label: "Gestion PPC", href: "/services/ppc-management" },
          { label: "SEO local", href: "/services/local-seo" },
          { label: "SEO e-commerce", href: "/services/ecommerce-seo" },
          { label: "SEO international", href: "/services/international-seo" },
          { label: "Audit SEO", href: "/services/seo-audit" },
          { label: "Mentorat SEO", href: "/services/seo-mentor-service" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "SEO voyage", href: "/industries/travel-seo" },
          { label: "SEO education", href: "/industries/education-seo" },
          { label: "SEO sante", href: "/industries/healthcare-seo" },
          { label: "SEO juridique et immigration", href: "/industries/legal-immigration-seo" },
          { label: "SEO SaaS", href: "/industries/saas-seo" },
          { label: "SEO e-commerce", href: "/industries/ecommerce-seo" },
          { label: "SEO franchise et local", href: "/industries/franchise-local-seo" },
          { label: "Agence SEO Etats-Unis", href: "/markets/usa-seo-agency" },
          { label: "Agence SEO Canada", href: "/markets/canada-seo-agency" },
          { label: "Agence SEO Australie", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Realisations",
        links: [
          { label: "Realisations", href: "/work" },
          { label: "Cas clients", href: "/work/case-studies" },
          { label: "Audits exemples", href: "/work/sample-audits" },
          { label: "Cadres de croissance search", href: "/work/search-growth-frameworks" },
          { label: "Resultats clients", href: "/work/client-results" },
          { label: "Preuves", href: "/proof" },
          { label: "Reference privee", href: "/contact?intent=private-reference" },
        ],
      },
      {
        title: "Analyses",
        links: [
          { label: "Guides SEO", href: "/insights/seo-guides" },
          { label: "Recherche IA et GEO", href: "/insights/ai-search" },
          { label: "SEO technique", href: "/insights/technical-seo" },
          { label: "Autorite de contenu", href: "/insights/content-authority" },
          { label: "SEO local et international", href: "/insights/local-international-seo" },
          { label: "PPC et intelligence search", href: "/insights/ppc-search-intelligence" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { label: "A propos", href: "/about" },
          { label: "Methodologie", href: "/methodology" },
          { label: "Comment nous travaillons", href: "/how-we-work" },
          { label: "Tarifs", href: "/pricing" },
          { label: "Audit SEO gratuit", href: "/free-seo-audit" },
          { label: "Prendre rendez-vous", href: "/book-a-call" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
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
      "L'experience selectionnee de l'equipe et des partenaires inclut des marques mondiales et des partenaires. Les noms de marque sont mentionnes a titre indicatif uniquement et n'impliquent aucune approbation sauf mention explicite.",
    rights: "Tous droits reserves.",
  },
  ui: {
    bookCallLabel: "Reserver un appel",
    exploreService: "Decouvrir le service",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    auditPreview: "Apercu de l'audit",
    reportFormat: "Format du rapport",
    auditIncludes: "L'audit comprend",
    module: "Module",
    outcome: "Resultat",
    languageLabel: "Langue",
    home: "Accueil",
    services: "Services",
    recommendedFirstStep: "Premiere etape recommandee",
  },
};
