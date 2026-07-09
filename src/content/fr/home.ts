/**
 * French homepage content — fully localized including deep arrays.
 * Marketing-native French for B2B SEO/agency buyers.
 */

import type { HomeContent } from "../home.types";
import { buildClientLogoProofAssets } from "../home-proof-assets";

const clientLogoProof = buildClientLogoProofAssets({
  hrefPrefix: "/fr",
  alt: (clientName) => `Visuel de preuve de l'etude de cas verifiee ${clientName}`,
});

const searchSurfaces: HomeContent["searchHasChanged"]["surfaces"] = [
  {
    id: "google-organic",
    label: "Google organique",
    shortLabel: "Google",
    ariaLabel: "Explorer la visibilite organique sur Google",
    buyersSee: "Pages classees, extraits, entites et fonctionnalites SERP qui creent la premiere impression.",
    taskcoverImproves: "Acces technique, cartographie d'intention, structure de contenu et signaux d'autorite.",
    growthSupport: "Fait croitre la visibilite non-marque qualifiee et oriente la demande vers les pages de conversion.",
    angle: 0,
  },
  {
    id: "ai-overviews",
    label: "AI Overviews",
    shortLabel: "IA",
    ariaLabel: "Explorer la visibilite dans les reponses AI Overviews",
    buyersSee: "Blocs de reponse synthetiques et sources citees avant le clic.",
    taskcoverImproves: "Sections pretes pour les reponses, preuves structurees, clarte d'entite et sources citables.",
    growthSupport: "Aide la marque a etre prise en compte lorsque l'IA resume les options.",
    angle: 40,
  },
  {
    id: "llms",
    label: "ChatGPT et LLM",
    shortLabel: "LLM",
    ariaLabel: "Explorer la visibilite dans ChatGPT et les LLM",
    buyersSee: "Recommandations generees, comparaisons et syntheses appuyees par des sources.",
    taskcoverImproves: "Coherence d'entite, actifs de reponse reutilisables, qualite des sources et autorite thematique.",
    growthSupport: "Soutient la decouverte assistee avant le retour vers Google ou vers le site.",
    angle: 80,
  },
  {
    id: "local",
    label: "Resultats locaux",
    shortLabel: "Local",
    ariaLabel: "Explorer la recherche locale et les cartes",
    buyersSee: "Maps, local packs, avis, pages locales et signaux de zone de service.",
    taskcoverImproves: "Architecture locale, completude des profils, themes d'avis et pertinence locale.",
    growthSupport: "Transforme la demande locale a forte intention en appels, formulaires et visites qualifiees.",
    angle: 120,
  },
  {
    id: "reviews",
    label: "Plateformes d'avis",
    shortLabel: "Avis",
    ariaLabel: "Explorer les signaux de confiance des avis",
    buyersSee: "Notes, themes d'avis, sentiment tiers et points de friction de confiance.",
    taskcoverImproves: "Cartographie des signaux d'avis, alignement du contenu et reassurance sur les parcours.",
    growthSupport: "Reduit l'hesitation lorsque les acheteurs comparent les prestataires.",
    angle: 160,
  },
  {
    id: "youtube",
    label: "YouTube",
    shortLabel: "Video",
    ariaLabel: "Explorer YouTube et la recherche video",
    buyersSee: "Explications, avis, demonstrations et videos de reponse dans le parcours de recherche.",
    taskcoverImproves: "Choix des sujets video, integration page, structure de transcription et contenu de soutien.",
    growthSupport: "Ajoute une preuve plus riche pour les acheteurs qui veulent voir l'expertise.",
    angle: 200,
  },
  {
    id: "forums",
    label: "Reddit et forums",
    shortLabel: "Forums",
    ariaLabel: "Explorer Reddit et les forums dans la demande search",
    buyersSee: "Questions de pairs, objections, comparaisons et langage d'achat non filtre.",
    taskcoverImproves: "Extraction des questions, couverture des objections, reponses sourcees et briefs de contenu.",
    growthSupport: "Injecte le langage reel des acheteurs dans les pages qui classent, citent et convertissent.",
    angle: 240,
  },
  {
    id: "publications",
    label: "Publications",
    shortLabel: "Presse",
    ariaLabel: "Explorer les publications et signaux d'autorite",
    buyersSee: "Mentions editoriales, commentaires experts, citations et contexte tiers fiable.",
    taskcoverImproves: "Cibles RP numeriques, actifs de source experte, hygiene de preuve et routage d'autorite.",
    growthSupport: "Construit la couche de confiance qui aide moteurs et acheteurs a croire la marque.",
    angle: 280,
  },
  {
    id: "landing-pages",
    label: "Pages de conversion",
    shortLabel: "Pages",
    ariaLabel: "Explorer les parcours de conversion des pages",
    buyersSee: "Pages commerciales, modules de preuve, formulaires, CTA et prochaine etape claire.",
    taskcoverImproves: "Intention de page, placement de preuve, routage CTA et parcours mesurables.",
    growthSupport: "Transforme la visibilite en pipeline au lieu de laisser la demande sans conversion.",
    angle: 320,
  },
];

