/**
 * French services localized content.
 *
 * The hub and the high-visibility per-service fields (h1, positioning,
 * subheadline, summary, meta) are fully translated. Deep body content
 * (problem, approach, deliverables, process, outcomes, faqs) is sourced
 * from the English canonical data and falls back per docs/I18N_STRATEGY.md.
 */

import type { ServicesContent } from "../services.types";

export const services: ServicesContent = {
  hub: {
    eyebrow: "Services",
    h1: "Services de croissance par la recherche conçus pour fonctionner ensemble.",
    positioning:
      "Un seul système connecté pour Google, la recherche IA et le chiffre d'affaires — pas une liste de tâches SEO déconnectées.",
    description:
      "Chaque service Taskcover s'intègre au même système d'exploitation de croissance par la recherche. Vous pouvez activer une compétence ou le système complet ; dans tous les cas, le travail se mesure en visibilité, confiance, prospects et chiffre d'affaires.",
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
    secondaryCta: { label: "Réserver un appel", href: "/book-a-call" },
    connectSection: {
      eyebrow: "Un seul système d'exploitation",
      title: "Comment les services se connectent.",
      description:
        "L'audit nourrit la stratégie. La stratégie façonne le travail technique, le contenu et l'autorité. La préparation à la recherche IA traverse l'ensemble. La CRO et les rapports ferment la boucle vers le chiffre d'affaires.",
    },
    whichServiceSection: {
      eyebrow: "Trouvez votre ajustement",
      title: "Quel service vous convient ?",
      description:
        "Vous ne savez pas par où commencer ? Utilisez les résultats ci-dessous pour trouver le service qui correspond à votre plus grand écart actuel.",
    },
  },
  services: {
    "seo-agency": {
      title: "Stratégie SEO",
      shortLabel: "Stratégie SEO",
      h1: "Stratégie SEO conçue pour Google, la recherche IA et la croissance du chiffre d'affaires.",
      positioning: "Une feuille de route de croissance par la recherche priorisée — pas une liste de tâches SEO.",
      subheadline:
        "Taskcover construit le SEO comme un système de croissance : technique, contenu, autorité et préparation à la recherche IA connectés au chiffre d'affaires, pas aux classements de vanité.",
      summary:
        "Une stratégie SEO intégrée qui aligne le travail technique, le contenu, l'autorité et la recherche IA sur les résultats commerciaux aux États-Unis, au Canada et en Australie.",
      outcomePromise:
        "Une feuille de route claire et priorisée qui relie l'investissement SEO au pipeline et au chiffre d'affaires.",
      metaTitle: "Agence SEO pour Google, recherche IA et croissance du chiffre d'affaires",
      metaDescription:
        "Taskcover est une agence de croissance par la recherche livrant une stratégie SEO pour Google, la recherche IA et le chiffre d'affaires. Technique, contenu, autorité et préparation IA dans un système connecté.",
    },
    "technical-seo": {
      title: "SEO technique",
      shortLabel: "SEO technique",
      h1: "SEO technique qui rend votre site plus facile à explorer, comprendre, indexer et développer.",
      positioning: "Une base rapide, explorable, indexable, que Google et l'IA peuvent créditer.",
      subheadline:
        "Taskcover diagnostique et corrige les problèmes techniques qui bloquent la visibilité — de l'exploration et l'indexation à l'architecture, aux Core Web Vitals, au schéma et au rendu JavaScript.",
      summary:
        "SEO technique de bout en bout : explorabilité, indexation, architecture du site, Core Web Vitals, données structurées, SEO JavaScript et migrations.",
      outcomePromise:
        "Une base technique qui lève les plafonds de croissance et réduit les risques pour le travail futur de contenu et d'autorité.",
      metaTitle: "Services SEO techniques pour l'exploration, l'indexation et la croissance",
      metaDescription:
        "Services SEO techniques couvrant l'explorabilité, l'indexation, l'architecture du site, les Core Web Vitals, le schéma, le SEO JavaScript et les migrations aux États-Unis, au Canada et en Australie.",
    },
    "ai-search-optimization": {
      title: "Optimisation pour la recherche IA",
      shortLabel: "Recherche IA",
      h1: "Optimisation pour la recherche IA pour les marques qui veulent être comprises, citées et choisies.",
      positioning: "Visibilité dans les AI Overviews, ChatGPT et les réponses LLM — sans fausses garanties.",
      subheadline:
        "Taskcover rend votre marque, vos entités et votre contenu faciles à découvrir, comprendre et citer pour les surfaces de recherche propulsées par l'IA — en complétant, sans remplacer, votre SEO de base.",
      summary:
        "Préparation à la recherche IA : AI Overviews, découvabilité LLM, clarté des entités, contenu structuré et autorité digne de citation.",
      outcomePromise: "Une présence plus claire et plus structurée sur les surfaces de réponse IA.",
      metaTitle: "Services d'optimisation pour la recherche IA (AI Overviews et LLM)",
      metaDescription:
        "Services d'optimisation pour la recherche IA pour les AI Overviews, ChatGPT et les réponses LLM. Contenu structuré, clarté des entités et autorité digne de citation — sans fausses garanties.",
    },
    "content-marketing": {
      title: "Marketing de contenu",
      shortLabel: "Contenu",
      h1: "Systèmes de contenu conçus pour l'autorité thématique, la confiance et la conversion.",
      positioning: "Des clusters de contenu pilotés par des experts qui capturent l'intention et la convertissent.",
      subheadline:
        "Taskcover conçoit des systèmes de contenu autour de l'intention des acheteurs — clusters thématiques, briefs pilotés par des experts, articles utiles, maillage interne, actualisations et pages de conversion.",
      summary:
        "Marketing de contenu piloté par l'intention : stratégie, clusters thématiques, briefs d'experts, articles utiles, maillage interne, actualisations et contenu de conversion.",
      outcomePromise: "Une autorité thématique plus forte et un contenu qui transforme l'intention en pipeline.",
      metaTitle: "Services de marketing de contenu SEO pour l'autorité thématique",
      metaDescription:
        "Services de marketing de contenu pour l'autorité thématique, la confiance et la conversion. Clusters pilotés par l'intention, briefs d'experts, maillage interne, actualisations et contenu de conversion.",
    },
    "digital-pr-link-building": {
      title: "RP numériques et création de liens",
      shortLabel: "RP numériques",
      h1: "Construction d'autorité par des mentions pertinentes, des liens et des signaux de confiance.",
      positioning: "Autorité acquise auprès de publications et de partenaires réels — jamais de spam.",
      subheadline:
        "Taskcover bâtit l'autorité avec des RP numériques, des liens acquis, des mentions de marque, de la validation tierce, des articles de presse et des commentaires d'experts — jamais de tactiques de backlinks spammy.",
      summary:
        "Construction d'autorité via RP numériques, liens acquis, mentions de marque, validation tierce, articles de presse et commentaires d'experts.",
      outcomePromise: "Des signaux d'autorité plus clairs qui renforcent la visibilité et la confiance.",
      metaTitle: "Services de RP numériques et création de liens pour l'autorité SEO",
      metaDescription:
        "Services de RP numériques et création de liens qui acquièrent de l'autorité par des mentions pertinentes, des articles de presse et des commentaires d'experts. Pas de backlinks spammy — juste de vrais signaux de confiance.",
    },
    "local-seo": {
      title: "SEO local",
      shortLabel: "SEO local",
      h1: "SEO local pour les marques qui doivent gagner la demande de ville, de zone de service et de carte.",
      positioning: "Gagnez le pack local, les cartes et les surfaces d'avis.",
      subheadline:
        "Taskcover construit des systèmes SEO locaux pour Google Business Profile, les pages de localisation, les avis, les pages d'atterrissage locales, le SEO multi-sites, les citations et la demande de zone de service.",
      summary:
        "SEO local couvrant Google Business Profile, les pages de localisation, les avis, les pages d'atterrissage locales, le SEO multi-sites, les citations et le SEO de zone de service.",
      outcomePromise: "Une présence plus forte dans le pack local, les cartes et les surfaces d'avis.",
      metaTitle: "Services SEO locaux pour marques multi-sites et de zone de service",
      metaDescription:
        "Services SEO locaux pour Google Business Profile, pages de localisation, avis, SEO multi-sites, citations et demande de zone de service aux États-Unis, au Canada et en Australie.",
    },
    "ecommerce-seo": {
      title: "SEO e-commerce",
      shortLabel: "SEO e-commerce",
      h1: "SEO e-commerce pour catégories, produits et demande de recherche à intention d'achat.",
      positioning: "Visibilité des catégories et produits axée sur le chiffre d'affaires.",
      subheadline:
        "Taskcover construit des systèmes SEO e-commerce pour l'architecture des catégories, l'optimisation des pages produits, la navigation à facettes, le SEO technique, les hubs de contenu, le maillage interne et les parcours de conversion.",
      summary:
        "SEO e-commerce couvrant l'architecture des catégories, les pages produits, la navigation à facettes, le SEO technique, les hubs de contenu, le maillage interne et les parcours de conversion.",
      outcomePromise: "Plus de demande d'achat qualifiée et des parcours de conversion plus clairs.",
      metaTitle: "Services SEO e-commerce pour catégories et produits",
      metaDescription:
        "Services SEO e-commerce pour l'architecture des catégories, l'optimisation des pages produits, la navigation à facettes, le SEO technique, les hubs de contenu et les parcours de conversion aux États-Unis, au Canada et en Australie.",
    },
    "international-seo": {
      title: "SEO international",
      shortLabel: "SEO international",
      h1: "SEO international pour les marques en concurrence sur plusieurs marchés, langues et régions.",
      positioning: "Un seul système, adapté à chaque marché.",
      subheadline:
        "Taskcover construit le SEO international pour les États-Unis, le Canada et l'Australie — contenu spécifique au marché, hreflang si pertinent, recherche de mots-clés régionaux, localisation et architecture de site internationale.",
      summary:
        "SEO international couvrant la stratégie USA/Canada/Australie, recherche de mots-clés régionaux, localisation, hreflang et architecture de site internationale.",
      outcomePromise: "Une présence adaptée à chaque marché sans contenu dupliqué.",
      metaTitle: "Services SEO internationaux pour États-Unis, Canada et Australie",
      metaDescription:
        "Services SEO internationaux pour les marques en concurrence aux États-Unis, au Canada et en Australie. Contenu spécifique au marché, hreflang, recherche de mots-clés régionaux et localisation.",
    },
    "seo-audit": {
      title: "Audit SEO",
      shortLabel: "Audit SEO",
      h1: "Audits SEO qui transforment les problèmes cachés en feuille de route de croissance priorisée.",
      positioning: "Un aperçu clair et priorisé — et un plan de 90 jours pour agir.",
      subheadline:
        "L'audit de croissance SEO de Taskcover couvre l'aperçu technique, la carte des opportunités de mots-clés, l'écart de visibilité concurrentiel, l'écart d'autorité de contenu, la vérification de la préparation à la recherche IA et une feuille de route sur 90 jours.",
      summary:
        "Audit de croissance SEO axé conversion : aperçu technique, carte d'opportunités de mots-clés, écart de visibilité concurrentiel, écart d'autorité de contenu, vérification de préparation IA et feuille de route sur 90 jours.",
      outcomePromise: "De la clarté sur où agir en premier — et un plan de 90 jours pour combler les plus grands écarts.",
      metaTitle: "Audit SEO gratuit et feuille de route de croissance | Taskcover Agency",
      metaDescription:
        "Obtenez un audit de croissance SEO gratuit de Taskcover Agency. Aperçu technique, carte d'opportunités de mots-clés, écart de visibilité concurrentiel, écart d'autorité de contenu, vérification de préparation IA et feuille de route sur 90 jours.",
    },
    "ppc-management": {
      title: "Gestion PPC",
      shortLabel: "PPC",
      h1: "Gestion PPC alignée avec la croissance de la recherche organique — pas du paid media aléatoire.",
      positioning: "Capture de demande sur Google Ads et Microsoft Ads, rattachée à votre système de recherche.",
      subheadline:
        "Taskcover gère le PPC comme partie de la croissance par la recherche : PPC local, PPC global, annonces de recherche, alignement des pages d'atterrissage, suivi des conversions et intelligence de recherche payante + organique fonctionnant ensemble.",
      summary:
        "Gestion PPC couvrant le PPC local, le PPC global, les annonces de recherche, l'alignement des pages d'atterrissage, le suivi des conversions et l'intelligence de recherche payante + organique.",
      outcomePromise: "Recherche payante qui capture la demande efficacement et renforce votre croissance organique.",
      metaTitle: "Services de gestion PPC | Google Ads et Microsoft Ads",
      metaDescription:
        "Services de gestion PPC pour le PPC local, le PPC global, les annonces de recherche, l'alignement des pages d'atterrissage et le suivi des conversions — alignés avec la croissance de la recherche organique aux États-Unis, au Canada et en Australie.",
    },
    "seo-mentor-service": {
      title: "Service de mentorat SEO",
      shortLabel: "Mentorat SEO",
      h1: "Mentorat SEO 1:1, coaching stratégique et conseil pour les fondateurs et les équipes.",
      positioning: "Conseil SEO d'expert pour les fondateurs, CMO et équipes internes — pas une boîte noire.",
      subheadline:
        "Taskcover fournit un mentorat SEO 1:1, conseil pour fondateurs et CMO, formation d'équipes internes, conseils SEO techniques, revue de stratégie de contenu, conseils en recherche IA et revues stratégiques mensuelles.",
      summary:
        "Mentorat SEO couvrant le coaching 1:1, conseil fondateur/CMO, formation d'équipe, conseils SEO techniques, revue de stratégie de contenu, conseils en recherche IA et revues stratégiques mensuelles.",
      outcomePromise: "Un soutien décisionnel de croissance par la recherche pour que votre équipe exécute avec confiance.",
      metaTitle: "Service de mentorat SEO | Coaching 1:1, conseil et formation d'équipe",
      metaDescription:
        "Service de mentorat SEO pour les fondateurs, CMO et équipes internes. Coaching 1:1, conseil stratégique, conseils SEO techniques, revue de contenu, conseils en recherche IA et revues stratégiques mensuelles.",
    },
  },
  ui: {
    exploreService: "Découvrir le service",
    module: "Module",
    outcome: "Résultat",
    auditPreview: "Aperçu de l'audit",
    ninetyDayPlan: "Plan sur 90 jours",
    illustrative: "Illustratif — chaque audit est adapté à votre marché et à vos objectifs.",
    allServices: "Tous les services",
    allServicesTitle: "Onze services connectés. Un système d'exploitation.",
    allServicesDesc:
      "Activez une compétence ou le système complet. Dans tous les cas, le travail se mesure en visibilité, confiance, prospects et chiffre d'affaires.",
    notSureEyebrow: "Commencez par une vision claire",
    notSureTitle: "Vous ne savez pas par quel service commencer ?",
    notSureDesc:
      "L'audit de croissance SEO gratuit identifie vos plus grands écarts de visibilité, d'autorité et de conversion — et recommande où concentrer vos efforts en premier.",
    decisionVisibilityQ: "Besoin de visibilité ?",
    decisionVisibilityA:
      "Commencez par la Stratégie SEO ou le SEO technique pour bâtir une base explorable et visible.",
    decisionCaptureQ: "Besoin de capture de demande ?",
    decisionCaptureA: "Le PPC et le SEO local capturent la demande à forte intention rapidement — localement et globalement.",
    decisionAuthorityQ: "Besoin d'autorité ?",
    decisionAuthorityA:
      "Le marketing de contenu et les RP numériques bâtissent les signaux que Google et les surfaces IA citent.",
    decisionCapabilityQ: "Besoin de capacité d'équipe ?",
    decisionCapabilityA:
      "Le service de mentorat SEO offre aux fondateurs et équipes internes un conseil de niveau senior.",
  },
};