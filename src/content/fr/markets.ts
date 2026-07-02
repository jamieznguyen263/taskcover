/**
 * French markets content — hub + all 3 markets + UI strings.
 *
 * Traduction professionnelle, non littérale. Les slugs restent en anglais.
 * Aucune métrique, témoignage, prix ou bureau inventé.
 */

import type { MarketsContent } from "@/content/markets.types";

export const markets: MarketsContent = {
  hub: {
    eyebrow: "Marchés",
    h1: "Systèmes de recherche régionaux pour les États-Unis, le Canada et l'Australie.",
    positioning:
      "Un système de croissance de recherche connecté, adapté à la façon dont chaque marché recherche, fait confiance et achète.",
    description:
      "Chaque marché a une concurrence SERP, des signaux de confiance, une demande locale, des nuances linguistiques et des comportements de recherche IA différents. Taskcover adapte la stratégie, le contenu, la technique, l'autorité et le PPC au marché où vous évoluez — sans dupliquer un plan générique partout.",
    primaryCta: { label: "Audit SEO gratuit", href: "/free-seo-audit" },
    secondaryCta: { label: "Réserver un appel", href: "/book-a-call" },
    heroFigcaption:
      "Commande du marché de la recherche mondiale — demande, confiance et maturité IA par région.",
    selectorSection: {
      eyebrow: "Carte d'intelligence régionale",
      title: "Choisissez le marché où vous évoluez.",
      description:
        "Chaque panneau résume le comportement de recherche, la pression concurrentielle et les leviers où Taskcover crée le plus de valeur.",
    },
    comparisonSection: {
      eyebrow: "Comparaison des marchés",
      title: "Aucun marché ne recherche de la même façon.",
      description:
        "L'intensité concurrentielle, l'importance du SEO local, le besoin bilingue et l'opportunité de recherche IA varient fortement entre les États-Unis, le Canada et l'Australie. Cette matrice montre où chaque marché récompense une emphase différente.",
      dimensions: [
        { key: "competition", label: "Intensité concurrentielle" },
        { key: "local", label: "Importance du SEO local" },
        { key: "national", label: "Opportunité SEO national" },
        { key: "multilingual", label: "Besoin bilingue / multilingue" },
        { key: "ppc", label: "Capture de demande PPC" },
        { key: "trust", label: "Sensibilité à la confiance" },
        { key: "ai", label: "Opportunité de recherche IA" },
      ],
    },
    growthSystemsSection: {
      eyebrow: "Systèmes de croissance par marché",
      title: "Un système de croissance recommandé par marché.",
      description:
        "Chaque marché relie un mélange différent de services, d'industries et de priorités dans un seul système d'exploitation — pas la même pile copiée-collée partout.",
      groups: [
        {
          slug: "usa-seo-agency",
          label: "Système de croissance États-Unis",
          description:
            "Couverture nationale + locale + multi-sites, capture de demande PPC, autorité SaaS et eCommerce, et visibilité de recherche IA.",
          slugs: [
            "seo-agency",
            "technical-seo",
            "ai-search-optimization",
            "ppc-management",
            "local-seo",
            "ecommerce-seo",
          ],
        },
        {
          slug: "canada-seo-agency",
          label: "Système de croissance Canada",
          description:
            "Recherche bilingue anglais/français, SEO international, autorité éducation et immigration, et clarté d'entité pour l'IA.",
          slugs: [
            "international-seo",
            "content-marketing",
            "technical-seo",
            "ai-search-optimization",
            "local-seo",
            "seo-mentor-service",
            "seo-audit",
          ],
        },
        {
          slug: "australia-seo-agency",
          label: "Système de croissance Australie",
          description:
            "Niches de service à forte valeur, concurrence locale + nationale, eCommerce et franchise, et capture PPC pour les SERPs commerciales.",
          slugs: [
            "seo-agency",
            "local-seo",
            "technical-seo",
            "content-marketing",
            "ppc-management",
            "ecommerce-seo",
            "seo-audit",
          ],
        },
      ],
    },
    ctaSection: {
      eyebrow: "Obtenez un audit spécifique à votre marché",
      title: "Voyez comment vous vous situez dans votre marché.",
      description:
        "Obtenez un audit de croissance SEO spécifique au marché : paysage de recherche, instantané technique, écart de visibilité concurrentiel, opportunité de contenu et d'autorité, maturité de recherche IA, et feuille de route sur 90 jours.",
      auditItems: [
        "Analyse du paysage de recherche du marché",
        "Instantané technique",
        "Écart de visibilité concurrentiel",
        "Opportunité contenu & autorité",
        "Maturité de recherche IA",
        "Feuille de route 90 jours",
      ],
    },
  },

  markets: {
    "usa-seo-agency": {
      slug: "usa-seo-agency",
      icon: "usa",
      name: "États-Unis",
      regionLabel: "Amérique du Nord",
      eyebrow: "Agence SEO États-Unis",
      h1: "SEO pour le marché de recherche le plus concurrentiel au monde.",
      metaTitle: "Agence SEO États-Unis pour Google, recherche IA et croissance",
      metaDescription:
        "Services d'agence SEO États-Unis pour les SERPs nationales et locales hautement concurrentielles. SEO technique, autorité de contenu, maturité recherche IA, capture PPC et croissance multi-sites — sans fausses garanties de classement.",
      heroDescription:
        "Les États-Unis sont le marché de recherche le plus vaste et le plus concurrentiel que Taskcover dessert. Les SERPs nationales sont saturées, les packs locaux décident de la demande à forte intention, et les AI Overviews transforment la façon dont les acheteurs recherchent. Nous construisons des systèmes SEO américains qui relient autorité nationale, précision locale et maturité IA dans un seul moteur de croissance.",
      marketContext:
        "La demande de recherche américaine est vaste, rapide et intensément concurrentielle. Les acheteurs s'attendent à des marques en haut de Google, présentes dans les réponses IA, et crédibles grâce à une validation tierce de confiance. Les marques multi-sites et franchise font face à la complexité de faire évoluer leur présence locale sans créer de pages satellite.",
      searchLandscape: {
        title: "Le paysage de recherche américain récompense l'autorité et la profondeur.",
        description:
          "Les SERPs nationales sont dominées par des éditeurs établis, des marketplaces et des marques à gros budget. Les packs locaux décident de la demande à forte intention. Les AI Overviews résument de plus en plus les requêtes commerciales et informationnelles — favorisant un contenu structuré et digne de citation.",
        facets: [
          { label: "SERPs nationales", detail: "Saturées, axées sur l'autorité ; les termes de catégorie et de comparaison sont très disputés." },
          { label: "Packs locaux", detail: "Décident de la demande à forte intention dans les villes, métros et zones de service." },
          { label: "AI Overviews", detail: "Résument les requêtes commerciales et de recherche ; récompensent un contenu structuré et clair." },
          { label: "PPC commercial", detail: "Enchères publicitaires concurrentielles ; la capture payante est souvent requise." },
        ],
      },
      buyerBehavior: {
        title: "Les acheteurs américains recherchent beaucoup avant de convertir.",
        description:
          "Les acheteurs américains comparent les options sur Google, les outils IA, les avis et les marketplaces. La confiance se construit par des signaux d'autorité, un contenu expert et une validation tierce — pas par des points de contact uniques.",
        stages: [
          { stage: "Sensibilisation", label: "Recherche de catégorie", description: "Les acheteurs recherchent des termes larges de catégorie et de comparaison sur Google et les outils IA." },
          { stage: "Considération", label: "Comparaison", description: "Les sélections se forment via les avis, le contenu expert et les mentions tierces." },
          { stage: "Validation", label: "Vérifications de confiance", description: "Les titres, preuves et signaux d'autorité valident la décision." },
          { stage: "Conversion", label: "Décision", description: "Les requêtes locales ou commerciales à forte intention convertissent via des pages et des appels." },
        ],
      },
      localSeoAngle: {
        title: "Le SEO local est souvent là que le revenu américain se concrétise.",
        description:
          "La demande de ville, métro et zone de service se décide dans le pack local et sur Google Business Profile. Les marques multi-sites et franchise ont besoin d'architectures de localisation uniques et évolutives — pas de pages dupliquées minces.",
      },
      nationalSeoAngle: {
        title: "Le SEO national est un concours d'autorité.",
        description:
          "Les SERPs nationales de catégorie et de comparaison récompensent l'autorité thématique, les données structurées et le contenu digne de citation. Concourir signifie construire un vrai système de contenu et d'autorité, pas des mots-clés isolés.",
      },
      aiSearchOpportunity: {
        title: "La recherche IA évolue le plus vite aux États-Unis.",
        description:
          "Les AI Overviews et les réponses LLM sont largement utilisés par les acheteurs américains. Un contenu structuré, la clarté des entités et une validation tierce augmentent les chances d'être cité — personne ne peut garantir des citations spécifiques.",
      },
      multilingualAngle: {
        title: "Opportunité du marché hispanophone et de la langue espagnole.",
        description:
          "Taskcover prend en charge le contenu espagnol, ce qui peut aider à servir les audiences hispaniques américaines. Nous ne surestimons pas l'expertise du marché hispanique ou la présence locale ; nous construisons un contenu et une architecture prêts pour l'espagnol avec soin.",
      },
      marketChallenges: {
        title: "Où se situe la friction SEO américaine.",
        description:
          "Les parties les plus difficiles de la recherche américaine sont la saturation, la vitesse de changement et l'écart entre trafic et revenu. Ce sont les points de friction que nous scanons en premier.",
        items: [
          { label: "Saturation des SERPs nationales", detail: "Les éditeurs établis et les marques à gros budget dominent les termes de catégorie.", severity: "high" },
          { label: "Concurrence du pack local", detail: "Demande à forte intention décidée par GBP, avis et signaux de localisation.", severity: "high" },
          { label: "Duplication multi-sites", detail: "Les marques en franchise risquent des pages satellite et des données incohérentes.", severity: "medium" },
          { label: "Déplacement par AI Overview", detail: "Les résumés peuvent réduire le clic vers les résultats classiques.", severity: "medium" },
          { label: "Écart de confiance", detail: "Le trafic sans signaux d'autorité convertit rarement aux États-Unis.", severity: "high" },
        ],
      },
      taskcoverApproach: {
        title: "Un système d'exploitation régional pour la recherche américaine.",
        description:
          "Nous relions autorité nationale, précision locale, maturité IA et capture PPC dans un seul système — afin que l'organique et le payant se renforcent mutuellement au lieu de se concurrencer.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation, architecture et Core Web Vitals adaptés aux grands catalogues et sites multi-sites américains." },
          { label: "Autorité nationale", description: "Clusters thématiques, contenu expert et données structurées pour les SERPs nationales concurrentielles." },
          { label: "Précision locale", description: "Pages de localisation et de zone de service uniques et évolutives qui évitent les pages satellite." },
          { label: "Maturité IA", description: "Clarté des entités et contenu digne de citation pour les AI Overviews et les réponses LLM." },
          { label: "Capture PPC", description: "Capture de demande pour les SERPs commerciales concurrentielles où l'organique évolue lentement." },
        ],
      },
      recommendedIndustries: [
        { slug: "saas-seo", reason: "Les SERPs de catégorie et de comparaison sont au cœur de la demande SaaS américaine.", fit: 5 },
        { slug: "ecommerce-seo", reason: "Marketplaces et catalogues à forte intention d'achat, vastes et concurrentiels.", fit: 5 },
        { slug: "healthcare-seo", reason: "Demande locale et nationale régulée à forte confiance.", fit: 4 },
        { slug: "legal-immigration-seo", reason: "Intention de type de cas et de juridiction avec de forts besoins de confiance.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Évolution multi-sites et franchise à travers les métros américains.", fit: 5 },
      ],
      fitSummary: {
        title: "Pourquoi ces industries correspondent au marché américain",
        rows: [
          { label: "Forme de demande", value: "Catégorie nationale + concurrence intense du pack local." },
          { label: "Niveau de confiance", value: "Élevé — contenu expert, avis et signaux d'autorité." },
          { label: "Exposition IA", value: "Forte — AI Overviews largement utilisés par les acheteurs américains." },
          { label: "Échelle", value: "Grands catalogues, multi-sites et complexité de franchise." },
        ],
      },
      recommendedServices: [
        "seo-agency",
        "technical-seo",
        "content-marketing",
        "ai-search-optimization",
        "ppc-management",
        "local-seo",
        "ecommerce-seo",
      ],
      growthSystem: {
        title: "La pile de croissance États-Unis",
        description:
          "Un système connecté pour concourir dans les SERPs nationales saturées tout en gagnant localement et en capturant la demande commerciale avec le PPC.",
        groups: [
          { label: "Fondation", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Autorité", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local et échelle", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Capture de demande", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenu + autorité pour la crédibilité américaine.",
        description:
          "La recherche américaine récompense les clusters de contenu pilotés par des experts et la validation tierce. Nous construisons une autorité thématique et des actifs dignes de citation qui soutiennent à la fois Google et les surfaces IA.",
        clusters: [
          "Construire des piliers de catégorie et de comparaison autour de l'intention de l'acheteur.",
          "Créer un contenu structuré et expert que l'IA peut résumer.",
          "Relier les clusters aux pages de conversion avec un maillage interne solide.",
        ],
        authority: [
          "Obtenir des mentions pertinentes sur des publications que les acheteurs américains trustent.",
          "Positionner les porte-parole pour des commentaires d'expert.",
          "Construire des actifs dignes de citation que les modèles IA préfèrent référencer.",
        ],
      },
      ppcOpportunity: {
        title: "Le PPC capture la demande que l'organique ne peut pas atteindre assez vite.",
        description:
          "Dans les SERPs commerciales américaines saturées, la recherche payante capture la demande qualifiée pendant que l'organique évolue. Nous alignons le PPC sur la même carte d'intention que le SEO afin qu'ils se renforcent mutuellement.",
      },
      trustSignals:
        "Nous n'utilisons pas de faux témoignages ou de métriques de cas inventées. Nous construisons une autorité réelle via un contenu expert, des données structurées et des mentions tierces pertinentes.",
      outcomes: [
        { label: "Couverture nationale plus claire", description: "SERPs de catégorie et de comparaison traitées avec une autorité thématique." },
        { label: "Visibilité locale plus forte", description: "Pages de localisation uniques et évolutives sans risque de page satellite." },
        { label: "Meilleure demande qualifiée", description: "Contenu axé sur l'intention et PPC atteignent les acheteurs plus tôt." },
        { label: "Signaux de confiance plus forts", description: "Contenu expert et mentions pertinentes renforcent la crédibilité." },
        { label: "Meilleure maturité IA", description: "Contenu structuré et entités claires pour les surfaces IA." },
        { label: "Priorisation plus claire", description: "Travail ordonné par impact sur le revenu, pas seulement par volume de recherche." },
      ],
      faqs: [
        { q: "Taskcover a-t-il son siège aux États-Unis ?", a: "Taskcover sert des clients aux États-Unis. Nous ne revendiquons pas de siège américain ou de bureaux physiques sauf si cela est confirmé. Notre travail est construit autour du comportement de recherche, de la demande et des signaux de confiance américains." },
        { q: "Garantissez-vous les classements aux États-Unis ?", a: "Non. Nous nous concentrons sur une visibilité durable, l'autorité et les résultats de revenu que nous pouvons réellement influencer et mesurer — pas des garanties de classement." },
        { q: "Pouvez-vous prendre en charge le contenu en espagnol pour les États-Unis ?", a: "Oui. Taskcover prend en charge le contenu espagnol, ce qui peut aider à servir les audiences hispaniques américaines. Nous ne surestimons pas l'expertise du marché hispanique ou la présence locale." },
        { q: "Gérez-vous le SEO multi-sites et franchise aux États-Unis ?", a: "Oui. Nous construisons des architectures de localisation et de zone de service uniques et évolutives qui évitent les pages satellite et maintiennent les données cohérentes." },
        { q: "La recherche IA est-elle incluse pour les États-Unis ?", a: "Oui. Les acheteurs américains utilisent massivement les AI Overviews, donc le contenu structuré, la clarté des entités et l'autorité digne de citation sont intégrés dès le départ." },
      ],
      finalCta: {
        title: "Obtenez un audit de croissance SEO États-Unis.",
        description:
          "Voyez où vous vous situez à travers les SERPs nationales, les packs locaux, les AI Overviews et la capture de demande PPC — avec une feuille de route priorisée sur 90 jours.",
        auditLabel: "L'audit de croissance SEO États-Unis inclut",
        auditItems: [
          "Analyse du paysage (national + local + IA)",
          "Écart de visibilité concurrentiel",
          "Instantané technique",
          "Opportunité contenu & autorité",
          "Maturité de recherche IA",
          "Feuille de route 90 jours",
        ],
      },
      related: ["canada-seo-agency", "australia-seo-agency"],
    },

    "canada-seo-agency": {
      slug: "canada-seo-agency",
      icon: "canada",
      name: "Canada",
      regionLabel: "Amérique du Nord",
      eyebrow: "Agence SEO Canada",
      h1: "SEO bilingue, provincial et axé sur la confiance pour le Canada.",
      metaTitle: "Agence SEO Canada pour recherche anglais/français et IA",
      metaDescription:
        "Services d'agence SEO Canada pour la recherche bilingue anglais/français, la visibilité locale et nationale, l'éducation, l'immigration, la santé et la franchise. SEO international, localisation et maturité IA — sans fausses garanties.",
      heroDescription:
        "Le Canada est un marché de recherche bilingue et provincial. La demande en anglais et en français se comporte différemment, le Québec a ses propres modèles de recherche et de confiance, et les acheteurs s'attendent à un contenu clair, crédible et localement pertinent. Nous construisons des systèmes SEO canadiens qui respectent la langue, la région et la confiance — sans surestimer l'expertise juridique ou de conformité québécoise.",
      marketContext:
        "La demande de recherche canadienne se répartit entre l'anglais et le français, avec des nuances provinciales au Québec et dans les grands métros. L'éducation, l'immigration/juridique, la santé et les services professionnels sont des secteurs à forte confiance où l'autorité et la clarté comptent plus que le volume.",
      searchLandscape: {
        title: "Le paysage de recherche canadien est bilingue et régional.",
        description:
          "Google domine, mais les SERPs en français au Québec se comportent différemment des SERPs en anglais dans le reste du Canada. Le SEO international, le hreflang et la logique de localisation décident si la bonne page gagne le bon public.",
        facets: [
          { label: "SERPs anglais", detail: "Demande nationale plus large, similaire aux modèles américains mais moins saturée." },
          { label: "Français (Québec)", detail: "Langue, culture et modèles de confiance distincts ; pas seulement une traduction." },
          { label: "Packs locaux", detail: "Demande de ville et provinciale à travers les grands métros." },
          { label: "Surfaces IA", detail: "En croissance ; récompensent la clarté des entités et un contenu bilingue bien structuré." },
        ],
      },
      buyerBehavior: {
        title: "Les acheteurs canadiens s'attendent à une pertinence locale et à la confiance.",
        description:
          "Les acheteurs recherchent dans leur langue préférée, s'attendent à un contenu régionalement pertinent et valident via des signaux d'autorité. Les acheteurs d'immigration, d'éducation et de santé sont particulièrement sensibles à la confiance.",
        stages: [
          { stage: "Sensibilisation", label: "Recherche par langue", description: "Les acheteurs recherchent en anglais ou en français, attendant un contenu pertinent et bien rédigé." },
          { stage: "Considération", label: "Nuance provinciale", description: "La région, le statut d'immigration et les fournisseurs locaux façonnent les sélections." },
          { stage: "Validation", label: "Vérifications d'autorité", description: "Titres, contenu expert et signaux de confiance locaux valident les décisions." },
          { stage: "Conversion", label: "Prise de contact locale", description: "Appels, formulaires et consultations génèrent la conversion dans les secteurs à forte confiance." },
        ],
      },
      localSeoAngle: {
        title: "Le SEO local s'étend sur les provinces et métros.",
        description:
          "La demande locale canadienne est répartie sur les grands métros et provinces. GBP, citations et données de localisation cohérentes comptent — surtout pour les marques franchise et multi-sites opérant en bilingue.",
      },
      nationalSeoAngle: {
        title: "Le SEO national doit respecter la langue.",
        description:
          "La demande nationale en anglais et en français nécessite un contenu distinct, pas des traductions dupliquées. Un bon hreflang et une architecture de locale empêchent la mauvaise page de se classer pour le mauvais public.",
      },
      aiSearchOpportunity: {
        title: "L'IA récompense la clarté des entités au Canada.",
        description:
          "Les AI Overviews et réponses LLM canadiens favorisent un contenu bilingue, structuré et clair. Les actifs dignes de citation et des entités de marque cohérentes améliorent les chances d'être référencé.",
      },
      multilingualAngle: {
        title: "La recherche bilingue anglais/français est au cœur du Canada.",
        description:
          "Taskcover prend en charge le contenu français, ce qui peut aider à servir les audiences canadiennes et québécoises. Nous ne surestimons pas l'expertise juridique ou de conformité spécifique au Québec ; nous construisons l'architecture de localisation et un contenu français bien rédigé avec soin.",
      },
      marketChallenges: {
        title: "Où se situe la friction SEO canadienne.",
        description:
          "Les parties les plus difficiles de la recherche canadienne sont l'exactitude bilingue, la nuance provinciale et l'évitement de la cannibalisation de contenu dupliqué entre l'anglais et le français.",
        items: [
          { label: "Duplication bilingue", detail: "Les pages traduites se cannibalisent sans bon hreflang.", severity: "high" },
          { label: "Nuance québécoise", detail: "La demande francophone est culturelle, pas uniquement une traduction.", severity: "medium" },
          { label: "Fragmentation provinciale", detail: "La demande et les concurrents varient fortement par province et métro.", severity: "medium" },
          { label: "Écarts de confiance", detail: "Les acheteurs d'éducation, d'immigration et de santé sont très sensibles à la confiance.", severity: "high" },
          { label: "Clarté des entités", detail: "Les surfaces IA peinent avec des entités de marque bilingues incohérentes.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "Un système d'exploitation régional pour la recherche canadienne.",
        description:
          "Nous relions le SEO international, le contenu bilingue, la précision locale et la clarté des entités IA afin que la demande anglaise et française soit correctement servie — pas dupliquée.",
        layers: [
          { label: "Architecture internationale", description: "Structure de locale et hreflang pour que la bonne page gagne le bon public." },
          { label: "Contenu bilingue", description: "Contenu anglais et français bien rédigé, pas une traduction automatique." },
          { label: "Précision locale", description: "SEO local provincial et métro avec des données cohérentes." },
          { label: "Clarté des entités", description: "Entités de marque bilingues cohérentes pour les surfaces IA." },
          { label: "Renforcement de la confiance", description: "Contenu expert et signaux d'autorité canadiens pertinents." },
        ],
      },
      recommendedIndustries: [
        { slug: "education-seo", reason: "Demande à forte confiance et cycle long au cœur de la recherche canadienne.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "Intention de type de cas et de juridiction avec de forts besoins de confiance.", fit: 5 },
        { slug: "healthcare-seo", reason: "Demande locale et nationale axée sur la confiance.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Évolution franchise multi-sites et bilingue.", fit: 4 },
        { slug: "ecommerce-seo", reason: "Intention d'achat nationale et transfrontalière en croissance.", fit: 3 },
      ],
      fitSummary: {
        title: "Pourquoi ces industries correspondent au marché canadien",
        rows: [
          { label: "Forme de demande", value: "Bilingue, provinciale et axée sur la confiance." },
          { label: "Niveau de confiance", value: "Très élevé dans éducation, immigration et santé." },
          { label: "Exposition IA", value: "En croissance — la clarté des entités et la structure bilingue comptent." },
          { label: "Échelle", value: "Complexité nationale + provinciale + bilingue." },
        ],
      },
      recommendedServices: [
        "international-seo",
        "content-marketing",
        "technical-seo",
        "ai-search-optimization",
        "local-seo",
        "seo-mentor-service",
        "seo-audit",
      ],
      growthSystem: {
        title: "La pile de croissance Canada",
        description:
          "Un système construit autour de l'exactitude bilingue, de l'architecture internationale et des secteurs à forte confiance.",
        groups: [
          { label: "Fondation", slugs: ["international-seo", "technical-seo", "seo-audit"] },
          { label: "Autorité", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local et échelle", slugs: ["local-seo"] },
          { label: "Conseil", slugs: ["seo-mentor-service"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenu + autorité pour la confiance canadienne.",
        description:
          "Les acheteurs canadiens récompensent le contenu bilingue piloté par des experts et des signaux d'autorité crédibles. Nous construisons des clusters qui fonctionnent dans les deux langues et soutiennent les citations IA.",
        clusters: [
          "Créer des piliers bilingues autour de l'intention de l'acheteur, pas des traductions.",
          "Structurer le contenu pour que les surfaces IA puissent analyser les entités dans les deux langues.",
          "Relier les clusters aux chemins de conversion provinciaux et locaux.",
        ],
        authority: [
          "Obtenir des mentions pertinentes sur des publications et communautés canadiennes.",
          "Positionner des porte-parole bilingues pour des commentaires d'expert.",
          "Construire des actifs dignes de citation pour les audiences anglaises et françaises.",
        ],
      },
      ppcOpportunity: {
        title: "Le PPC soutient la capture de demande à travers les marchés linguistiques.",
        description:
          "La recherche payante peut capturer la demande qualifiée dans des secteurs canadiens concurrentiels pendant que l'organique évolue, avec des campagnes structurées autour de la langue et de la région.",
      },
      trustSignals:
        "Nous n'utilisons pas de faux témoignages ou de métriques de cas inventées. Nous construisons une autorité réelle via un contenu expert bilingue, des données structurées et des mentions canadiennes pertinentes.",
      outcomes: [
        { label: "Bonne page, bon public", description: "Demande anglaise et française servie par la bonne page localisée." },
        { label: "Visibilité provinciale plus forte", description: "Couverture locale et nationale qui respecte la région." },
        { label: "Meilleure demande qualifiée", description: "Contenu axé sur la confiance atteint les acheteurs à forte intention." },
        { label: "Signaux de confiance plus forts", description: "Contenu expert et mentions pertinentes renforcent la crédibilité." },
        { label: "Meilleure maturité IA", description: "Entités bilingues cohérentes pour les surfaces IA." },
        { label: "Priorisation plus claire", description: "Travail ordonné par valeur de marché et de langue." },
      ],
      faqs: [
        { q: "Taskcover a-t-il son siège au Canada ?", a: "Taskcover sert des clients au Canada. Nous ne revendiquons pas de siège canadien ou de bureaux physiques sauf si cela est confirmé. Notre travail est construit autour du comportement de recherche canadien, de la demande bilingue et des signaux de confiance." },
        { q: "Garantissez-vous les classements au Canada ?", a: "Non. Nous nous concentrons sur une visibilité durable, l'autorité et les résultats de revenu — pas des garanties de classement." },
        { q: "Pouvez-vous rédiger du contenu français pour le Québec ?", a: "Taskcover prend en charge le contenu français, ce qui peut aider à servir les audiences canadiennes et québécoises. Nous ne surestimons pas l'expertise juridique ou de conformité spécifique au Québec." },
        { q: "Gérez-vous le hreflang et le SEO international ?", a: "Oui. Une bonne architecture de locale et le hreflang sont au cœur du travail canadien afin que les pages anglaises et françaises ne se cannibalisent pas." },
        { q: "La recherche IA est-elle incluse pour le Canada ?", a: "Oui. La clarté des entités et la structure bilingue sont intégrées afin que les surfaces IA puissent référencer votre marque en toute confiance." },
      ],
      finalCta: {
        title: "Obtenez un audit de croissance SEO Canada.",
        description:
          "Voyez où vous vous situez à travers la demande anglaise et française, les SERPs provinciales et les surfaces IA — avec une feuille de route priorisée sur 90 jours.",
        auditLabel: "L'audit de croissance SEO Canada inclut",
        auditItems: [
          "Analyse du paysage (anglais + français + IA)",
          "Écart de visibilité concurrentiel",
          "Instantané technique",
          "Opportunité contenu & autorité",
          "Maturité de recherche IA",
          "Feuille de route 90 jours",
        ],
      },
      related: ["usa-seo-agency", "australia-seo-agency"],
    },

    "australia-seo-agency": {
      slug: "australia-seo-agency",
      icon: "australia",
      name: "Australie",
      regionLabel: "Asie-Pacifique",
      eyebrow: "Agence SEO Australie",
      h1: "SEO à forte valeur et axé sur la conversion pour l'Australie.",
      metaTitle: "Agence SEO Australie pour SERPs locales, nationales et commerciales",
      metaDescription:
        "Services d'agence SEO Australie pour les niches de service à forte valeur, la visibilité locale et nationale, l'eCommerce, la franchise et la capture PPC. SEO technique, autorité de contenu et maturité IA — sans fausses garanties.",
      heroDescription:
        "L'Australie est un marché de recherche à forte valeur où les niches de service commerciales, la demande locale et la concurrence nationale se rencontrent. Les acheteurs s'attendent à une autorité de contenu claire et des chemins de conversion solides, et les SERPs commerciales concurrentielles nécessitent souvent le PPC pour capturer la demande pendant que l'organique évolue.",
      marketContext:
        "La demande de recherche australienne se concentre dans les catégories de service à forte valeur, l'eCommerce et la franchise/multi-sites. La confiance et la clarté de conversion comptent ; les acheteurs agissent vite quand le contenu est crédible et le chemin de conversion est clair.",
      searchLandscape: {
        title: "Le paysage de recherche australien est commercial et axé sur le local.",
        description:
          "Les SERPs de service nationales sont concurrentielles et à forte valeur, tandis que les packs locaux décident de la demande de ville et métro. Les marques eCommerce et franchise concourent avec les marketplaces, et les AI Overviews résument de plus en plus les requêtes de service et de produit.",
        facets: [
          { label: "SERPs commerciales", detail: "Termes de service à forte valeur avec une forte concurrence payante." },
          { label: "Packs locaux", detail: "Décident de la demande de ville, métro et zone de service." },
          { label: "eCommerce", detail: "Concurrence de catalogue national avec les marketplaces." },
          { label: "Surfaces IA", detail: "Résument les requêtes de service et de produit ; récompensent le contenu structuré." },
        ],
      },
      buyerBehavior: {
        title: "Les acheteurs australiens apprécient la clarté et la crédibilité.",
        description:
          "Les acheteurs recherchent des prestataires de services, comparent les options et convertissent lorsque la confiance et les chemins de conversion sont clairs. Les niches à forte valeur récompensent le contenu expert et une forte présence locale.",
        stages: [
          { stage: "Sensibilisation", label: "Recherche de service", description: "Les acheteurs recherchent des catégories de service et de produit à forte valeur." },
          { stage: "Considération", label: "Comparaison de prestataires", description: "Les sélections se forment via les avis, l'autorité et la présence locale." },
          { stage: "Validation", label: "Vérifications de confiance", description: "Les titres et le contenu expert valident le choix." },
          { stage: "Conversion", label: "Chemin clair", description: "Appels, formulaires et réservations convertissent quand le chemin est fluide." },
        ],
      },
      localSeoAngle: {
        title: "Le SEO local gagne la demande australienne à forte valeur.",
        description:
          "La demande de ville et métro en Australie est souvent à forte valeur. GBP, avis et pages locales uniques décident qui capture l'intention locale qualifiée.",
      },
      nationalSeoAngle: {
        title: "Le SEO national concourt sur l'autorité et la clarté.",
        description:
          "Les SERPs nationales de service et eCommerce récompensent l'autorité thématique, les données structurées et des chemins de conversion clairs — pas du contenu générique.",
      },
      aiSearchOpportunity: {
        title: "La recherche IA se développe à travers les catégories australiennes.",
        description:
          "Les AI Overviews résument de plus en plus les requêtes de service et de produit en Australie. Le contenu structuré et la clarté des entités améliorent les chances de citation — pas de citations garanties.",
      },
      marketChallenges: {
        title: "Où se situe la friction SEO australienne.",
        description:
          "Les parties les plus difficiles de la recherche australienne sont la concurrence à forte valeur, l'écart entre trafic et conversions et l'évolution de la présence locale sans duplication.",
        items: [
          { label: "Coût des SERPs commerciales", detail: "Les termes à forte valeur nécessitent souvent une capture PPC avec l'organique.", severity: "high" },
          { label: "Pression du pack local", detail: "La demande de ville et métro est très disputée.", severity: "high" },
          { label: "Écarts de conversion", detail: "Le trafic arrive mais les chemins de conversion sont faibles.", severity: "medium" },
          { label: "Écarts d'autorité de contenu", detail: "Le contenu générique échoue dans les niches de service à forte confiance.", severity: "medium" },
          { label: "Duplication multi-sites", detail: "Les marques franchise risquent des pages locales minces et dupliquées.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "Un système d'exploitation régional pour la recherche australienne.",
        description:
          "Nous relions la technique, le local, l'autorité de contenu, la maturité IA et la capture PPC afin que la demande à forte valeur soit gagnée et convertie — pas seulement visitée.",
        layers: [
          { label: "Fondation technique", description: "Exploration, indexation et performance pour les catalogues et sites multi-sites." },
          { label: "Autorité de contenu", description: "Clusters experts pour les catégories de service et de produit à forte valeur." },
          { label: "Précision locale", description: "Pages locales uniques et évolutives pour la demande de ville et métro." },
          { label: "Maturité IA", description: "Contenu structuré et entités pour les surfaces IA." },
          { label: "Capture PPC", description: "Capture de demande pour les SERPs commerciales concurrentielles." },
        ],
      },
      recommendedIndustries: [
        { slug: "ecommerce-seo", reason: "Concurrence de catalogue national avec les marketplaces.", fit: 5 },
        { slug: "saas-seo", reason: "Demande de catégorie et de comparaison dans le SaaS APAC.", fit: 4 },
        { slug: "healthcare-seo", reason: "Demande locale et nationale de bien-être à forte confiance.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Évolution multi-sites à travers les métros australiens.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "Demande de service local à forte valeur.", fit: 3 },
      ],
      fitSummary: {
        title: "Pourquoi ces industries correspondent au marché australien",
        rows: [
          { label: "Forme de demande", value: "Commerciale à forte valeur + axée sur le local." },
          { label: "Niveau de confiance", value: "Élevé dans les catégories de service et de bien-être." },
          { label: "Exposition IA", value: "En croissance sur les requêtes de service et de produit." },
          { label: "Échelle", value: "Complexité nationale + métro + franchise." },
        ],
      },
      recommendedServices: [
        "seo-agency",
        "local-seo",
        "technical-seo",
        "content-marketing",
        "ppc-management",
        "ecommerce-seo",
        "seo-audit",
      ],
      growthSystem: {
        title: "La pile de croissance Australie",
        description:
          "Un système pour gagner la demande à forte valeur, faire évoluer la présence locale et capturer les SERPs commerciales avec le PPC.",
        groups: [
          { label: "Fondation", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Autorité", slugs: ["content-marketing"] },
          { label: "Local et échelle", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Capture de demande", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenu + autorité pour la crédibilité australienne.",
        description:
          "Les niches australiennes à forte valeur récompensent le contenu expert, des signaux d'autorité clairs et des données structurées qui soutiennent à la fois Google et les surfaces IA.",
        clusters: [
          "Construire des clusters de service et de produit autour de l'intention à forte valeur.",
          "Structurer le contenu pour que les surfaces IA puissent résumer et citer.",
          "Relier les clusters à des chemins de conversion clairs.",
        ],
        authority: [
          "Obtenir des mentions pertinentes sur des publications et communautés australiennes.",
          "Positionner les porte-parole pour des commentaires d'expert en APAC.",
          "Construire des actifs dignes de citation pour les catégories de service et de produit.",
        ],
      },
      ppcOpportunity: {
        title: "Le PPC capture la demande commerciale à forte valeur.",
        description:
          "Les SERPs commerciales australiennes sont concurrentielles et à forte valeur. La recherche payante capture la demande qualifiée pendant que l'organique évolue, alignée sur la même carte d'intention.",
      },
      trustSignals:
        "Nous n'utilisons pas de faux témoignages ou de métriques de cas inventées. Nous construisons une autorité réelle via un contenu expert, des données structurées et des mentions australiennes pertinentes.",
      outcomes: [
        { label: "Couverture de marché plus claire", description: "Demande nationale et locale traitée de manière cohérente." },
        { label: "Visibilité locale plus forte", description: "Présence de ville et métro sans duplication." },
        { label: "Meilleure demande qualifiée", description: "Le contenu expert atteint les acheteurs à forte valeur." },
        { label: "Signaux de confiance plus forts", description: "L'autorité et les mentions pertinentes renforcent la crédibilité." },
        { label: "Meilleure autorité de contenu", description: "Les clusters thématiques évoluent avec le temps." },
        { label: "Meilleure maturité IA", description: "Contenu structuré pour les surfaces IA." },
      ],
      faqs: [
        { q: "Taskcover a-t-il son siège en Australie ?", a: "Taskcover sert des clients en Australie. Nous ne revendiquons pas de siège australien ou de bureaux physiques sauf si cela est confirmé. Notre travail est construit autour du comportement de recherche et des signaux de confiance australiens." },
        { q: "Garantissez-vous les classements en Australie ?", a: "Non. Nous nous concentrons sur une visibilité durable, l'autorité et les résultats de revenu — pas des garanties de classement." },
        { q: "Pouvez-vous aider avec le SEO local australien ?", a: "Oui. Nous construisons des pages locales uniques et évolutives et des stratégies GBP pour la demande de ville et métro à travers l'Australie." },
        { q: "Le PPC est-il inclus pour l'Australie ?", a: "Le PPC fait partie du système de croissance australien car les SERPs commerciales sont à forte valeur et concurrentielles. Il est aligné sur les données d'intention organique." },
        { q: "Prenez-vous en charge l'eCommerce et la franchise en Australie ?", a: "Oui. L'architecture de catégorie eCommerce et le SEO local franchise/multi-sites sont au cœur du marché australien." },
      ],
      finalCta: {
        title: "Obtenez un audit de croissance SEO Australie.",
        description:
          "Voyez où vous vous situez à travers les SERPs commerciales, les packs locaux, les surfaces IA et la capture de demande PPC — avec une feuille de route priorisée sur 90 jours.",
        auditLabel: "L'audit de croissance SEO Australie inclut",
        auditItems: [
          "Analyse du paysage (national + local + IA)",
          "Écart de visibilité concurrentiel",
          "Instantané technique",
          "Opportunité contenu & autorité",
          "Maturité de recherche IA",
          "Feuille de route 90 jours",
        ],
      },
      related: ["usa-seo-agency", "canada-seo-agency"],
    },
  },

  ui: {
    breadcrumbHome: "Accueil",
    breadcrumbMarkets: "Marchés",
    heroCtaPrimary: "Audit SEO gratuit",
    heroCtaSecondary: "Réserver un appel",
    searchLandscapeEyebrow: "Paysage de recherche",
    searchLandscapeRadar: "Carte d'intelligence de marché",
    buyerBehaviorEyebrow: "Comportement des acheteurs",
    buyerBehaviorIntentPath: "Parcours de demande",
    challengesEyebrow: "Défis du marché",
    challengesScanner: "Scanner de friction concurrentielle",
    challengesRiskLevel: "Niveau de risque",
    approachEyebrow: "Approche Taskcover",
    approachOperatingModel: "Système d'exploitation régional",
    localSeoLabel: "SEO local",
    nationalSeoLabel: "SEO national",
    aiSearchLabel: "Recherche IA",
    ppcLabel: "PPC",
    multilingualLabel: "Multilingue",
    industriesEyebrow: "Industries recommandées",
    industriesTitle: "Industries adaptées à ce marché",
    industriesDesc: "Là où ce marché récompense la concentration, selon la demande, la confiance et l'échelle.",
    industriesFitSummary: "Résumé d'adéquation de marché",
    industriesFitScale: "Adéquation",
    servicesEyebrow: "Services recommandés",
    servicesTitle: "La pile de croissance de recherche pour ce marché",
    servicesDesc: "Un ensemble connecté de services adapté à la façon dont ce marché recherche et convertit.",
    servicesGrowthStack: "Pile de croissance",
    contentAuthorityEyebrow: "Contenu & autorité",
    contentAuthorityClusters: "Clusters de contenu",
    contentAuthorityLadder: "Échelle d'autorité",
    outcomesEyebrow: "Résultats",
    outcomesDesc: "Catégories de résultats visées — aucune métrique inventée.",
    faqEyebrow: "FAQ",
    faqTitle: "Questions d'achat par marché",
    ctaEyebrow: "Prochaine étape",
    ctaAuditPreview: "Aperçu de l'audit",
    ctaIllustrative: "Aperçu illustratif — aucune métrique inventée.",
    selectorViewMarket: "Voir",
    comparisonMarket: "Marché",
    comparisonLevels: { low: "Faible", medium: "Moyen", high: "Élevé", veryHigh: "Très élevé" },
    growthSystemsIncludes: "Inclut",
    relatedEyebrow: "Marchés liés",
    relatedTitle: "Explorer les marchés liés",
    exploreMarket: "Explorer le marché",
    outcome: "Résultat",
    trustFootnote:
      "L'expérience sélectionnée de l'équipe et des partenaires couvre des marques, campagnes et programmes de recherche mondiaux. Les noms de marque sont référencés à titre contextuel uniquement et n'impliquent aucune approbation sauf mention explicite.",
  },
};