export const home: HomeContent = {
  hero: {
    eyebrow: "Agence de croissance par la recherche",
    headline: "SEO conçu pour Google, la recherche IA et la croissance du chiffre d'affaires.",
    subheadline:
      "Taskcover Agency aide les marques aux États-Unis, au Canada et en Australie à développer leur visibilité organique, à bâtir leur autorité et à convertir la demande de recherche à forte intention en résultats commerciaux mesurables.",
    proofLine:
      "Consultez des études de cas de croissance search vérifiées dans l'éducation, le voyage, le SaaS, l'eCommerce, l'hôtellerie, l'assurance et les marques multi-marchés.",
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
    secondaryCta: { label: "Découvrir notre système", href: "/methodology" },
  },
  dashboard: {
    title: "Cockpit de croissance search",
    subtitle:
      "Google, recherche IA, autorité de contenu, santé technique et priorités de conversion dans une seule vue opérationnelle.",
    disclosure:
      "Aperçu de cockpit illustratif. Les données clients vérifiées sont ajoutées uniquement avec autorisation.",
    signals: [
      {
        label: "Demande search",
        value: "240K",
        delta: "+18 %",
        status: "En expansion",
        icon: "search",
        tone: "teal",
      },
      {
        label: "Visibilité organique",
        value: "90 %",
        delta: "+22 pts",
        status: "En cumul",
        icon: "trend",
        tone: "emerald",
      },
      {
        label: "Couverture de citations IA",
        value: "64 %",
        delta: "+31 pts",
        status: "Construction active",
        icon: "sparkles",
        tone: "blue",
      },
      {
        label: "Santé technique",
        value: "98 %",
        delta: "+6 pts",
        status: "Protégée",
        icon: "gauge",
        tone: "green",
      },
    ],
    opportunityTitle: "Carte des opportunités",
    opportunitySubtitle: "Écarts prioritaires par demande, autorité et levier de conversion.",
    opportunities: [
      { label: "Optimisation recherche IA", intent: "Surface de réponse", value: "Fort", x: 18, y: 38 },
      { label: "Audit SEO technique", intent: "Fondation", value: "Urgent", x: 48, y: 24 },
      { label: "SEO international", intent: "Expansion marché", value: "Scale", x: 72, y: 48 },
      { label: "Autorité de contenu", intent: "Couverture thématique", value: "Construire", x: 34, y: 68 },
      { label: "Intelligence PPC search", intent: "Capture de demande", value: "Combiné", x: 82, y: 72 },
    ],
    entityTitle: "Couverture entité et citations",
    entitySubtitle: "Signaux de qualité source qui aident Google et les systèmes IA à faire confiance à la marque.",
    entityRows: [
      { label: "Clarté de l'entité marque", value: "Forte", status: "Schema + sources alignés" },
      { label: "Pages prêtes aux citations", value: "34", status: "Sections expertes cartographiées" },
      { label: "Écarts de sources de confiance", value: "7", status: "File RP éditoriale" },
    ],
    queueTitle: "File du prochain sprint",
    queueSubtitle: "Corrections priorisées avant l'expansion de la production de contenu.",
    queueRows: [
      { task: "Corriger les pièges de crawl et la dérive canonique", impact: "Fort", effort: "Moyen", status: "Technique" },
      { task: "Publier des blocs FAQ prêts pour l'IA", impact: "Fort", effort: "Faible", status: "Contenu" },
      { task: "Router les CTA d'audit par intention acheteur", impact: "Moyen", effort: "Faible", status: "Conversion" },
    ],
    pathTitle: "Parcours de conversion",
    pathSteps: ["Demande d'audit", "Revue diagnostique", "Feuille de route 90 jours", "Décision sprint"],
    labels: {
      impact: "Impact",
      effort: "Effort",
      value: "Valeur",
    },
  },
  heroVideo: {
    eyebrow: "Introduction du porte-parole",
    title: "Un module vidéo prêt pour présenter le système Taskcover.",
    caption:
      "Une courte introduction à la façon dont Taskcover aborde le SEO, la recherche IA et la croissance du chiffre d'affaires.",
    playLabel: "Lire la vidéo d'introduction",
    unavailableLabel: "Vidéo en attente d'upload",
    fallbackTitle: "La vidéo porte-parole est prête à être ajoutée",
    fallbackBody:
      "La carte est configurée pour une future vidéo d'introduction Taskcover. Aucune vidéo fictive ou stock n'est chargée.",
    trustChips: ["Cas vérifiés", "SEO + recherche IA + PPC", "USA · Canada · Australie"],
  },
  searchHasChanged: {
    eyebrow: "La recherche a changé",
    title: "La recherche ne se résume plus aux liens bleus de Google.",
    description:
      "La demande de recherche moderne est fragmentée entre Google, les AI Overviews, ChatGPT et les LLM, les résultats locaux, les plateformes d'avis, YouTube, Reddit et les forums, ainsi que les publications spécialisées. Gagner, c'est être visible et digne de confiance partout où les acheteurs cherchent.",
    message:
      "Nous ne séparons pas le SEO, le GEO, l'AEO, le contenu et l'autorité. Nous les relions en un seul système de croissance par la recherche.",
    surfaces: searchSurfaces,
    labels: {
      desktopGuidance: "Survolez ou cliquez une surface pour explorer",
      mobileGuidance: "Touchez chaque signal pour voir la connexion",
      startHere: "Commencez ici",
      defaultTitle: "Neuf surfaces. Un seul système de croissance search.",
      defaultBody:
        "Choisissez un noeud pour voir comment les acheteurs découvrent, valident et agissent avant de devenir un prospect.",
      buyersSee: "Ce que voient les acheteurs",
      taskcoverImproves: "Ce que Taskcover améliore",
      growthSupport: "Comment cela soutient la croissance",
    },
  },
  operatingSystem: {
    eyebrow: "Système d'exploitation de recherche Taskcover",
    title: "Un système connecté sur l'ensemble du parcours de recherche.",
    description:
      "Chaque étape alimente la suivante, afin que la visibilité, l'autorité et la conversion se renforcent au lieu de rester dans des livrables déconnectés. Les rapports remontent vers la stratégie pour que le système s'améliore en continu.",
    steps: [
      {
        label: "Audit",
        description: "Référence technique, contenu, autorité et recherche IA.",
        input: "Données de crawl, analytics, instantanés SERP et signaux concurrentiels.",
        action: "Cartographier la santé technique, les écarts de contenu, d'autorité et la préparation IA.",
        output: "Référence priorisée avec les opportunités à fort impact identifiées.",
      },
      {
        label: "Stratégie",
        description: "Des priorités rattachées au chiffre d'affaires, pas aux classements de vanité.",
        input: "Constats d'audit, modèle de revenus et données d'intention d'achat.",
        action: "Construire une carte d'opportunités liée au pipeline et aux résultats commerciaux.",
        output: "Une feuille de route priorisée sur 90 jours avec des responsabilités claires.",
      },
      {
        label: "SEO technique",
        description: "Crawl, indexation, Core Web Vitals et structure.",
        input: "Fichiers journaux, audits de rendu et rapports d'indexation.",
        action: "Corriger le gaspillage de crawl, améliorer la structure et renforcer les signaux de confiance.",
        output: "Un site rapide, explorable et indexable, que Google et l'IA peuvent créditer.",
      },
      {
        label: "Autorité de contenu",
        description: "Clusters thématiques pilotés par des experts, liés à l'intention d'achat.",
        input: "Carte d'intention et analyse des écarts face aux concurrents.",
        action: "Construire des clusters pilotés par des experts qui capturent et convertissent la demande.",
        output: "Un système de contenu cumulatif lié à l'intention de revenus.",
      },
      {
        label: "Préparation à la recherche IA",
        description: "Données structurées, citations et actifs optimisés pour les réponses.",
        input: "Modèle d'entités, audit de schéma et revue des formats de réponse.",
        action: "Optimiser pour les AI Overviews, ChatGPT et les citations LLM.",
        output: "Des actifs prêts à répondre que les surfaces IA peuvent trouver et citer.",
      },
      {
        label: "RP numériques",
        description: "Signaux d'autorité issus de publications et de partenaires réels.",
        input: "Référence d'autorité et liste de cibles pertinentes.",
        action: "Mener de la sensibilisation basée sur les données et de la couverture relationnelle.",
        output: "Signaux d'autorité et de référence de confiance (liens ajoutés une fois confirmés).",
      },
      {
        label: "CRO",
        description: "Convertir le trafic à forte intention en pipeline et en chiffre d'affaires.",
        input: "Analytique d'entonnoir, heatmaps et parcours de conversion.",
        action: "Supprimer les frictions et renforcer les appels à l'action sur les pages clés.",
        output: "Une conversion plus élevée sur la demande de recherche qualifiée.",
      },
      {
        label: "Rapports",
        description: "Des tableaux de bord axés sur l'impact commercial, pas seulement sur le trafic.",
        input: "Données de performance sur Google, l'IA et l'attribution des revenus.",
        action: "Traduire les signaux en décisions et en plan du prochain sprint.",
        output: "Une revue claire qui renvoie les enseignements vers la stratégie.",
      },
    ],
  },
  growthPlays: {
    eyebrow: "Playbook de croissance par la recherche",
    title: "Des tactiques reproductibles, pas des campagnes isolées.",
    description:
      "Chaque tactique décrit le défi que nous abordons, la stratégie que nous appliquons et le résultat que nous produisons — rattaché au système d'exploitation de recherche Taskcover.",
    featured: {
      title: "Tactique SEO voyage mondial",
      tag: "Voyage",
      challenge:
        "Demande de voyage très concurrentielle sur plusieurs marchés, langues et surfaces d'agrégateurs.",
      strategy:
        "Architecture SEO internationale, clusters de destinations pilotés par l'intention et RP numériques pour l'autorité de destination.",
      output:
        "Priorisation claire des marchés, carte de demande de réservation directe et feuille de route de contenu axée sur l'autorité.",
      systemStages: ["Audit", "SEO technique", "Autorité de contenu", "RP numériques"],
      cta: { label: "Voir la tactique", href: "/work/case-studies" },
    },
    plays: [
      {
        title: "Confiance éducation et institutionnelle",
        tag: "Éducation",
        challenge: "Bâtir la crédibilité pour les publics éducatifs et institutionnels.",
        strategy:
          "Contenu piloté par des experts, données de programmes structurées et RP via des publications de confiance.",
        output: "Système de contenu axé confiance et plan de couverture d'autorité.",
        systemStages: ["Stratégie", "Autorité de contenu", "RP numériques"],
        cta: { label: "Voir la tactique", href: "/work/case-studies" },
      },
      {
        title: "Récupération SEO technique",
        tag: "Récupération technique",
        challenge:
          "Perte soudaine de visibilité due à des migrations, des problèmes d'indexation ou des mises à jour cœur.",
        strategy:
          "Analyse de crawl et de journaux, réparation de l'indexation et retours arrière structurés.",
        output: "Feuille de route de récupération avec corrections techniques priorisées.",
        systemStages: ["Audit", "SEO technique", "Rapports"],
        cta: { label: "Voir la tactique", href: "/services/technical-seo" },
      },
      {
        title: "Visibilité dans la recherche IA",
        tag: "Recherche IA",
        challenge: "Absent des AI Overviews, de ChatGPT et des réponses LLM.",
        strategy:
          "Contenu optimisé pour les réponses, données structurées et autorité digne de citation.",
        output: "Évaluation de la préparation IA et plan d'actifs optimisés pour les réponses.",
        systemStages: ["Préparation à la recherche IA", "Autorité de contenu"],
        cta: { label: "Voir la tactique", href: "/services/ai-search-optimization" },
      },
      {
        title: "RP numériques et autorité",
        tag: "RP numériques",
        challenge: "Autorité de domaine faible et signaux de référence de confiance faibles.",
        strategy:
          "Récits basés sur les données et sensibilisation relationnelle vers des publications pertinentes.",
        output: "Pipeline de couverture éditoriale (liens ajoutés une fois confirmés).",
        systemStages: ["RP numériques", "Autorité de contenu"],
        cta: { label: "Voir la tactique", href: "/services/digital-pr-link-building" },
      },
    ],
  },
  servicesBento: {
    eyebrow: "Services",
    title: "Chaque service rattaché à un résultat commercial.",
    description:
      "Aucun livrable isolé. Chaque compétence s'intègre au système de croissance par la recherche et se mesure en fonction du chiffre d'affaires et de l'impact sur le pipeline.",
    featureCard: {
      title: "Stratégie SEO",
      outcome: "Une feuille de route priorisée liée au chiffre d'affaires, pas aux classements de vanité.",
      href: "/services/seo-agency",
      roadmap: [
        { phase: "Diagnostiquer", detail: "Référence technique, contenu, autorité et IA." },
        { phase: "Prioriser", detail: "Opportunités classées par impact sur le chiffre d'affaires." },
        { phase: "Séquencer", detail: "Sprints de 90 jours avec des responsabilités claires." },
        { phase: "Cumuler", detail: "Autorité et visibilité qui se renforcent dans le temps." },
      ],
      chips: [
        "Cartographie d'intention",
        "Attribution des revenus",
        "Feuille de route 90 jours",
        "Re-planification trimestrielle",
      ],
      outcomePreview:
        "Une feuille de route de croissance par la recherche prête à la décision, que votre équipe peut exécuter avec confiance.",
    },
    cards: [
      {
        title: "SEO technique",
        outcome: "Un site rapide, explorable et indexable, que Google et l'IA peuvent créditer.",
        href: "/services/technical-seo",
        icon: "technical",
        span: "default",
        visual: "crawl",
      },
      {
        title: "Optimisation pour la recherche IA",
        outcome: "Visibilité dans les AI Overviews, ChatGPT et les réponses LLM.",
        href: "/services/ai-search-optimization",
        icon: "ai",
        span: "default",
        visual: "citation",
      },
      {
        title: "Marketing de contenu",
        outcome: "Clusters de contenu pilotés par des experts qui capturent et convertissent l'intention.",
        href: "/services/content-marketing",
        icon: "content",
        span: "wide",
        visual: "cluster",
      },
      {
        title: "Développement de site web",
        outcome: "Sites prêts pour la recherche, construits pour la visibilité, la confiance et les leads.",
        href: "/services/website-development",
        icon: "website",
        span: "wide",
        visual: "website",
      },
      {
        title: "RP numériques et création de liens",
        outcome: "Signaux d'autorité issus de publications et de partenaires réels.",
        href: "/services/digital-pr-link-building",
        icon: "pr",
        span: "default",
        visual: "authority",
      },
      {
        title: "SEO local",
        outcome: "Gagnez le pack local, les cartes et les surfaces d'avis.",
        href: "/services/local-seo",
        icon: "local",
        span: "default",
        visual: "pins",
      },
      {
        title: "SEO e-commerce",
        outcome: "Visibilité des catégories et produits qui génère du chiffre d'affaires.",
        href: "/services/ecommerce-seo",
        icon: "ecommerce",
        span: "default",
        visual: "products",
      },
      {
        title: "SEO international",
        outcome: "Un système adapté à chaque marché sans contenu dupliqué.",
        href: "/services/international-seo",
        icon: "international",
        span: "default",
        visual: "globe",
      },
      {
        title: "Analytique et rapports",
        outcome: "Des tableaux de bord axés sur l'impact commercial, pas seulement sur le trafic.",
        href: "/services/seo-audit",
        icon: "analytics",
        span: "wide",
        visual: "dashboard",
      },
      {
        title: "Gestion PPC",
        outcome: "Capture de demande sur la recherche payante, alignée avec la croissance organique.",
        href: "/services/ppc-management",
        icon: "ppc",
        span: "default",
        visual: "ppc",
      },
      {
        title: "Service de mentorat SEO",
        outcome: "Coaching stratégique 1:1, conseil aux fondateurs et formation d'équipe.",
        href: "/services/seo-mentor-service",
        icon: "mentor",
        span: "default",
        visual: "mentor",
      },
    ],
  },
  industries: {
    eyebrow: "Industries",
    title: "Conçu pour les industries où la recherche génère du chiffre d'affaires.",
    description:
      "Chaque secteur a des schémas d'intention, des concurrents et des signaux de confiance différents. Nous adaptons le système en conséquence.",
    cards: [
      {
        title: "SEO voyage et hôtellerie",
        short: "Voyage",
        pain: "Fuites importantes de l'entonnoir vers les OTA et les agrégateurs.",
        opportunity: "Capturer la demande de réservation directe et l'autorité de destination.",
        solution: "Systèmes de contenu de destination et de propriété pilotés par l'intention.",
        intentPattern: "Demande axée sur les destinations, propriétés et comparaisons.",
        trustSignals: "Avis, couverture éditoriale et autorité de destination.",
        recommendedServices: ["SEO technique", "Autorité de contenu", "RP numériques"],
        href: "/industries/travel-seo",
      },
      {
        title: "SEO éducation et institutionnel",
        short: "Éducation",
        pain: "Cycles de réflexion longs et décisions fortement axées sur la confiance.",
        opportunity: "Posséder l'intention de programme, de résultat et de comparaison.",
        solution: "Clusters de contenu pilotés par des experts et données de programmes structurées.",
        intentPattern: "Parcours de recherche axés sur les programmes, résultats et comparaisons.",
        trustSignals: "Accréditations, résultats et commentaires d'experts.",
        recommendedServices: ["Stratégie SEO", "Autorité de contenu", "Préparation à la recherche IA"],
        href: "/industries/education-seo",
      },
      {
        title: "SEO santé et bien-être",
        short: "Santé",
        pain: "Exigences strictes de confiance et de conformité.",
        opportunity: "Gagner la visibilité sur l'intention de condition, traitement et prestataire.",
        solution: "Contenu axé E-E-A-T et citations faisant autorité.",
        intentPattern: "Demande axée sur les conditions, traitements et prestataires.",
        trustSignals: "Autorité clinique, citations et signaux E-E-A-T.",
        recommendedServices: ["SEO technique", "Autorité de contenu", "RP numériques"],
        href: "/industries/healthcare-seo",
      },
      {
        title: "SEO juridique et immigration",
        short: "Juridique",
        pain: "Demande à enjeux élevés, à forte intention et axée sur la réputation.",
        opportunity: "Convertir l'intention de type de dossier et de juridiction.",
        solution: "Contenu axé confiance, avis et autorité locale.",
        intentPattern: "Demande de type de dossier, juridiction et intention urgente.",
        trustSignals: "Avis, titres du barreau et autorité locale.",
        recommendedServices: ["SEO local", "Autorité de contenu", "RP numériques"],
        href: "/industries/legal-immigration-seo",
      },
      {
        title: "SEO SaaS et technologie",
        short: "SaaS",
        pain: "Termes de catégorie saturés et acheteurs axés sur la comparaison.",
        opportunity: "Posséder l'intention de catégorie, d'alternative et d'intégration.",
        solution: "Contenu de comparaison, SEO d'intégrations et pages product-led.",
        intentPattern: "Recherche axée sur la catégorie, les alternatives et les intégrations.",
        trustSignals: "Preuves produit, intégrations et avis d'experts.",
        recommendedServices: ["Stratégie SEO", "Autorité de contenu", "Préparation à la recherche IA"],
        href: "/industries/saas-seo",
      },
      {
        title: "SEO e-commerce",
        short: "e-commerce",
        pain: "Concurrence sur les pages de catégorie et de produit.",
        opportunity: "Visibilité de catégorie et de produit axée sur le chiffre d'affaires.",
        solution: "SEO technique pour le commerce et données produits structurées.",
        intentPattern: "Demande de catégorie, produit et transactionnelle.",
        trustSignals: "Avis, données structurées et confiance de fulfillment.",
        recommendedServices: ["SEO technique", "CRO", "Analytique et rapports"],
        href: "/industries/ecommerce-seo",
      },
      {
        title: "SEO franchise et multi-sites",
        short: "Franchise",
        pain: "Visibilité locale incohérente entre les sites.",
        opportunity: "Gagner le pack local et les cartes de chaque site.",
        solution: "SEO local à grande échelle avec architecture d'autorité de localisation.",
        intentPattern: "Demande « près de chez moi » et spécifique à un lieu.",
        trustSignals: "Avis par localisation et données commerciales cohérentes.",
        recommendedServices: ["SEO local", "SEO technique", "Autorité de contenu"],
        href: "/industries/franchise-local-seo",
      },
    ],
  },
  markets: {
    eyebrow: "Marchés",
    title: "Contexte local pour les États-Unis, le Canada et l'Australie.",
    description:
      "Chaque marché a son propre comportement de recherche, ses concurrents et ses signaux de confiance. Nous ne dupliquons pas le contenu entre les régions.",
    cards: [
      {
        title: "Agence SEO États-Unis",
        region: "États-Unis",
        context:
          "SERP nationaux et locaux hyper concurrentiels dans les 50 États, avec une forte adoption des réponses IA et des signaux de confiance basés sur les avis.",
        href: "/markets/usa-seo-agency",
        highlights: [
          "Priorisation nationale et locale des marchés",
          "Stratégie de surfaces d'avis et de réponses IA",
          "Considérations de conformité multi-États",
        ],
        differentiator: "Échelle et adoption des réponses IA",
        mapDots: [
          { x: 25, y: 40 },
          { x: 50, y: 55 },
          { x: 75, y: 35 },
        ],
      },
      {
        title: "Agence SEO Canada",
        region: "Canada",
        context:
          "Schémas de demande bilingues et régionaux, avec un fort comportement de pack local et des dynamiques de marché provincial distinctes. Prise en charge complète du site prévue pour l'anglais, le français et l'espagnol.",
        href: "/markets/canada-seo-agency",
        highlights: [
          "Cartographie de la demande anglaise et française (Québec)",
          "Priorisation provinciale et métropolitaine",
          "Contenu bilingue et optimisation du pack local",
        ],
        differentiator: "Contexte bilingue EN/FR",
        mapDots: [
          { x: 30, y: 30 },
          { x: 55, y: 45 },
          { x: 70, y: 25 },
        ],
      },
      {
        title: "Agence SEO Australie",
        region: "Australie",
        context:
          "Demande métropolitaine concentrée, forte intention locale et forte sensibilité aux avis dans les capitales et les hubs régionaux.",
        href: "/markets/australia-seo-agency",
        highlights: [
          "Cartographie des marchés des capitales et régionaux",
          "Focus sur le pack local et la réputation des avis",
          "Préparation à l'expansion trans-Tasman et APAC",
        ],
        differentiator: "Demande métropolitaine concentrée",
        mapDots: [
          { x: 40, y: 55 },
          { x: 60, y: 40 },
          { x: 75, y: 65 },
        ],
      },
    ],
  },
  methodology: {
    eyebrow: "Méthodologie",
    title: "Le processus de croissance SEO en 90 jours de Taskcover.",
    description:
      "Un rythme reproductible qui fait fructifier la visibilité, l'autorité et la conversion sans devenir une boîte noire.",
    phases: [
      {
        phase: "Jours 1–30",
        label: "Diagnostiquer et cartographier",
        detail:
          "Référence de la santé technique, du contenu, de l'autorité et de la préparation IA. Cartographier les opportunités par rapport au chiffre d'affaires.",
        steps: ["Découverte", "Audit de croissance SEO", "Carte des opportunités"],
      },
      {
        phase: "Jours 31–60",
        label: "Construire et corriger",
        detail:
          "Exécuter les corrections techniques et construire des clusters de contenu pilotés par des experts liés à l'intention d'achat.",
        steps: ["Sprint de 90 jours", "Construction de contenu et d'autorité"],
      },
      {
        phase: "Jours 61–90",
        label: "Autorité et conversion",
        detail:
          "Cumuler l'autorité avec les RP numériques et convertir la demande qualifiée via la CRO et des rapports clairs.",
        steps: ["RP numériques", "CRO", "Revue mensuelle de l'intelligence de recherche"],
      },
    ],
  },
  technology: {
    eyebrow: "Couche d'intelligence de recherche",
    title: "Une couche technologique qui transforme les données de recherche en décisions.",
    description:
      "Nous connectons l'analyse de crawl, la cartographie d'intention, le suivi de la visibilité IA et les rapports afin que la stratégie soit toujours fondée sur des preuves.",
    modules: [
      {
        id: "technical",
        title: "Analyse de crawl technique",
        detail:
          "Les audits de crawl sensibles au rendu, l'analyse des journaux et le suivi de l'indexation révèlent les problèmes structurels avant qu'ils ne coûtent en visibilité.",
        capabilities: [
          "Crawl sensible au rendu sur les pages lourdes en JS",
          "Analyse des fichiers journaux pour le gaspillage de budget de crawl",
          "Couverture d'indexation et santé canonique",
        ],
        monitors: "Erreurs de crawl, URL orphelines, chaînes de redirection et régressions des Core Web Vitals.",
        decision: "Prioriser les corrections techniques qui déverrouillent la visibilité avant l'investissement de contenu.",
        visual: "crawl-health",
      },
      {
        id: "intent",
        title: "Cartographie des mots-clés et de l'intention",
        detail:
          "Demande cartographiée par étape d'intention et liée au chiffre d'affaires afin que le contenu cible les acheteurs qualifiés, pas le volume de vanité.",
        capabilities: [
          "Classification d'intention (commerciale, informationnelle, transactionnelle)",
          "Notation de la demande pondérée par le chiffre d'affaires",
          "Cartographie par étape d'entonnoir et par cluster thématique",
        ],
        monitors: "Évolutions d'intention, signaux de cannibalisation et santé du regroupement de mots-clés.",
        decision: "Orienter la production de contenu vers la demande qui convertit, pas le volume de vanité.",
        visual: "intent-matrix",
      },
      {
        id: "ai",
        title: "Suivi de la visibilité IA",
        detail:
          "Surveillance des AI Overviews et des réponses LLM pour voir où votre marque est citée — et où les concurrents gagnent.",
        capabilities: [
          "Suivi de la surface de citation des AI Overviews",
          "Surveillance des mentions dans les réponses LLM",
          "Comparaison des mentions IA des concurrents",
        ],
        monitors: "Présence de citation, couverture des réponses et part de voix IA des concurrents.",
        decision: "Allouer l'investissement de préparation IA là où les écarts de citation sont les plus importants.",
        visual: "ai-coverage",
      },
      {
        id: "content",
        title: "Modélisation des écarts de contenu",
        detail:
          "Analyse de clusters et d'écarts face aux concurrents pour prioriser le contenu qui cumule l'autorité.",
        capabilities: [
          "Analyse de la couverture des clusters thématiques",
          "Identification des écarts de contenu concurrentiels",
          "Notation du potentiel d'autorité par sujet",
        ],
        monitors: "Santé des clusters, signaux de déclin du contenu et force du maillage interne.",
        decision: "Séquencer la production de contenu par potentiel d'autorité et de chiffre d'affaires.",
        visual: "cluster-coverage",
      },
      {
        id: "serp",
        title: "Analyse SERP des concurrents",
        detail:
          "Suivi des fonctionnalités SERP et du partage des concurrents pour comprendre les surfaces qui génèrent réellement la demande.",
        capabilities: [
          "Suivi du partage des fonctionnalités SERP",
          "Analyse comparative de la visibilité des concurrents",
          "Cartographie des opportunités par surface",
        ],
        monitors: "Instabilité des fonctionnalités, mouvements des concurrents et adoption de nouvelles surfaces.",
        decision: "Choisir les surfaces SERP à cibler pour une capture de demande maximale.",
        visual: "serp-comparison",
      },
      {
        id: "reporting",
        title: "Tableaux de bord de rapports",
        detail:
          "Rapports axés sur l'impact commercial qui connectent la performance de recherche au pipeline et au chiffre d'affaires.",
        capabilities: [
          "Unification des KPI de visibilité, confiance et chiffre d'affaires",
          "Modélisation d'attribution sur le parcours de recherche",
          "Format de revue mensuelle prêt pour la direction",
        ],
        monitors: "Direction des tendances, rythme des objectifs et indicateurs avancés de croissance.",
        decision: "Traduire la performance de recherche en décisions commerciales au niveau du conseil.",
        visual: "kpi-dashboard",
      },
      {
        id: "conversion",
        title: "Suivi des conversions",
        detail:
          "Analyse de l'entonnoir et des parcours de conversion pour transformer la demande de recherche qualifiée en prospects et clients.",
        capabilities: [
          "Analyse des parcours de conversion multi-touch",
          "Détection des frictions sur les pages d'atterrissage",
          "Priorisation des opportunités de CRO",
        ],
        monitors: "Points de décrochage de l'entonnoir, abandon de formulaire et efficacité des CTA.",
        decision: "Corriger les fuites de conversion avant d'investir dans plus d'acquisition de trafic.",
        visual: "funnel-chart",
      },
      {
        id: "authority",
        title: "Surveillance de l'autorité",
        detail:
          "Suivi des références, citations et signaux d'autorité pour mesurer l'effet cumulatif des RP numériques.",
        capabilities: [
          "Suivi des références et mentions",
          "Surveillance des tendances d'autorité de domaine",
          "Présence des citations dans les sources de confiance",
        ],
        monitors: "Vélocité des liens, qualité des mentions et élan des signaux d'autorité.",
        decision: "Orienter les RP numériques vers les publications qui font le plus avancer l'autorité.",
        visual: "mention-graph",
      },
    ],
  },
  mediaCommentary: {
    eyebrow: "Médias et commentaires d'experts",
    title: "Signaux d'autorité dans l'intelligence de recherche.",
    description:
      "Nous fournissons des commentaires d'experts sur l'intelligence de recherche, la recherche IA, la stratégie SEO et les RP numériques — sans fabriquer de publications ou de couverture.",
    categories: [
      {
        label: "Commentaires sur l'intelligence de recherche",
        detail:
          "Perspective sur les évolutions d'algorithme, les fonctionnalités SERP et les tendances de visibilité organique.",
      },
      {
        label: "Perspective sur la recherche IA",
        detail:
          "Analyse des AI Overviews, des réponses LLM et de la façon dont les marques peuvent obtenir des citations.",
      },
      {
        label: "Analyse de stratégie SEO",
        detail:
          "Commentaires sur la conception de feuilles de route, la cartographie d'intention et les programmes de recherche axés sur le chiffre d'affaires.",
      },
      {
        label: "RP numériques et autorité",
        detail:
          "Aperçu des signaux d'autorité, de la couverture éditoriale et de la construction de la confiance de marque.",
      },
    ],
  },
  videoProof: {
    eyebrow: "La confiance enregistrée",
    title: "Un cadre de preuve conçu pour les actifs autorisés.",
    description:
      "Nous ne fabriquons pas de témoignages ou de vidéos. Ce cadre est prêt pour les introductions de porte-parole, les clips de revue client et les études de cas guidées lorsque les actifs sont autorisés.",
    slots: [
      {
        label: "Introduction du porte-parole",
        detail: "Qui dirige le travail et pourquoi le système fonctionne.",
      },
      {
        label: "Clip de revue client",
        detail: "Un client explique ce qui a changé et pourquoi c'était important.",
      },
      {
        label: "Étude de cas guidée",
        detail: "Une visite guidée d'un engagement de croissance par la recherche.",
      },
    ],
  },
  comparison: {
    eyebrow: "Pourquoi Taskcover",
    title: "Prestataire SEO traditionnel vs Taskcover Agency.",
    description: "Même budget, système très différent. Voici où les approches divergent.",
    rows: [
      {
        dimension: "Modèle d'engagement",
        traditional: "Liste de tâches mensuelles avec une priorité commerciale peu claire.",
        taskcover:
          "Un système de croissance par la recherche priorisé, lié à la visibilité, la confiance et le chiffre d'affaires.",
      },
      {
        dimension: "Mesure du succès",
        traditional: "Classements rapportés isolément des résultats commerciaux.",
        taskcover:
          "Visibilité, confiance, demande qualifiée et signaux de chiffre d'affaires suivis ensemble.",
      },
      {
        dimension: "Stratégie de contenu",
        traditional: "Articles de blog génériques déconnectés de l'intention d'achat.",
        taskcover: "Clusters de contenu pilotés par des experts, liés à l'intention et au chiffre d'affaires.",
      },
      {
        dimension: "Rapports",
        traditional: "Un rapport de trafic avec peu de lien avec le pipeline.",
        taskcover:
          "Tableaux de bord axés sur l'impact commercial sur Google, la recherche IA et l'attribution.",
      },
      {
        dimension: "Recherche IA",
        traditional: "Traite la recherche IA comme hors de portée ou l'ignore.",
        taskcover: "Préparation Google et recherche IA intégrée dans chaque engagement.",
      },
      {
        dimension: "Transparence de l'exécution",
        traditional: "Exécution en boîte noire avec une visibilité limitée sur les priorités.",
        taskcover: "Une feuille de route transparente et priorisée avec des responsabilités claires.",
      },
      {
        dimension: "Signaux d'autorité",
        traditional: "Tactiques de liens de faible qualité ou axées sur le volume.",
        taskcover:
          "RP numériques relationnelles avec de vraies publications et de vrais partenaires.",
      },
      {
        dimension: "Conversion / qualité des prospects",
        traditional: "Volume de trafic privilégié sur la demande qualifiée.",
        taskcover:
          "Focus CRO sur la conversion de la demande de recherche à forte intention en pipeline.",
      },
      {
        dimension: "Feuille de route stratégique",
        traditional: "Listes de tâches réactives, mois après mois.",
        taskcover: "Une feuille de route de 90 jours qui se cumule et se re-planifie chaque trimestre.",
      },
    ],
  },
  brandExperience: {
    caption:
      "Études de cas vérifiées dans l'éducation, l'hôtellerie, le voyage, le logiciel, l'assurance et la croissance search multi-marchés.",
    logos: clientLogoProof,
    cta: { label: "Voir les études de cas", href: "/fr/work/case-studies" },
  },
  audit: {
    eyebrow: "Audit de croissance SEO gratuit",
    title: "Voyez exactement où votre croissance par la recherche fuit.",
    description:
      "Un aperçu clair et hiérarchisé de votre santé technique, de l'autorité de votre contenu, de votre préparation à l'IA et de votre écart concurrentiel — avec une feuille de route sur 90 jours.",
    checklist: [
      "Aperçu SEO technique",
      "Carte des opportunités de mots-clés",
      "Écart de visibilité concurrentiel",
      "Écart d'autorité de contenu",
      "Vérification de la préparation à la recherche IA",
      "Feuille de route sur 90 jours",
    ],
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
  },
  caseStudyPreview: {
    eyebrow: "Étude de cas vérifiée",
    title: "British University Vietnam : +37 % de trafic organique.",
    description: "Explorez 10 études de cas vérifiées de Taskcover Agency.",
    metricLabel: "Trafic organique",
    metricValue: "+37 %",
    clientName: "British University Vietnam",
    cta: { label: "Voir toutes les études de cas", href: "/fr/work/case-studies" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Des questions, des réponses directes.",
    items: [
      {
        q: "Que fait Taskcover Agency ?",
        a: "Taskcover Agency est une agence de croissance par la recherche. Nous aidons les marques à développer leur visibilité organique, à bâtir leur autorité, à améliorer leur préparation à la recherche IA et à convertir la demande de recherche à forte intention en résultats commerciaux mesurables sur Google et les surfaces de recherche propulsées par l'IA.",
      },
      {
        q: "Qu'est-ce qui différencie Taskcover d'une agence SEO traditionnelle ?",
        a: "Nous traitons le SEO, le contenu, l'autorité et la recherche IA comme un seul système connecté plutôt que des livrables isolés, et nous mesurons le succès en termes de visibilité, de confiance, de prospects et de chiffre d'affaires plutôt qu'en classements seuls.",
      },
      {
        q: "Travaillez-vous avec des entreprises aux États-Unis, au Canada et en Australie ?",
        a: "Oui. Nous travaillons avec des clients aux États-Unis, au Canada et en Australie, avec un contexte propre à chaque marché plutôt qu'un contenu dupliqué.",
      },
      {
        q: "Garantissez-vous les classements ?",
        a: "Aucune agence sérieuse ne peut garantir des classements précis, et nous ne faisons aucune garantie de classement. Nous nous concentrons sur une visibilité durable, l'autorité et des résultats commerciaux que nous pouvons réellement influencer et mesurer.",
      },
      {
        q: "Qu'est-ce que l'optimisation pour la recherche IA ?",
        a: "L'optimisation pour la recherche IA consiste à rendre votre contenu et vos données structurées faciles à trouver, à citer et à créditer pour les surfaces propulsées par l'IA — comme les AI Overviews et les réponses des LLM. Elle complète plutôt qu'elle ne remplace le SEO traditionnel.",
      },
      {
        q: "Combien de temps prend le SEO ?",
        a: "Les délais dépendent de votre marché, de la concurrence, de votre base technique et de la maturité de votre contenu. Nous structurons généralement le travail en sprints de 90 jours avec des priorités claires, tout en bâtissant une autorité qui se renforce sur le long terme.",
      },
      {
        q: "Pouvez-vous associer SEO technique et contenu ?",
        a: "Oui. Le SEO technique, le contenu, l'autorité et la préparation à la recherche IA sont livrés comme un seul système connecté, et non comme des flux de travail séparés.",
      },
      {
        q: "Que comprend l'audit SEO gratuit ?",
        a: "L'audit de croissance SEO gratuit comprend un aperçu technique, une carte des opportunités de mots-clés, un écart de visibilité concurrentiel, un écart d'autorité de contenu, une vérification de la préparation à la recherche IA et une feuille de route sur 90 jours.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Lancez votre système de croissance par la recherche",
    title: "Bâtissez un système de recherche que vos concurrents ne peuvent pas facilement copier.",
    description:
      "Obtenez une vision claire et hiérarchisée de vos écarts de visibilité, d'autorité et de conversion — et un plan sur 90 jours pour les combler.",
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
    secondaryCta: { label: "Réserver un appel", href: "/book-a-call" },
  },
  ui: {
    osLoopLabel: "Les rapports renvoient les enseignements vers la stratégie",
    osStageLabel: "Étape",
    osInputLabel: "Entrée",
    osActionLabel: "Action",
    osOutputLabel: "Résultat",
    osCompoundLabel: "Chaque étape se cumule dans la suivante",
    featuredPlay: "Tactique en vedette",
    challengeLabel: "Défi",
    strategyLabel: "Stratégie",
    outputLabel: "Résultat",
    connectedToSystem: "Connecté au système d'exploitation de recherche",
    coreModule: "Module cœur",
    roadmapLabel: "Feuille de route",
    businessOutcome: "Résultat commercial",
    explore: "Découvrir",
    activeVertical: "Secteur actif",
    painPoint: "Point de douleur",
    opportunityLabel: "Opportunité",
    taskcoverSolution: "Solution Taskcover",
    intentPattern: "Schéma d'intention",
    trustSignals: "Signaux de confiance",
    recommendedServices: "Services recommandés",
    viewIndustry: "Voir",
    differentiator: "Différenciateur",
    viewMarket: "Voir le marché",
    phasesLabel: "Phases",
    traditionalLabel: "Prestataire SEO traditionnel",
    taskcoverLabel: "Taskcover Agency",
    auditTechnical: "Technique",
    auditAiReady: "Prêt IA",
    auditContent: "Contenu",
    auditAuthority: "Autorité",
    auditScored: "Évalué",
  },
};
