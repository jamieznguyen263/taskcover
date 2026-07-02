/**
 * French industries content — hub + all 7 industry detail objects + UI strings.
 *
 * Credibility rules (see docs/SEO_STANDARDS.md):
 *  - No fabricated metrics, testimonials, or case-study numbers.
 *  - Brand names referenced only as selected team/partner experience context.
 *  - Slugs and icons stay English/shared across locales.
 */

import type { IndustriesContent } from "../industries.types";

export const industries: IndustriesContent = {
  hub: {
    eyebrow: "Secteurs",
    h1: "Systèmes SEO sectoriels conçus selon la recherche réelle des acheteurs.",
    positioning:
      "Chaque secteur a des schémas d'intention, des signaux de confiance, des besoins de contenu et des parcours de conversion différents. Nous adaptons le système à la recherche réelle de votre marché.",
    description:
      "Le SEO générique cesse de fonctionner lorsque l'intention de recherche change selon le secteur. Voyage, éducation, santé, juridique, SaaS, e-commerce et franchise récompensent chacun un mélange différent de travail technique, de contenu, d'autorité, de local et de recherche IA.",
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
    secondaryCta: { label: "Réserver un appel", href: "/book-a-call" },
    selectorSection: {
      eyebrow: "Carte des secteurs",
      title: "Trouvez le secteur qui correspond à votre défi de recherche.",
      description:
        "Le Voyage et l'Éducation sont des secteurs prioritaires où Taskcover dispose d'une expérience pertinente en équipe et en partenariat. Chaque secteur ci-dessous reçoit un système adapté, pas un modèle.",
      priorityBadge: "Secteur prioritaire",
    },
    comparisonSection: {
      eyebrow: "Matrice des comportements de recherche",
      title: "Comment les secteurs diffèrent en recherche.",
      description:
        "La même tâche SEO produit des résultats différents selon le secteur. Cette matrice montre où se trouve la véritable friction — afin que vous sachiez quoi prioriser.",
      columns: [
        { key: "intent", label: "Intention de recherche" },
        { key: "trust", label: "Sensibilité à la confiance" },
        { key: "content", label: "Profondeur de contenu" },
        { key: "demand", label: "Local vs national" },
        { key: "authority", label: "Besoin d'autorité" },
        { key: "cycle", label: "Cycle de conversion" },
      ],
    },
    bundlesSection: {
      eyebrow: "Offres groupées de services",
      title: "Offres groupées recommandées par besoin.",
      description:
        "La plupart des secteurs ont besoin d'une pile connectée — pas d'un seul service. Ces offres groupées regroupent les capacités Taskcover selon le résultat dont chaque secteur a le plus besoin.",
      groups: [
        {
          label: "Fondation technique",
          description: "Exploration, indexation, architecture et Core Web Vitals.",
          slugs: ["technical-seo", "seo-audit", "seo-agency"],
        },
        {
          label: "Autorité de contenu",
          description: "Groupes pilotés par des experts, maillage interne et profondeur thématique.",
          slugs: ["content-marketing", "digital-pr-link-building", "ai-search-optimization"],
        },
        {
          label: "Visibilité IA / recherche",
          description: "Clarté des entités, données structurées et actifs citables.",
          slugs: ["ai-search-optimization", "technical-seo", "content-marketing"],
        },
        {
          label: "Croissance locale ou internationale",
          description: "Pages de localisation, architecture multi-marchés et hreflang.",
          slugs: ["local-seo", "international-seo", "technical-seo"],
        },
        {
          label: "Capture de demande payante",
          description: "Annonces de recherche alignées avec l'intention organique pour une capture rapide.",
          slugs: ["ppc-management", "seo-agency"],
        },
      ],
    },
    ctaSection: {
      eyebrow: "Commencez par un audit sectoriel",
      title: "Obtenez un audit de croissance SEO spécifique à votre secteur.",
      description:
        "Dites-nous votre secteur et nous examinerons la santé technique, la demande de recherche, les écarts concurrentiels, l'autorité de contenu et la préparation IA — puis établirons un plan de 90 jours.",
    },
  },

  industries: {
    "travel-seo": {
      slug: "travel-seo",
      icon: "travel",
      name: "SEO Voyage & Hôtellerie",
      eyebrow: "Voyage & Hôtellerie",
      h1: "SEO Voyage pour l'autorité de destination, les réservations directes et la demande multilingue.",
      metaTitle: "Services SEO Voyage & Hôtellerie pour Destinations & Réservations",
      metaDescription:
        "SEO Voyage pour les SERP de destination, la concurrence des agrégateurs, la demande saisonnière, la recherche internationale et les réponses IA voyage. Systèmes adaptés, pas des modèles.",
      heroDescription:
        "La recherche voyage est fragmentée entre OTA, agrégateurs, plateformes d'avis et réponses IA. Taskcover construit l'autorité de destination, la demande de réservation directe et la visibilité multilingue — l'expérience sélectionnée de l'équipe et des partenaires inclut des marques et campagnes voyage mondiales dont Agoda et Skyscanner.",
      marketContext:
        "Les acheteurs voyage recherchent des destinations, comparent des propriétés, lisent des avis et demandent aux outils IA des recommandations avant de réserver. Les SERP sont dominées par les agrégateurs, OTA et marketplaces — les marques directes doivent donc gagner en autorité, données structurées et contenu de destination pour concourir.",
      buyerSearchBehavior:
        "La demande se répartit entre les requêtes de destination (« choses à faire à Kyoto »), les comparaisons de propriétés et d'itinéraires (« Agoda vs Booking.com »), l'intention saisonnière (« meilleure période pour visiter Bali ») et les requêtes de recommandation IA (« où dormir à Lisbonne »). Chaque type de requête nécessite un contenu, une structure et des signaux de confiance différents.",
      searchWorkflow: {
        title: "Comment les acheteurs voyage recherchent",
        description:
          "Le parcours de recherche voyage passe de l'inspiration à la comparaison puis à la réservation — chaque étape récompense un travail SEO différent.",
        steps: [
          { stage: "Inspiration", label: "Découverte de destination", description: "Les acheteurs explorent « meilleures destinations » et le contenu saisonnier — l'autorité de destination et les guides gagnent." },
          { stage: "Recherche", label: "Comparaison de propriétés et d'itinéraires", description: "Les acheteurs comparent propriétés, itinéraires et prix — les données structurées et le contenu de comparaison gagnent." },
          { stage: "Validation", label: "Vérifications d'avis et de confiance", description: "Les acheteurs vérifient les avis et les signaux d'autorité avant de réserver." },
          { stage: "Réservation", label: "Décision direct vs agrégateur", description: "Les acheteurs décident entre réservation directe et OTA — le contenu de conversion et la confiance gagnent." },
          { stage: "Réponses IA", label: "Recommandations voyage IA", description: "Les acheteurs demandent aux outils IA des conseils de destination et de propriété — le contenu citable gagne." },
        ],
      },
      painPoints: {
        title: "Où les marques voyage perdent la demande de recherche.",
        description:
          "Les SERP voyage sont parmi les plus compétitives. Voici les points de friction qui coûtent des réservations directes et de l'autorité de destination.",
        items: [
          { label: "Concurrence de destination", detail: "Les agrégateurs et OTA dominent les SERP de destination et de propriété, reléguant les marques directes sous la ligne de flottaison.", severity: "high" },
          { label: "Domination des SERP par les agrégateurs", detail: "Les agrégateurs de comparaison et de réservation possèdent l'intention transactionnelle, laissant les marques directes avec la demande de notoriété.", severity: "high" },
          { label: "Demande multilingue", detail: "Les acheteurs voyage recherchent dans leur langue maternelle — la plupart des marques directes ne servent qu'une langue et perdent la demande internationale.", severity: "medium" },
          { label: "Volatilité saisonnière", detail: "La demande augmente et baisse selon les saisons — le contenu et la préparation technique doivent anticiper les cycles, pas y réagir.", severity: "medium" },
          { label: "Lacunes de confiance des avis", detail: "Les acheteurs valident avec des avis multi-plateformes — une stratégie d'avis incohérente érode la confiance au moment de la réservation.", severity: "medium" },
          { label: "Absence des réponses IA voyage", detail: "Les outils IA recommandent de plus en plus de destinations et de propriétés — les marques absentes du contenu citable perdent des parts.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Où les marques voyage peuvent gagner.",
        items: [
          "Posséder l'autorité de contenu de destination là où les agrégateurs ont des pages fines et génériques",
          "Capturer la demande de réservation directe avec des données structurées de propriété et de prix",
          "Gagner la demande multilingue et multi-marchés avec une architecture internationale appropriée",
          "Obtenir des citations dans les réponses IA voyage avec des guides de destination et du contenu expert",
          "Anticiper la demande saisonnière avec un contenu calé sur les cycles de réservation",
          "Construire l'autorité de destination via des RP numériques avec des publications voyage",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO voyage connecté.",
        description:
          "Nous connectons le technique, le contenu, l'autorité, l'international, la recherche IA et la conversion en un seul système — chaque couche renforçant la suivante.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture conçues pour de grands catalogues de destinations et de propriétés." },
          { label: "Autorité de contenu de destination", description: "Guides de destination, pages de propriétés et contenu de comparaison structurés pour la recherche et l'IA." },
          { label: "Architecture internationale", description: "Hreflang, stratégie de locale et contenu multilingue pour la demande voyage transfrontalière." },
          { label: "Autorité RP numériques", description: "Mentions obtenues dans des publications voyage qui construisent l'autorité de destination et de marque." },
          { label: "Préparation recherche IA", description: "Données structurées et actifs citables pour les surfaces de réponses IA voyage." },
          { label: "Parcours de conversion", description: "Maillage interne et CRO qui dirigent l'intention de destination vers les réservations directes." },
        ],
      },
      recommendedServices: ["international-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ai-search-optimization", "ppc-management"],
      contentStrategy: {
        title: "Contenu de destination qui valorise l'autorité.",
        description:
          "Le contenu voyage doit servir l'intention d'inspiration, de comparaison et de réservation. Nous construisons des groupes de destination avec un maillage interne qui canalise la demande vers la conversion.",
        pillars: [
          "Guides de destination qui possèdent l'intention « meilleures destinations » et « choses à faire »",
          "Pages de propriétés et de types de propriétés avec données structurées pour les requêtes de comparaison",
          "Contenu saisonnier et d'itinéraires calé sur les cycles de réservation",
          "Contenu de comparaison qui capture l'intention « vs » et alternative",
          "Contenu de confiance et d'avis qui valide la décision de réservation",
        ],
      },
      authorityStrategy: {
        title: "Autorité de destination via la couverture obtenue.",
        description:
          "L'autorité voyage vient de publications pertinentes, de mentions de destination et de commentaires d'experts — jamais de tactiques de liens spammy.",
        tactics: [
          "RP numériques avec des publications voyage et des médias de destination",
          "Récits voyage basés sur les données (tendances saisonnières, schémas de réservation, insights de destination)",
          "Commentaires de porte-parole expert sur les tendances voyage et hôtellerie",
          "Actifs de destination citables que les surfaces IA référencent",
        ],
      },
      localInternationalAngle: {
        title: "Demande voyage internationale et multilingue",
        description:
          "Le voyage est intrinsèquement international. Nous concevons l'architecture hreflang, la stratégie de locale et le contenu localisé afin que la bonne page gagne la demande dans chaque marché et langue.",
      },
      trustSignals:
        "Avis, couverture éditoriale, autorité de destination et données structurées qui valident les décisions de réservation sur toutes les plateformes et surfaces IA.",
      outcomes: [
        { label: "Couverture de recherche plus claire", description: "Intention de destination, de propriété et de comparaison capturée sur tout le parcours." },
        { label: "Signaux de confiance plus forts", description: "Avis, mentions et autorité qui valident les décisions de réservation." },
        { label: "Meilleure demande qualifiée", description: "Le contenu atteint les acheteurs aux étapes d'inspiration, de recherche et de réservation." },
        { label: "Visibilité internationale plus forte", description: "L'architecture multilingue et multi-marchés capture la demande transfrontalière." },
        { label: "Meilleure préparation IA voyage", description: "Contenu citable structuré pour les surfaces de réponses IA." },
      ],
      faqs: [
        { q: "Avez-vous de l'expérience en SEO voyage ?", a: "L'expérience sélectionnée de l'équipe et des partenaires inclut des marques et campagnes mondiales en voyage et croissance de recherche, dont le contexte Agoda et Skyscanner. Les noms de marque sont mentionnés à titre de contexte d'expérience uniquement et n'impliquent aucune approbation." },
        { q: "Pouvez-vous aider face à la concurrence OTA et agrégateurs ?", a: "Oui. Nous construisons l'autorité de destination, les données structurées et le contenu de réservation directe qui aident les marques directes à concourir avec les agrégateurs et OTA sur les requêtes qui comptent." },
        { q: "Gérez-vous le SEO voyage multilingue ?", a: "Oui. L'architecture internationale, hreflang et le contenu localisé sont au cœur du SEO voyage — la demande voyage est intrinsèquement transfrontalière et multilingue." },
        { q: "Comment abordez-vous les réponses IA voyage ?", a: "Nous structurons le contenu de destination et de propriété afin que les surfaces IA puissent l'analyser, le résumer et le citer — en créant les conditions qui rendent les citations plus probables." },
        { q: "Garantissez-vous des augmentations de réservations directes ?", a: "Non. Nous nous concentrons sur la visibilité durable, l'autorité et les parcours de conversion que nous pouvons influencer et mesurer — pas des garanties de réservation." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO Voyage.",
        description:
          "Voyez exactement où se situe votre visibilité de destination, de propriété et de réservation directe — et obtenez un plan de 90 jours pour combler les écarts.",
        auditLabel: "Votre audit voyage inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (destination, propriété, comparaison)",
          "Écart concurrentiel vs agrégateurs et OTA",
          "Écart d'autorité de contenu",
          "Vérification de préparation IA voyage",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["education-seo", "saas-seo", "ecommerce-seo"],
    },

    "education-seo": {
      slug: "education-seo",
      icon: "education",
      name: "SEO Éducation & Institutions",
      eyebrow: "Éducation & Institutions",
      h1: "SEO Éducation pour la visibilité des programmes, la confiance institutionnelle et les longs cycles de décision.",
      metaTitle: "Services SEO Éducation & Institutions pour Programmes & Confiance",
      metaDescription:
        "SEO Éducation pour la recherche de programmes, l'intention de comparaison, la confiance institutionnelle, les longs cycles de décision et la demande d'étudiants internationaux. Systèmes adaptés à l'éducation.",
      heroDescription:
        "Les décisions d'éducation sont lourdes de confiance et axées sur la recherche. Taskcover construit l'autorité des programmes, les données structurées et le contenu expert pour les longs cycles de réflexion — l'expérience sélectionnée de l'équipe et des partenaires inclut un contexte éducatif et institutionnel mondial dont British Council.",
      marketContext:
        "Les étudiants et familles recherchent des programmes, comparent des institutions, valident les résultats et cherchent des conseils d'experts pendant des semaines ou des mois. Les signaux de confiance — accréditation, résultats, autorité du corps professoral — pèsent lourd dans Google comme dans les surfaces de réponses IA.",
      buyerSearchBehavior:
        "La demande d'éducation se concentre sur les requêtes de programmes (« programmes de MBA au Canada »), l'intention de comparaison (« université vs école »), les questions de résultats (« cette formation vaut-elle le coup ») et la recherche d'étudiants internationaux. Chaque étape nécessite des signaux de confiance et une profondeur de contenu différents.",
      searchWorkflow: {
        title: "Comment les acheteurs éducation recherchent",
        description:
          "Le parcours éducatif est long et axé sur la confiance. Chaque étape récompense un travail de contenu et d'autorité différent.",
        steps: [
          { stage: "Découverte", label: "Exploration des programmes et domaines", description: "Les étudiants explorent les domaines et types de programmes — le contenu large de programmes et de résultats gagne." },
          { stage: "Comparaison", label: "Comparaison d'institutions et de programmes", description: "Les étudiants comparent programmes, coûts et résultats — les données structurées de programmes gagnent." },
          { stage: "Validation", label: "Vérifications d'accréditation et de confiance", description: "Les étudiants et familles vérifient l'accréditation, les résultats et la réputation." },
          { stage: "Décision", label: "Candidature et inscription", description: "Les étudiants se dirigent vers la candidature — le contenu de conversion et des parcours clairs gagnent." },
          { stage: "International", label: "Recherche d'étudiants transfrontaliers", description: "Les étudiants internationaux recherchent dans leur langue — le contenu localisé et la confiance gagnent." },
        ],
      },
      painPoints: {
        title: "Où les institutions éducatives perdent la demande de recherche.",
        description:
          "Le SEO éducation échoue quand les institutions le traitent comme du marketing de contenu générique. Voici les points de friction qui coûtent des inscriptions et de l'autorité.",
        items: [
          { label: "Longs cycles de décision", detail: "Les étudiants recherchent pendant des semaines ou des mois — le contenu doit soutenir l'autorité sur tout le parcours, pas seulement une seule visite.", severity: "high" },
          { label: "Lacunes de comparaison de programmes", detail: "Les étudiants comparent des programmes entre institutions — la plupart des sites manquent de données structurées et de contenu de comparaison.", severity: "high" },
          { label: "Déficits de confiance institutionnelle", detail: "L'accréditation, les résultats et l'autorité du corps professoral sont minces ou absents — érodant la confiance au moment de la décision.", severity: "high" },
          { label: "Lacunes sur les questions de résultats", detail: "Les étudiants demandent « cela vaut-il le coup » — la plupart des institutions manquent de contenu honnête sur les résultats et la valeur.", severity: "medium" },
          { label: "Demande d'étudiants internationaux", detail: "Les étudiants internationaux recherchent dans leur langue et contexte — la plupart des institutions ne servent qu'un locale et perdent la demande.", severity: "medium" },
          { label: "Données de programmes non structurées", detail: "Les détails des programmes sont enfouis dans des PDF ou des pages génériques — les rendant invisibles à la recherche et aux surfaces IA.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Où les institutions éducatives peuvent gagner.",
        items: [
          "Posséder l'autorité des programmes et domaines d'études avec des groupes de contenu experts",
          "Capturer l'intention de comparaison avec des données structurées et des comparaisons honnêtes",
          "Construire la confiance avec un contenu d'accréditation, de résultats et d'autorité du corps professoral",
          "Gagner la demande d'étudiants internationaux avec un contenu et une architecture localisés",
          "Obtenir des citations dans les réponses IA avec un contenu de programmes structuré et citable",
          "Soutenir l'autorité sur les longs cycles avec du contenu de mise à jour et de nurturing",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO éducation axé confiance.",
        description:
          "Nous connectons le technique, le contenu, l'autorité, la recherche IA et l'international en un système conçu pour les longs cycles de décision éducatifs.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture pour de grands catalogues de programmes et de cours." },
          { label: "Autorité de contenu de programmes", description: "Groupes de programmes, de résultats et de domaines d'études pilotés par des experts qui construisent la confiance." },
          { label: "Données de programmes structurées", description: "Schéma et contenu structuré qui rendent les programmes compréhensibles par les machines pour la recherche et l'IA." },
          { label: "Autorité institutionnelle", description: "RP numériques et commentaires d'experts qui construisent la crédibilité institutionnelle et du corps professoral." },
          { label: "Préparation recherche IA", description: "Contenu éducatif citable pour les surfaces de réponses IA." },
          { label: "Portée étudiants internationaux", description: "Contenu et architecture localisés pour la demande éducative transfrontalière." },
        ],
      },
      recommendedServices: ["content-marketing", "technical-seo", "ai-search-optimization", "digital-pr-link-building", "international-seo", "seo-mentor-service"],
      contentStrategy: {
        title: "Contenu qui construit la confiance sur les longs cycles.",
        description:
          "Le contenu éducatif doit répondre aux questions de programmes, de résultats et de comparaison avec une véritable expertise. Nous construisons des groupes qui soutiennent l'autorité sur tout le parcours de décision.",
        pillars: [
          "Pages de programmes et de cours avec données structurées pour la recherche et l'IA",
          "Groupes de domaines d'études qui possèdent l'intention large de découverte et de comparaison",
          "Contenu de résultats et de valeur qui répond honnêtement à « cela vaut-il le coup »",
          "Contenu d'autorité d'accréditation, du corps professoral et institutionnelle",
          "Contenu pour étudiants internationaux localisé pour la demande transfrontalière",
        ],
      },
      authorityStrategy: {
        title: "Autorité institutionnelle par l'expertise et la couverture.",
        description:
          "L'autorité éducative vient de l'accréditation, de l'expertise du corps professoral et de la couverture dans des publications de confiance — pas de schémas de liens.",
        tactics: [
          "RP numériques avec des publications éducatives et industrielles",
          "Commentaires du corps professoral et d'experts sur les tendances éducatives et de carrière",
          "Récits basés sur les données (résultats, inscriptions, tendances éducatives)",
          "Actifs de programmes et de résultats citables que les surfaces IA référencent",
        ],
      },
      localInternationalAngle: {
        title: "Demande d'étudiants internationaux",
        description:
          "Les étudiants internationaux sont un segment de demande majeur. Nous concevons un contenu et une architecture localisés afin que les institutions atteignent les étudiants à travers les marchés et les langues.",
      },
      trustSignals:
        "Accréditation, résultats, autorité du corps professoral, commentaires d'experts et données structurées de programmes qui valident les décisions éducatives sur la recherche et les surfaces IA.",
      outcomes: [
        { label: "Couverture de recherche plus claire", description: "Intention de programmes, de domaines et de comparaison capturée sur tout le parcours." },
        { label: "Signaux de confiance plus forts", description: "Accréditation, résultats et expertise qui valident les décisions." },
        { label: "Meilleure demande qualifiée", description: "Le contenu atteint les étudiants aux étapes de découverte, de comparaison et de décision." },
        { label: "Portée internationale plus forte", description: "Le contenu localisé capture la demande d'étudiants transfrontalière." },
        { label: "Meilleure préparation recherche IA", description: "Contenu de programmes structuré pour les surfaces de réponses IA." },
      ],
      faqs: [
        { q: "Avez-vous de l'expérience en SEO éducation ?", a: "L'expérience sélectionnée de l'équipe et des partenaires inclut un contexte éducatif et institutionnel mondial, dont le contexte British Council. Les noms de marque sont mentionnés à titre de contexte d'expérience uniquement et n'impliquent aucune approbation." },
        { q: "Pouvez-vous aider avec le contenu de comparaison de programmes ?", a: "Oui. Nous construisons des données structurées de programmes et du contenu de comparaison honnête qui capture l'intention de comparaison que les étudiants recherchent réellement." },
        { q: "Gérez-vous le SEO pour étudiants internationaux ?", a: "Oui. L'architecture internationale, la localisation et la stratégie de contenu transfrontalière sont au cœur du SEO éducation." },
        { q: "Comment abordez-vous les longs cycles de décision ?", a: "Nous construisons des groupes de contenu qui soutiennent l'autorité sur tout le parcours — découverte, comparaison, validation et décision — avec du contenu de mise à jour et de nurturing." },
        { q: "Garantissez-vous des augmentations d'inscriptions ?", a: "Non. Nous nous concentrons sur la visibilité durable, l'autorité et la demande qualifiée que nous pouvons influencer et mesurer — pas des garanties d'inscription." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO Éducation.",
        description:
          "Voyez exactement où se situe votre visibilité de programmes, institutionnelle et de résultats — et obtenez un plan de 90 jours pour construire la confiance et capturer la demande.",
        auditLabel: "Votre audit éducation inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (programmes, domaines, comparaison)",
          "Écart concurrentiel",
          "Écart d'autorité de contenu et de confiance",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["travel-seo", "healthcare-seo", "saas-seo"],
    },

    "healthcare-seo": {
      slug: "healthcare-seo",
      icon: "healthcare",
      name: "SEO Santé & Bien-être",
      eyebrow: "Santé & Bien-être",
      h1: "SEO Santé pour la confiance, la crédibilité experte et la demande de services locaux.",
      metaTitle: "Services SEO Santé & Bien-être pour Confiance & Demande Locale",
      metaDescription:
        "SEO Santé pour la sensibilité à la confiance, la crédibilité experte, la demande locale, les pages de services et le contenu sensible à la conformité. Pas de revendications médicales — systèmes axés autorité.",
      heroDescription:
        "La recherche santé est sensible à la confiance et axée sur le local. Taskcover construit du contenu expert, la visibilité de zone de service et des signaux de réputation — avec une messagerie sensible à la conformité qui évite les revendications médicales.",
      marketContext:
        "Les patients et familles recherchent des conditions, des traitements, des prestataires et des services locaux. Les signaux de confiance — revue par des experts, titres, réputation — pèsent lourd, et les exigences de conformité façonnent ce qui peut et ne peut pas être affirmé.",
      buyerSearchBehavior:
        "La demande santé se répartit entre les requêtes de conditions, la recherche de traitements, la recherche de prestataires et l'intention de services locaux (« près de moi »). Chaque type nécessite des signaux de confiance, une profondeur de contenu et une visibilité locale différents.",
      searchWorkflow: {
        title: "Comment les acheteurs santé recherchent",
        description:
          "Le parcours santé va de la recherche de symptômes à la sélection de prestataires — chaque étape récompense la confiance et la visibilité locale.",
        steps: [
          { stage: "Recherche", label: "Exploration de conditions et de traitements", description: "Les patients recherchent des conditions et des traitements — le contenu autoritaire et revu par des experts gagne." },
          { stage: "Évaluation", label: "Comparaison de prestataires et de cliniques", description: "Les patients comparent prestataires et cliniques — les pages de services structurées gagnent." },
          { stage: "Local", label: "Recherches de services près de moi", description: "Les patients recherchent des prestataires et services à proximité — le pack local et la fiche Google gagnent." },
          { stage: "Validation", label: "Vérifications d'avis et de réputation", description: "Les patients valident avec les avis et la réputation avant de prendre rendez-vous." },
          { stage: "Décision", label: "Prise de rendez-vous et contact", description: "Les patients se dirigent vers la prise de rendez-vous — des parcours de conversion clairs et la confiance gagnent." },
        ],
      },
      painPoints: {
        title: "Où les marques santé perdent la demande de recherche.",
        description:
          "Le SEO santé échoue quand les signaux de confiance sont faibles ou quand le contenu fait des revendications qu'il ne peut pas soutenir. Voici les points de friction qui coûtent des patients et de l'autorité.",
        items: [
          { label: "Sensibilité à la confiance et à la conformité", detail: "Le contenu santé doit être exact, revu par des experts et sensible à la conformité — des revendications faibles érodent la confiance et risquent des pénalités.", severity: "high" },
          { label: "Lacunes d'intention locale", detail: "Les patients recherchent « près de moi » — une fiche Google, des pages de localisation et une présence de pack local faibles coûtent la demande à proximité.", severity: "high" },
          { label: "Déficits de crédibilité experte", detail: "Le contenu manque de revue par des experts ou de titres — échouant les signaux de confiance que la santé exige.", severity: "high" },
          { label: "Pages de services fines", detail: "Les pages de services et de traitements sont fines ou génériques — perdant la visibilité sur des requêtes à forte intention.", severity: "medium" },
          { label: "Lacunes de signaux de réputation", detail: "Les avis sont obtenus lentement et gérés rarement — affaiblissant la confiance au moment de la prise de rendez-vous.", severity: "medium" },
          { label: "Absence des réponses IA", detail: "Les surfaces IA répondent de plus en plus aux questions de santé — les marques sans contenu citable perdent des parts.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Où les marques santé peuvent gagner.",
        items: [
          "Posséder l'autorité des conditions et des traitements avec du contenu revu par des experts",
          "Gagner la demande locale avec la fiche Google, les pages de localisation et la stratégie de zone de service",
          "Construire la confiance avec des titres, une revue par des experts et des signaux de réputation",
          "Capturer l'intention de prestataires et de services avec des pages de services structurées",
          "Obtenir des citations dans les réponses IA avec un contenu santé autoritaire et citable",
          "Renforcer les parcours de conversion de la recherche locale à la prise de rendez-vous",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO santé axé confiance.",
        description:
          "Nous connectons le technique, le contenu, l'autorité, le local et la recherche IA en un système conçu pour la confiance et la conformité santé.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture pour les catalogues de services et de prestataires." },
          { label: "Contenu revu par des experts", description: "Contenu de conditions, de traitements et de services revu pour l'exactitude et la confiance." },
          { label: "Visibilité locale", description: "Fiche Google, pages de localisation et stratégie de zone de service pour la demande près de moi." },
          { label: "Signaux de réputation", description: "Stratégie et gestion des avis qui construisent la confiance au moment de la prise de rendez-vous." },
          { label: "Préparation recherche IA", description: "Contenu santé citable structuré pour les surfaces de réponses IA." },
          { label: "Messagerie sensible à la conformité", description: "Guidance de contenu qui évite les revendications médicales et respecte les limites de conformité." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "seo-audit", "ai-search-optimization"],
      contentStrategy: {
        title: "Contenu qui gagne la confiance santé.",
        description:
          "Le contenu santé doit être revu par des experts, exact et véritablement utile. Nous construisons des groupes de conditions et de services que les signaux de confiance valident.",
        pillars: [
          "Contenu de conditions et de traitements revu pour l'exactitude et l'autorité",
          "Pages de services et de prestataires avec données structurées pour la recherche et l'IA",
          "Contenu local et de zone de service pour la demande près de moi",
          "Contenu de confiance et de titres qui valide l'expertise",
          "Contenu du parcours patient de la recherche à la prise de rendez-vous",
        ],
      },
      authorityStrategy: {
        title: "Autorité par l'expertise et la réputation.",
        description:
          "L'autorité santé vient de la revue par des experts, des titres et de la réputation — pas de tactiques de liens agressives.",
        tactics: [
          "Contenu revu par des experts qui démontre une véritable expertise",
          "RP numériques avec des publications santé et bien-être",
          "Stratégie de réputation et d'avis qui construit la confiance",
          "Actifs santé citables que les surfaces IA référencent",
        ],
      },
      trustSignals:
        "Revue par des experts, titres, accréditation, réputation et données structurées qui valident les décisions de santé sur la recherche et les surfaces IA.",
      outcomes: [
        { label: "Couverture de recherche plus claire", description: "Intention de conditions, de traitements, de services et de prestataires capturée." },
        { label: "Signaux de confiance plus forts", description: "Expertise, titres et réputation qui valident les décisions." },
        { label: "Meilleure visibilité locale", description: "Fiche Google, pages de localisation et présence de pack local pour la demande près de moi." },
        { label: "Meilleure demande qualifiée", description: "Le contenu atteint les patients aux étapes de recherche, d'évaluation et de prise de rendez-vous." },
        { label: "Meilleure préparation recherche IA", description: "Contenu santé citable pour les surfaces de réponses IA." },
      ],
      faqs: [
        { q: "Faites-vous des revendications médicales dans le contenu ?", a: "Non. Nous évitons les revendications médicales et la messagerie risquée pour la conformité. Le contenu est revu par des experts le cas échéant et se concentre sur des informations utiles et autoritaires." },
        { q: "Pouvez-vous aider avec le SEO santé local ?", a: "Oui. L'optimisation de la fiche Google, les pages de localisation, la stratégie de zone de service et la visibilité du pack local sont au cœur de la capture de demande santé." },
        { q: "Comment gérez-vous la revue par des experts ?", a: "Nous construisons des systèmes de contenu conçus pour la revue par des experts et fournissons des conseils pour démontrer l'expertise et les titres de manière visible dans la recherche." },
        { q: "Gérez-vous les avis santé ?", a: "Nous fournissons une stratégie d'avis et des conseils de réponse. Nous ne publions pas de faux avis." },
        { q: "Garantissez-vous des augmentations de patients ?", a: "Non. Nous nous concentrons sur la visibilité durable, l'autorité et la demande qualifiée que nous pouvons influencer et mesurer — pas des garanties de patients." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO Santé.",
        description:
          "Voyez exactement où se situe votre visibilité de services, locale et de confiance — et obtenez un plan de 90 jours pour capturer la demande santé en toute sécurité.",
        auditLabel: "Votre audit santé inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (conditions, services, local)",
          "Écart concurrentiel",
          "Écart d'autorité de contenu et de confiance",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["legal-immigration-seo", "franchise-local-seo", "education-seo"],
    },

    "legal-immigration-seo": {
      slug: "legal-immigration-seo",
      icon: "legal",
      name: "SEO Juridique & Immigration",
      eyebrow: "Juridique & Immigration",
      h1: "SEO Juridique & Immigration pour la demande à forte confiance, la visibilité de zone de service et la conversion d'intake.",
      metaTitle: "Services SEO Juridique & Immigration pour Confiance & Intake",
      metaDescription:
        "SEO juridique et immigration pour la demande consultative à forte confiance, les pages de zone de service, les questions longue traîne, l'autorité locale et la conversion d'intake. Pas de garanties juridiques.",
      heroDescription:
        "Les décisions juridiques et d'immigration sont des enjeux élevés et axées sur la confiance. Taskcover construit la visibilité de zone de service, le contenu axé confiance et les signaux d'autorité pour la demande consultative — sans garanties juridiques.",
      marketContext:
        "Les clients recherchent des types de dossiers, des juridictions et des services juridiques locaux avec une forte sensibilité à la confiance. La demande est consultative, axée sur la réputation et souvent urgente — rendant les signaux de confiance et la visibilité locale critiques.",
      buyerSearchBehavior:
        "La demande juridique se concentre sur les requêtes de types de dossiers, les recherches spécifiques à une juridiction, les questions longue traîne (« comment demander... ») et l'intention de services locaux. Chaque type nécessite des signaux de confiance et une profondeur de contenu différents.",
      searchWorkflow: {
        title: "Comment les clients juridique et immigration recherchent",
        description:
          "Le parcours juridique va de la recherche de questions à la consultation — chaque étape récompense la confiance et l'autorité locale.",
        steps: [
          { stage: "Recherche", label: "Questions de types de dossiers et de processus", description: "Les clients recherchent des types de dossiers et des processus — le contenu de Q&R longue traîne gagne." },
          { stage: "Évaluation", label: "Comparaison de cabinets et de services", description: "Les clients comparent cabinets et services — les pages de services structurées gagnent." },
          { stage: "Local", label: "Recherches de juridiction et près de moi", description: "Les clients recherchent des services locaux et spécifiques à une juridiction — les pages locales gagnent." },
          { stage: "Validation", label: "Vérifications d'avis et de titres", description: "Les clients valident avec les avis, les titres et la réputation." },
          { stage: "Intake", label: "Consultation et contact", description: "Les clients se dirigent vers la consultation — des parcours d'intake clairs et la confiance gagnent." },
        ],
      },
      painPoints: {
        title: "Où les cabinets juridique et immigration perdent la demande de recherche.",
        description:
          "Le SEO juridique échoue quand la confiance est faible ou la visibilité locale absente. Voici les points de friction qui coûtent des consultations et de l'autorité.",
        items: [
          { label: "Comportement de décision à forte confiance", detail: "Les décisions juridiques sont des enjeux élevés — des signaux de confiance et de titres faibles coûtent des consultations au moment de l'évaluation.", severity: "high" },
          { label: "Lacunes de visibilité de zone de service", detail: "Les clients recherchent par juridiction et localisation — des pages de zone de service fines et une fiche Google faible coûtent la demande locale.", severity: "high" },
          { label: "Lacunes de questions longue traîne", detail: "Les clients posent des questions de processus détaillées — la plupart des cabinets manquent du contenu de Q&R qui capture cette demande.", severity: "medium" },
          { label: "Duplication de pages locales", detail: "Les pages de localisation sont fines ou dupliquées — échouant à capturer l'intention spécifique à une juridiction.", severity: "medium" },
          { label: "Déficits d'autorité et de titres", detail: "Les titres du barreau, les résultats de dossiers et l'expertise sont minces — érodant la confiance au moment de la consultation.", severity: "high" },
          { label: "Friction de conversion d'intake", detail: "Les parcours de consultation et de contact sont peu clairs — fuyant la demande qualifiée à la dernière étape.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Où les cabinets juridique et immigration peuvent gagner.",
        items: [
          "Posséder l'autorité des types de dossiers et des processus avec du contenu de Q&R expert",
          "Gagner la demande locale avec des pages de zone de service, la fiche Google et le contenu de juridiction",
          "Construire la confiance avec des titres, de l'expertise et des signaux de réputation",
          "Capturer l'intention de questions longue traîne avec du contenu de FAQ structuré",
          "Renforcer la conversion d'intake de la recherche à la consultation",
          "Obtenir de l'autorité via des RP numériques avec des publications juridiques et d'immigration",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO juridique axé confiance.",
        description:
          "Nous connectons le technique, le contenu, l'autorité, le local et la conversion en un système conçu pour la demande juridique à forte confiance.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture pour les catalogues de services et de localisations." },
          { label: "Contenu axé confiance", description: "Contenu de types de dossiers, de processus et de FAQ qui démontre une véritable expertise." },
          { label: "Visibilité de zone de service", description: "Pages de localisation, fiche Google et contenu de juridiction pour la demande locale et régionale." },
          { label: "Autorité et titres", description: "RP numériques et visibilité des titres qui construisent la confiance au moment de la consultation." },
          { label: "Conversion d'intake", description: "Parcours de consultation et de contact clairs de la recherche à l'intake." },
          { label: "Signaux de réputation", description: "Stratégie et gestion des avis qui valident la fiabilité du cabinet." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ppc-management"],
      contentStrategy: {
        title: "Contenu qui construit la confiance juridique.",
        description:
          "Le contenu juridique doit répondre à des questions détaillées avec une véritable expertise. Nous construisons des groupes de types de dossiers et de processus que les signaux de confiance valident.",
        pillars: [
          "Pages de types de dossiers et de domaines de pratique avec données structurées",
          "Contenu de Q&R de processus et de guides pour la demande de questions longue traîne",
          "Pages de localisation et de juridiction pour la visibilité de zone de service",
          "Contenu de titres, d'expertise et d'autorité qui valide la confiance",
          "Contenu du parcours client de la recherche à la consultation",
        ],
      },
      authorityStrategy: {
        title: "Autorité par les titres et la couverture.",
        description:
          "L'autorité juridique vient des titres, de l'expertise et de la couverture dans des publications de confiance — pas de schémas de liens.",
        tactics: [
          "RP numériques avec des publications juridiques et d'immigration",
          "Commentaires d'experts sur les tendances juridiques et d'immigration",
          "Visibilité des titres et de l'expertise qui démontre l'autorité",
          "Contenu juridique citable que les surfaces IA référencent",
        ],
      },
      trustSignals:
        "Titres du barreau, expertise, réputation, avis et données structurées qui valident les décisions juridiques et d'immigration sur la recherche et les surfaces IA.",
      outcomes: [
        { label: "Couverture de recherche plus claire", description: "Intention de types de dossiers, de processus et locale capturée sur tout le parcours." },
        { label: "Signaux de confiance plus forts", description: "Titres, expertise et réputation qui valident les décisions." },
        { label: "Meilleure visibilité locale", description: "Pages de zone de service, fiche Google et contenu de juridiction pour la demande régionale." },
        { label: "Meilleure demande qualifiée", description: "Le contenu atteint les clients aux étapes de recherche, d'évaluation et d'intake." },
        { label: "Meilleure conversion d'intake", description: "Parcours clairs de la recherche à la consultation et au contact." },
      ],
      faqs: [
        { q: "Faites-vous des garanties juridiques ?", a: "Non. Nous évitons les garanties juridiques et les promesses de résultats. Le contenu se concentre sur la démonstration de l'expertise et la capture de demande qualifiée." },
        { q: "Pouvez-vous aider avec le SEO de zone de service ?", a: "Oui. Les pages de localisation, la fiche Google, le contenu de juridiction et la stratégie de zone de service sont au cœur de la capture de demande juridique et d'immigration." },
        { q: "Gérez-vous le SEO spécifique à l'immigration ?", a: "Oui. La demande d'immigration a des schémas distincts de confiance, de juridiction et de questions longue traîne auxquels nous adaptons le contenu et l'architecture." },
        { q: "Comment abordez-vous le comportement à forte confiance ?", a: "Nous construisons du contenu axé confiance, une visibilité des titres et des signaux d'autorité qui valident les décisions au moment de la consultation." },
        { q: "Garantissez-vous des augmentations de consultations ?", a: "Non. Nous nous concentrons sur la visibilité durable, l'autorité et la demande qualifiée que nous pouvons influencer et mesurer — pas des garanties de consultations." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO Juridique & Immigration.",
        description:
          "Voyez exactement où se situe votre visibilité de types de dossiers, locale et de confiance — et obtenez un plan de 90 jours pour capturer la demande consultative.",
        auditLabel: "Votre audit juridique inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (types de dossiers, processus, local)",
          "Écart concurrentiel",
          "Écart d'autorité de contenu et de confiance",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["healthcare-seo", "franchise-local-seo", "saas-seo"],
    },

    "saas-seo": {
      slug: "saas-seo",
      icon: "saas",
      name: "SEO SaaS & Technologie",
      eyebrow: "SaaS & Technologie",
      h1: "SEO SaaS pour l'autorité de catégorie, l'intention de comparaison et le contenu product-led.",
      metaTitle: "Services SEO SaaS & Technologie pour Catégories & Comparaison",
      metaDescription:
        "SEO SaaS pour les pages de catégories, l'intention de comparaison, le contenu product-led, la documentation technique, les SERP concurrentes, la recherche IA et le contenu de conversion.",
      heroDescription:
        "Les catégories SaaS sont bondées et axées sur la comparaison. Taskcover construit l'autorité de catégorie, le contenu de comparaison et les pages product-led qui capturent les acheteurs recherchant des alternatives et des intégrations.",
      marketContext:
        "Les acheteurs SaaS recherchent des catégories, comparent des alternatives, évaluent des intégrations et cherchent des preuves produit avant de convertir. Les SERP sont compétitives, axées sur la comparaison et de plus en plus répondues par les surfaces IA.",
      buyerSearchBehavior:
        "La demande SaaS se concentre sur les requêtes de catégories (« meilleur logiciel CRM »), l'intention de comparaison (« Outil A vs Outil B »), les recherches d'alternatives (« alternatives Outil A ») et les questions d'intégration. Chaque type nécessite un contenu et des signaux d'autorité différents.",
      searchWorkflow: {
        title: "Comment les acheteurs SaaS recherchent",
        description:
          "Le parcours SaaS va de la recherche de catégories à la comparaison puis à l'essai — chaque étape récompense une profondeur de contenu différente.",
        steps: [
          { stage: "Découverte", label: "Recherche de catégories et de solutions", description: "Les acheteurs explorent les catégories et types de solutions — le contenu de catégories et de guides d'achat gagne." },
          { stage: "Comparaison", label: "Comparaison d'outils et d'alternatives", description: "Les acheteurs comparent outils et alternatives — le contenu de comparaison et « vs » gagne." },
          { stage: "Intégration", label: "Vérifications d'intégration et de compatibilité", description: "Les acheteurs vérifient les intégrations et la compatibilité — le contenu technique et d'intégration gagne." },
          { stage: "Validation", label: "Vérifications de preuve et d'avis", description: "Les acheteurs valident avec les avis, les preuves de cas et les commentaires d'experts." },
          { stage: "Essai", label: "Conversion d'inscription et d'essai", description: "Les acheteurs se dirigent vers l'essai — le contenu product-led et de conversion gagne." },
        ],
      },
      painPoints: {
        title: "Où les marques SaaS perdent la demande de recherche.",
        description:
          "Le SEO SaaS échoue quand le contenu de catégorie et de comparaison est fin ou absent. Voici les points de friction qui coûtent des essais et de l'autorité.",
        items: [
          { label: "Concurrence de catégorie", detail: "Les SERP de catégories SaaS sont bondées — des pages de catégories fines perdent la visibilité au profit des concurrents et des sites de listes.", severity: "high" },
          { label: "Lacunes d'intention de comparaison", detail: "Les acheteurs comparent des outils — la plupart des sites SaaS manquent du contenu « vs » et alternative qui capture cette demande.", severity: "high" },
          { label: "Déficits de contenu product-led", detail: "Le contenu est du marketing creux, pas product-led — échouant à atteindre les acheteurs qui évaluent des fonctionnalités et des cas d'usage.", severity: "medium" },
          { label: "Lacunes de documentation technique", detail: "Les docs et le contenu d'intégration sont mal optimisés — perdant la visibilité sur les requêtes de développeurs et d'intégration.", severity: "medium" },
          { label: "Domination des SERP concurrentes", detail: "Les concurrents et les sites d'avis agrégateurs possèdent les requêtes de comparaison et d'alternatives.", severity: "high" },
          { label: "Absence des réponses IA", detail: "Les surfaces IA recommandent de plus en plus d'outils — les marques sans contenu structuré et citable perdent des parts.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Où les marques SaaS peuvent gagner.",
        items: [
          "Posséder l'autorité de catégorie avec un contenu de catégorie profond et expert",
          "Capturer l'intention de comparaison et d'alternative avec du contenu « vs » honnête",
          "Gagner les requêtes de développeurs et d'intégration avec une documentation optimisée",
          "Construire du contenu product-led qui atteint les acheteurs évaluant des fonctionnalités",
          "Obtenir des citations dans les réponses IA avec du contenu de produit et de comparaison structuré",
          "Renforcer les parcours de conversion d'essai de la recherche à l'inscription",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO SaaS axé catégorie.",
        description:
          "Nous connectons le technique, le contenu, l'autorité, la recherche IA et la conversion en un système conçu pour la concurrence de catégories SaaS.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture pour les catalogues de produits, de docs et de contenu." },
          { label: "Autorité de contenu de catégorie", description: "Groupes de catégories, de guides d'achat et de cas d'usage pilotés par des experts qui construisent l'autorité." },
          { label: "Contenu de comparaison", description: "Contenu honnête « vs », alternative et comparaison qui capture l'intention d'évaluation." },
          { label: "Contenu product-led", description: "Contenu de fonctionnalités, de cas d'usage et d'intégration qui atteint les acheteurs évaluant des produits." },
          { label: "Préparation recherche IA", description: "Contenu de produit et de comparaison structuré pour les surfaces de réponses IA." },
          { label: "Parcours de conversion", description: "Maillage interne et CRO qui dirigent l'intention d'évaluation vers l'essai et l'inscription." },
        ],
      },
      recommendedServices: ["seo-agency", "technical-seo", "content-marketing", "ai-search-optimization", "ppc-management", "seo-mentor-service"],
      contentStrategy: {
        title: "Contenu qui gagne les catégories SaaS.",
        description:
          "Le contenu SaaS doit servir l'intention de catégorie, de comparaison et d'évaluation avec une véritable profondeur produit. Nous construisons des groupes qui capturent les acheteurs sur tout le parcours d'évaluation.",
        pillars: [
          "Contenu de catégories et de guides d'achat qui possède l'intention large de découverte",
          "Contenu de comparaison et d'alternative qui capture les requêtes d'évaluation",
          "Contenu product-led de fonctionnalités et de cas d'usage pour la demande spécifique aux fonctionnalités",
          "Documentation technique optimisée pour les requêtes de développeurs et d'intégration",
          "Contenu de preuve et d'avis qui valide la décision d'essai",
        ],
      },
      authorityStrategy: {
        title: "Autorité par la preuve produit et la couverture.",
        description:
          "L'autorité SaaS vient de la preuve produit, des avis d'experts et de la couverture dans des publications de confiance — pas de schémas de liens.",
        tactics: [
          "RP numériques avec des publications technologiques et SaaS",
          "Commentaires d'experts sur les tendances SaaS et technologiques",
          "Visibilité de la preuve produit et des intégrations qui démontre l'autorité",
          "Contenu de produit citable que les surfaces IA référencent",
        ],
      },
      trustSignals:
        "Preuve produit, intégrations, avis d'experts et couverture dans des publications de confiance qui valident les décisions SaaS sur la recherche et les surfaces IA.",
      outcomes: [
        { label: "Couverture de recherche plus claire", description: "Intention de catégories, de comparaison et d'intégration capturée." },
        { label: "Autorité de catégorie plus forte", description: "Contenu expert qui possède les requêtes de catégories et d'évaluation." },
        { label: "Meilleure demande qualifiée", description: "Le contenu atteint les acheteurs aux étapes de découverte, de comparaison et d'essai." },
        { label: "Meilleure préparation recherche IA", description: "Contenu de produit structuré pour les surfaces de réponses IA." },
        { label: "Meilleure conversion d'essai", description: "Parcours clairs de la recherche à l'inscription et à l'essai." },
      ],
      faqs: [
        { q: "Pouvez-vous aider avec le contenu de comparaison et d'alternative ?", a: "Oui. Le contenu honnête « vs » et alternative est au cœur du SEO SaaS — nous le construisons pour capturer l'intention d'évaluation sans induire les acheteurs en erreur." },
        { q: "Optimisez-vous la documentation technique ?", a: "Oui. Nous optimisons les docs et le contenu d'intégration pour les requêtes de développeurs et d'intégration — un segment de demande SaaS majeur." },
        { q: "Comment gérez-vous la concurrence de catégorie ?", a: "Nous construisons du contenu de catégorie profond et expert et des signaux d'autorité qui concourent avec les sites de listes et les concurrents sur la qualité." },
        { q: "Abordez-vous la recherche IA pour le SaaS ?", a: "Oui. Les surfaces IA recommandent de plus en plus d'outils — nous structurons le contenu de produit et de comparaison pour qu'il soit citable." },
        { q: "Garantissez-vous des augmentations d'essais ?", a: "Non. Nous nous concentrons sur la visibilité durable, l'autorité et la demande qualifiée que nous pouvons influencer et mesurer — pas des garanties d'essais." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO SaaS.",
        description:
          "Voyez exactement où se situe votre visibilité de catégories, de comparaison et de produit — et obtenez un plan de 90 jours pour gagner la demande SaaS.",
        auditLabel: "Votre audit SaaS inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (catégories, comparaison, intégration)",
          "Écart concurrentiel",
          "Écart d'autorité de contenu",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["travel-seo", "ecommerce-seo", "education-seo"],
    },

    "ecommerce-seo": {
      slug: "ecommerce-seo",
      icon: "ecommerce",
      name: "SEO E-commerce",
      eyebrow: "E-commerce",
      h1: "SEO E-commerce pour l'architecture de catégories, les pages produits et la demande d'intention d'achat.",
      metaTitle: "Services SEO E-commerce pour Catégories, Produits & Revenus",
      metaDescription:
        "SEO E-commerce pour l'architecture de catégories, les pages produits, la navigation à facettes, le contenu d'intention d'achat, les liens internes et la demande de recherche de merchandising.",
      heroDescription:
        "Le SEO e-commerce se juge au revenu, pas au trafic. Taskcover construit l'architecture de catégories, les systèmes de pages produits et le contenu d'intention d'achat qui capture et convertit la demande transactionnelle.",
      marketContext:
        "Les acheteurs e-commerce recherchent des catégories, comparent des produits, lisent des avis et s'attendent à des données produits structurées. Les SERP sont compétitives, la navigation à facettes crée des défis d'indexation, et les marketplaces capturent une demande importante.",
      buyerSearchBehavior:
        "La demande e-commerce se concentre sur les requêtes de catégories, les recherches spécifiques de produits, l'intention de comparaison et les requêtes transactionnelles (« acheter »). Chaque type nécessite une architecture, un contenu et des données structurées différents.",
      searchWorkflow: {
        title: "Comment les acheteurs e-commerce recherchent",
        description:
          "Le parcours e-commerce va de la navigation de catégories à la comparaison de produits puis à l'achat — chaque étape récompense l'architecture et le contenu.",
        steps: [
          { stage: "Navigation", label: "Découverte de catégories et de produits", description: "Les acheteurs naviguent dans les catégories et les produits — les pages de catégories bien structurées gagnent." },
          { stage: "Comparaison", label: "Comparaison de produits et de fonctionnalités", description: "Les acheteurs comparent produits et fonctionnalités — les pages produits structurées gagnent." },
          { stage: "Validation", label: "Vérifications d'avis et de notes", description: "Les acheteurs valident avec les avis et les notes avant l'achat." },
          { stage: "Transaction", label: "Recherches d'intention d'achat", description: "Les acheteurs recherchent avec une intention transactionnelle — le contenu et les pages d'intention d'achat gagnent." },
          { stage: "Découverte+", label: "Recherche de guides et de hubs", description: "Les acheteurs recherchent via des guides et des hubs — le contenu qui soutient la découverte gagne." },
        ],
      },
      painPoints: {
        title: "Où les boutiques e-commerce perdent la demande de recherche.",
        description:
          "Le SEO e-commerce échoue quand l'architecture et les données produits sont faibles. Voici les points de friction qui coûtent du revenu.",
        items: [
          { label: "Lacunes d'architecture de catégories", detail: "Les catégories ne sont pas mappées à l'intention d'achat — les modèles génériques ne convertissent jamais.", severity: "high" },
          { label: "Pages produits fines", detail: "Les pages produits sont fines ou dupliquées entre les variantes — perdant la visibilité et la confiance.", severity: "high" },
          { label: "Risque de navigation à facettes", detail: "La navigation à facettes crée un gonflement d'indexation et dilue l'autorité sur des milliers d'URL de faible valeur.", severity: "high" },
          { label: "Faiblesse du maillage interne", detail: "Mauvaise liaison entre les catégories, les produits et les hubs — la demande ne circule pas vers la conversion.", severity: "medium" },
          { label: "Absence de contenu d'intention d'achat", detail: "Les guides et les hubs qui capturent la demande de découverte sont absents.", severity: "medium" },
          { label: "Perte de demande vers les marketplaces", detail: "La demande d'intention d'achat fuit vers les marketplaces — les données structurées et l'architecture doivent concourir.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Où les boutiques e-commerce peuvent gagner.",
        items: [
          "Mapper l'architecture de catégories à la façon dont les acheteurs recherchent et achètent",
          "Construire des pages produits uniques et structurées qui convertissent",
          "Contrôler la navigation à facettes pour consolider l'autorité",
          "Créer des hubs de contenu d'intention d'achat qui capturent la découverte",
          "Renforcer le maillage interne du contenu vers les produits",
          "Concourir avec les marketplaces sur les données structurées et la profondeur produit",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO e-commerce axé revenus.",
        description:
          "Nous connectons le technique, le contenu, l'architecture et la conversion en un système conçu pour le revenu e-commerce.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et performance pour de grands catalogues de produits." },
          { label: "Architecture de catégories", description: "Structure qui mappe les catégories à la façon dont les gens recherchent et achètent." },
          { label: "Système de pages produits", description: "Modèles pour des pages produits uniques, indexables et prêtes à convertir." },
          { label: "Contrôle de la navigation à facettes", description: "Règles d'indexation qui consolident l'autorité à travers les facettes." },
          { label: "Contenu d'intention d'achat", description: "Guides et hubs qui capturent et canalissent la demande de découverte." },
          { label: "Parcours de conversion", description: "Maillage interne et CRO de la demande de recherche à la vente." },
        ],
      },
      recommendedServices: ["ecommerce-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      contentStrategy: {
        title: "Contenu qui génère du revenu e-commerce.",
        description:
          "Le contenu e-commerce doit soutenir la découverte et la conversion de produits. Nous construisons des guides d'achat et des hubs qui canalissent la demande vers les produits.",
        pillars: [
          "Contenu de catégories qui capture l'intention de navigation et de découverte",
          "Guides d'achat et hubs qui soutiennent les décisions de produits",
          "Contenu de pages produits unique, structuré et prêt à convertir",
          "Contenu de comparaison qui capture les requêtes d'évaluation",
          "Maillage interne qui canalisse la demande de contenu vers les produits",
        ],
      },
      authorityStrategy: {
        title: "Autorité par la profondeur produit et la structure.",
        description:
          "L'autorité e-commerce vient des données produits structurées, des avis et de la profondeur de contenu — pas de schémas de liens.",
        tactics: [
          "Données produits structurées qui aident Google et l'IA à surface les produits",
          "Stratégie d'avis qui construit la confiance produit",
          "Profondeur de contenu qui signale l'autorité de catégorie",
          "Contenu de produit et de guide citable pour les surfaces IA",
        ],
      },
      trustSignals:
        "Avis, données structurées, confiance de fulfillment et profondeur produit qui valident les décisions d'achat sur la recherche et les surfaces IA.",
      outcomes: [
        { label: "Plus de demande d'intention d'achat", description: "Visibilité sur les termes de catégories et de produits qui génèrent du revenu." },
        { label: "Indexation plus propre", description: "Les bonnes pages indexées ; les facettes contrôlées et l'autorité consolidée." },
        { label: "Pages produits plus fortes", description: "Contenu produit unique, structuré et prêt à convertir." },
        { label: "Meilleurs parcours de conversion", description: "Demande canalisée du contenu vers l'achat." },
        { label: "Meilleure couverture des surfaces IA", description: "Les données produits structurées aident les surfaces IA à citer et à surface les produits." },
      ],
      faqs: [
        { q: "Pouvez-vous gérer de grands catalogues de produits ?", a: "Oui. Nous concevons des règles de navigation à facettes et des modèles évolutifs qui gardent les grands catalogues indexables et de haute qualité." },
        { q: "Optimisez-vous les modèles de pages produits ?", a: "Oui. Nous définissons des modèles pour des pages produits uniques, indexables et orientées conversion." },
        { q: "Comment abordez-vous la navigation à facettes ?", a: "Nous concevons des règles d'indexation qui contrôlent les facettes et consolident l'autorité — empêchant le gonflement d'indexation." },
        { q: "Pouvez-vous concourir avec les marketplaces ?", a: "Notre focus est votre propre boutique. Nous construisons des données structurées et une profondeur produit qui vous aident à concourir pour la demande d'intention d'achat." },
        { q: "Le SEO e-commerce est-il mesuré au revenu ?", a: "Oui. Nous relions le travail à la demande qualifiée et au revenu, pas juste au trafic." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO E-commerce.",
        description:
          "Voyez exactement où se situe votre visibilité de catégories, de produits et de revenus — et obtenez un plan de 90 jours pour capturer la demande d'intention d'achat.",
        auditLabel: "Votre audit e-commerce inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (catégories, produits, transactionnel)",
          "Écart concurrentiel",
          "Écart de contenu et d'architecture",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["saas-seo", "travel-seo", "franchise-local-seo"],
    },

    "franchise-local-seo": {
      slug: "franchise-local-seo",
      icon: "franchise",
      name: "SEO Franchise & Multi-localisation",
      eyebrow: "Franchise & Multi-localisation",
      h1: "SEO Franchise pour la cohérence des localisations, l'autorité locale et la visibilité multi-marchés.",
      metaTitle: "Services SEO Franchise & Multi-localisation pour Cohérence Locale",
      metaDescription:
        "SEO franchise et multi-localisation pour la cohérence des localisations, les pages locales, la fiche Google, les avis, les citations NAP, le risque de duplication et le reporting multi-marchés.",
      heroDescription:
        "Les marques multi-localisations et franchise ont besoin d'une visibilité locale cohérente à grande échelle. Taskcover construit l'architecture de localisation, la stratégie de fiche Google et les systèmes d'avis qui gagnent le pack local et les cartes de chaque localisation.",
      marketContext:
        "La demande franchise et multi-localisation se décide dans les packs locaux, sur les cartes et à travers les avis spécifiques à chaque localisation. La cohérence entre les localisations — tout en restant spécifique — est le défi central.",
      buyerSearchBehavior:
        "La demande franchise se concentre sur les requêtes près de moi, les recherches de services spécifiques à une localisation et la découverte basée sur les cartes. Chaque localisation a besoin de sa propre autorité et présence locales.",
      searchWorkflow: {
        title: "Comment les acheteurs franchise et multi-localisation recherchent",
        description:
          "Le parcours franchise est intrinsèquement local — chaque localisation doit gagner son propre pack, ses cartes et ses avis.",
        steps: [
          { stage: "Local", label: "Recherches près de moi et par localisation", description: "Les acheteurs recherchent des termes près de moi et spécifiques à une localisation — la fiche Google et les pages locales gagnent." },
          { stage: "Carte", label: "Découverte basée sur les cartes", description: "Les acheteurs découvrent des localisations via les cartes — la présence et l'exactitude sur les cartes gagnent." },
          { stage: "Comparaison", label: "Comparaison de localisations et de services", description: "Les acheteurs comparent localisations et services — les pages de localisation structurées gagnent." },
          { stage: "Validation", label: "Vérifications d'avis et de notes", description: "Les acheteurs valident avec des avis spécifiques à chaque localisation avant de visiter." },
          { stage: "Visite", label: "Intention d'itinéraire et de contact", description: "Les acheteurs cherchent des itinéraires et des contacts — des données NAP et de localisation exactes gagnent." },
        ],
      },
      painPoints: {
        title: "Où les marques franchise et multi-localisation perdent la demande de recherche.",
        description:
          "Le SEO franchise échoue quand les localisations sont incohérentes ou dupliquées. Voici les points de friction qui coûtent la demande locale.",
        items: [
          { label: "Lacunes de cohérence des localisations", detail: "La fiche Google, les pages et les citations sont incohérentes entre les localisations — érodant la confiance et la visibilité locales.", severity: "high" },
          { label: "Duplication de pages locales", detail: "Les pages de localisation sont dupliquées ou fines — échouant à capturer l'intention spécifique à une localisation et risquant des problèmes de pages porte.", severity: "high" },
          { label: "Incohérence des signaux d'avis", detail: "Les avis sont obtenus lentement et gérés rarement entre les localisations — affaiblissant la confiance locale.", severity: "medium" },
          { label: "Erreurs NAP et de citations", detail: "Les incohérences de nom, d'adresse et de téléphone entre les annuaires brouillent les signaux locaux.", severity: "medium" },
          { label: "Lacunes de reporting multi-marchés", detail: "La visibilité des performances par localisation est absente — rendant la priorisation impossible.", severity: "medium" },
          { label: "Déficits d'autorité locale", detail: "Les localisations individuelles manquent de l'autorité locale nécessaire pour gagner leurs propres packs.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Où les marques franchise et multi-localisation peuvent gagner.",
        items: [
          "Construire des pages de localisation cohérentes et uniques à grande échelle",
          "Gagner le pack local de chaque localisation avec l'optimisation de la fiche Google",
          "Renforcer la stratégie d'avis à travers toutes les localisations",
          "Corriger la cohérence NAP et des citations entre les annuaires",
          "Construire l'autorité locale de chaque localisation",
          "Obtenir une visibilité des performances multi-marchés par localisation",
        ],
      },
      taskcoverSolution: {
        title: "Un modèle opérationnel SEO local évolutif.",
        description:
          "Nous connectons l'architecture de localisation, la fiche Google, les avis, les citations et le reporting en un système qui évolue entre les localisations tout en restant spécifique.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et architecture pour les catalogues de localisations et de services." },
          { label: "Architecture de localisation", description: "Pages de localisation et de zone de service évolutives et uniques avec schéma." },
          { label: "Optimisation de la fiche Google", description: "Catégories, services, publications et gestion cohérente entre les localisations." },
          { label: "Stratégie d'avis", description: "Obtenir des avis éthiquement et répondre à grande échelle entre les localisations." },
          { label: "Cohérence des citations", description: "Nettoyage NAP et gestion des citations entre les annuaires." },
          { label: "Reporting multi-localisation", description: "Visibilité des performances par localisation et par marché." },
        ],
      },
      recommendedServices: ["local-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      contentStrategy: {
        title: "Contenu qui évolue entre les localisations.",
        description:
          "Le contenu franchise doit être évolutif mais spécifique. Nous construisons du contenu de localisation et de zone de service qui évite la duplication tout en capturant l'intention locale.",
        pillars: [
          "Pages de localisation uniques qui capturent l'intention spécifique à une localisation",
          "Contenu de zone de service pour la demande près de moi et régionale",
          "Contenu de confiance et de communauté locale qui construit l'autorité de localisation",
          "Contenu d'avis et de réputation qui valide les décisions de localisation",
          "Maillage interne multi-localisation qui renforce les pages locales",
        ],
      },
      authorityStrategy: {
        title: "Autorité locale à grande échelle.",
        description:
          "L'autorité franchise vient de la pertinence locale, des avis et des citations — pas de schémas de liens génériques.",
        tactics: [
          "Cohérence des citations locales et NAP entre les annuaires",
          "Stratégie d'avis qui construit la confiance locale à chaque localisation",
          "RP numériques locaux et présence communautaire",
          "Autorité spécifique à chaque localisation qui gagne des packs locaux individuels",
        ],
      },
      trustSignals:
        "Avis de localisation, NAP cohérent, exactitude de la fiche Google et autorité locale qui valident les décisions de franchise sur la recherche et les cartes.",
      outcomes: [
        { label: "Présence de pack local plus forte", description: "Plus de visibilité dans les cartes et les résultats locaux par localisation." },
        { label: "Pages de localisation évolutives", description: "Pages uniques et utiles sans risque de pages porte." },
        { label: "Meilleurs signaux de réputation", description: "Plus d'avis et mieux gérés entre les localisations." },
        { label: "Reporting local clair", description: "Visibilité des performances par localisation et par marché." },
        { label: "Conversion locale plus forte", description: "Le trafic des cartes et du pack atteint les appels, les formulaires et les visites." },
      ],
      faqs: [
        { q: "Pouvez-vous gérer le SEO franchise et multi-localisation à grande échelle ?", a: "Oui. Nous construisons des architectures évolutives avec des pages de localisation uniques et utiles qui évitent les problèmes de pages porte." },
        { q: "Gérez-vous la fiche Google entre les localisations ?", a: "Oui. Nous fournissons des conseils d'optimisation et de gestion de la fiche Google entre toutes les localisations pour la cohérence." },
        { q: "Comment évitez-vous la duplication de pages locales ?", a: "Nous concevons des pages génériques mais uniques avec un véritable contenu local — évitant la duplication fine qui crée un risque de pages porte." },
        { q: "Gérez-vous le nettoyage NAP et des citations ?", a: "Oui. La cohérence des citations et le nettoyage NAP sont au cœur du SEO local multi-localisation." },
        { q: "Comment rapportez-vous entre les localisations ?", a: "Nous fournissons un reporting multi-localisation qui montre le pack, les cartes et les performances par localisation et par marché." },
      ],
      finalCta: {
        title: "Obtenez un Audit de Croissance SEO Franchise & Multi-localisation.",
        description:
          "Voyez exactement où se situe votre cohérence de localisations, votre autorité locale et votre visibilité multi-marchés — et obtenez un plan de 90 jours.",
        auditLabel: "Votre audit franchise inclut :",
        auditItems: [
          "Aperçu technique",
          "Carte de demande de recherche (local, zone de service)",
          "Écart de cohérence des localisations",
          "Écart d'autorité de contenu",
          "Vérification de préparation IA",
          "Feuille de route de 90 jours",
        ],
      },
      related: ["healthcare-seo", "legal-immigration-seo", "ecommerce-seo"],
    },
  },

  ui: {
    breadcrumbHome: "Accueil",
    breadcrumbIndustries: "Secteurs",
    heroCtaPrimary: "Audit SEO gratuit",
    heroCtaSecondary: "Réserver un appel",
    heroFigcaption: "Illustratif — les données clients vérifiées ne sont ajoutées qu'avec permission.",
    searchBehaviorEyebrow: "Comportement de recherche",
    searchBehaviorIntentMap: "Carte d'intention",
    painPointsEyebrow: "Friction du marché",
    painPointsScanner: "Scanner de risque",
    painPointsRiskLevel: "Niveau de risque",
    solutionEyebrow: "La solution Taskcover",
    solutionModel: "Modèle opérationnel",
    servicesEyebrow: "Services recommandés",
    servicesTitle: "Les modules qui correspondent à ce secteur.",
    servicesDesc: "Modules de services connectés — pas une liste générique — adaptés à la façon dont ce secteur recherche et convertit.",
    servicesModule: "Module",
    contentAuthorityEyebrow: "Plan de contenu et d'autorité",
    contentAuthorityGrowthSystem: "Système de croissance",
    outcomesEyebrow: "Résultats commerciaux",
    outcomesDesc: "Catégories de résultats — pas de métriques fabriquées. Les résultats vérifiés ne sont ajoutés qu'avec des données attribuables.",
    faqEyebrow: "FAQ",
    faqTitle: "Questions sur {industry}, réponses.",
    ctaEyebrow: "Démarrez votre système de croissance sectorielle",
    ctaAuditPreview: "Aperçu de l'audit",
    ctaIllustrative: "Illustratif — chaque audit est adapté à votre marché et à vos objectifs.",
    selectorViewIndustry: "Voir",
    selectorPriority: "Secteur prioritaire",
    comparisonIndustry: "Secteur",
    bundlesIncludes: "Inclut",
    relatedEyebrow: "Secteurs associés",
    relatedTitle: "Explorez les secteurs associés.",
    exploreIndustry: "Explorer le secteur",
    outcome: "Résultat",
  },
};