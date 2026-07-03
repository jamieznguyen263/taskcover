import type { ProofContent } from "@/content/proof.types";

export const proof: ProofContent = {
  ui: {
    home: "Accueil",
    proof: "Preuves",
    verifiedPublic: "Public vérifié",
    privateReference: "Référence privée",
    sourceLinked: "Source liée",
    permissioned: "Autorisé",
    disclosure: "Divulgation",
    evidenceType: "Type de preuve",
    verificationStatus: "Statut de vérification",
    requestReference: "Demander une référence privée",
    mediaInquiry: "Demande média",
    reviewStandard: "Standard des avis",
    publicEvidence: "Preuve publique",
    confidentialEngagement: "Engagement confidentiel",
    bookStrategyCall: "Réserver un appel stratégique",
    noPublicEvidenceTitle: "Aucune preuve publique n'est publiée avant vérification et autorisation.",
    noPublicEvidenceBody:
      "Le registre pourra accueillir plus tard des avis, liens médias, témoignages vidéo et profils. Tant qu'un enregistrement ne respecte pas la règle de publication, la page publique affiche le standard plutôt que le nom.",
    publicEvidenceRule:
      "La publication exige une autorisation public vérifié, un statut vérifié et une divulgation publique explicite.",
    privateReferenceLine:
      "Des références privées peuvent être disponibles pour des engagements qualifiés.",
    relatedProofChannels: "Canaux de preuve associés",
    evidenceLedger: "Registre des preuves",
    verificationWorkflow: "Flux de vérification",
    source: "Source",
    status: "Statut",
    approvedExperienceContext:
      "Expérience sélectionnée de l'équipe et des partenaires auprès de marques mondiales, de campagnes et de programmes de recherche.",
  },
  channelLinks: [
    {
      label: "Expérience de marque",
      href: "/proof/brand-experience",
      description: "Contexte approuvé pour l'expérience de l'équipe et des partenaires, sans implication d'approbation.",
    },
    {
      label: "Présence média",
      href: "/proof/media-features",
      description: "Registre avec sources pour la presse et les commentaires d'experts lorsque la divulgation est autorisée.",
    },
    {
      label: "Avis clients",
      href: "/proof/client-reviews",
      description: "Retours vérifiés uniquement, avec statut d'autorisation et règles de divulgation publique.",
    },
    {
      label: "Avis vidéo",
      href: "/proof/video-reviews",
      description: "Bibliothèque prête pour de futurs récits clients et témoignages vidéo approuvés.",
    },
    {
      label: "Porte-parole",
      href: "/proof/spokesperson",
      description: "Commentaires d'expertise au niveau agence, avec profils vérifiés possibles plus tard.",
    },
  ],
  hub: {
    metaTitle: "Système de preuves et d'autorité | Taskcover Agency",
    metaDescription:
      "Découvrez le cadre de preuve de Taskcover pour l'expérience de marque, les avis clients, les liens médias, les vidéos, les références privées et les profils de porte-parole.",
    eyebrow: "Preuves + autorité",
    h1: "Les preuves avant les affirmations.",
    intro:
      "Nous séparons l'expérience, les preuves et les affirmations afin que les acheteurs sachent ce qui est vérifié, ce qui reste privé et ce qui n'est pas encore public.",
    commandModules: [
      { label: "Preuve publique", status: "Vérifié", detail: "Une preuve nommée apparaît seulement lorsque l'autorisation et la vérification sont complètes." },
      { label: "Références privées", status: "Privé", detail: "Les références confidentielles sont traitées au cas par cas et jamais exposées publiquement." },
      { label: "Contexte d'expérience", status: "Divulgation sûre", detail: "L'expérience de marque est présentée comme contexte, non comme approbation." },
      { label: "Préparation média", status: "Source liée", detail: "Les liens médias exigent publication, date, source et formulation approuvée." },
      { label: "Standard de vérification", status: "Autorisé", detail: "Chaque élément public doit passer une barrière de preuve au niveau de l'enregistrement." },
    ],
    authority: {
      eyebrow: "Cadre d'autorité",
      title: "Un système de confiance par couches, pas une preuve sociale décorative.",
      description:
        "Le modèle d'autorité de Taskcover distingue le contexte d'expérience, la preuve publique, les références privées, les commentaires médias, la vidéo, la méthodologie de recherche et le reporting transparent.",
      layers: [
        { label: "Expérience de l'équipe et des partenaires", detail: "Exposition pertinente à des environnements de recherche et de livraison." },
        { label: "Preuve client publique", detail: "Preuve nommée seulement après vérification et autorisation." },
        { label: "Références privées", detail: "Introductions uniquement lorsque l'adéquation, le consentement et la confidentialité le permettent." },
        { label: "Commentaires médias", detail: "Liens publiés et contexte du sujet lorsque disponibles." },
        { label: "Preuve vidéo", detail: "Identité, contexte, formulation finale et actifs source approuvés." },
        { label: "Méthodologie de recherche", detail: "Systèmes reproductibles pour stratégie, technique, contenu, autorité et reporting." },
        { label: "Reporting transparent", detail: "Définitions claires de ce qui est affirmé, mesuré ou retenu." },
      ],
    },
    experience: {
      eyebrow: "Contexte d'expérience sélectionnée",
      title: "L'expérience peut être utile sans devenir un témoignage.",
      description:
        "Les noms ci-dessous ne peuvent être mentionnés que dans le contexte approuvé et ne doivent pas être utilisés comme avis client, approbation ou preuve par logo.",
      brands: ["Agoda", "Skyscanner", "British Council", "Avis"],
      disclosure:
        "Le contexte d'expérience n'implique pas d'approbation actuelle. La contribution individuelle et le périmètre d'engagement peuvent varier. Les détails publics ne sont partagés que lorsque la divulgation est autorisée.",
    },
    standards: {
      eyebrow: "Standards de preuve",
      title: "Ce que Taskcover considère comme une preuve publiable.",
      description:
        "La preuve passe par un flux contrôlé avant qu'un nom, une citation, un lien, un actif ou un récit devienne public.",
      steps: [
        "Source reçue",
        "Identité et contexte confirmés",
        "Autorisation vérifiée",
        "Formulation publique approuvée",
        "Source liée",
        "Publication",
      ],
    },
    channels: {
      eyebrow: "Canaux de preuve",
      title: "Une carte de preuve que les acheteurs peuvent inspecter.",
      description:
        "Chaque canal possède ses règles de divulgation, son comportement en absence de preuve et son chemin de registre futur.",
    },
    privatePath: {
      eyebrow: "Chemin de référence privée",
      title: "Le travail confidentiel reste confidentiel sauf approbation explicite d'une référence.",
      description:
        "Certains engagements ne peuvent pas être divulgués publiquement. Taskcover peut évaluer si une référence privée convient à un engagement qualifié, sans garantie de disponibilité.",
      steps: [
        "Adéquation de l'engagement",
        "Vérification de confidentialité",
        "Disponibilité de la référence",
        "Confirmation d'autorisation",
        "Introduction privée si approprié",
      ],
    },
    cta: {
      eyebrow: "Discuter de l'adéquation",
      title: "Examinez le standard de preuve avant d'évaluer le travail.",
      description:
        "Réservez un appel stratégique ou demandez un chemin de référence privée. Aucun nom public n'est partagé si l'enregistrement de preuve ne l'autorise pas.",
    },
  },
  pages: {
    "brand-experience": {
      slug: "brand-experience",
      label: "Expérience de marque",
      metaTitle: "Contexte d'expérience de marque | Taskcover Agency",
      metaDescription:
        "Découvrez comment Taskcover présente l'expérience sélectionnée de l'équipe et des partenaires sans impliquer d'approbation ni de relation client directe.",
      eyebrow: "Expérience de marque",
      h1: "Expérience dans des environnements de recherche.",
      intro:
        "Cette page explique le contexte approuvé pour l'expérience sélectionnée de l'équipe et des partenaires, sans transformer les noms de marque en approbations, témoignages ou preuve de relation contractuelle directe.",
    },
    "media-features": {
      slug: "media-features",
      label: "Présence média",
      metaTitle: "Présence média et commentaires | Taskcover Agency",
      metaDescription:
        "Explorez le cadre média de Taskcover pour les liens de presse vérifiés, les sujets de commentaire et les standards de réponse éditoriale.",
      eyebrow: "Présence média",
      h1: "Médias, commentaires et expertise en recherche.",
      intro:
        "Les liens médias vérifiés ne sont publiés que lorsqu'une source réelle, un contexte de publication, une date et une autorisation de divulgation publique existent.",
    },
    "client-reviews": {
      slug: "client-reviews",
      label: "Avis clients",
      metaTitle: "Avis clients vérifiés | Taskcover Agency",
      metaDescription:
        "Taskcover publie les retours clients uniquement lorsque l'identité, l'autorisation, la vérification et la divulgation sont confirmées.",
      eyebrow: "Avis clients",
      h1: "Des retours vérifiés, pas des compliments anonymes.",
      intro:
        "Taskcover n'invente pas d'avis, d'initiales, de notes ou d'éloges anonymes. Un retour public doit être autorisé, vérifié et divulgable.",
    },
    "video-reviews": {
      slug: "video-reviews",
      label: "Avis vidéo",
      metaTitle: "Avis vidéo vérifiés | Taskcover Agency",
      metaDescription:
        "Cadre Taskcover pour les témoignages vidéo et récits clients approuvés avec identité, contexte, actifs source et autorisation de publication vérifiés.",
      eyebrow: "Avis vidéo",
      h1: "Preuve vidéo avec contexte.",
      intro:
        "Les récits vidéo publics sont ajoutés seulement lorsque les participants approuvent leur identité, le contexte et la formulation finale publiée.",
    },
    spokesperson: {
      slug: "spokesperson",
      label: "Porte-parole",
      metaTitle: "Commentaires de porte-parole sur la recherche et l'IA | Taskcover Agency",
      metaDescription:
        "Taskcover fournit des commentaires d'expertise au niveau agence sur la recherche et la visibilité IA avec une structure future de profil vérifié.",
      eyebrow: "Porte-parole",
      h1: "Commentaires d'experts sur la recherche et l'IA.",
      intro:
        "Taskcover fournit des commentaires d'expertise par l'intermédiaire d'un représentant d'agence approuvé selon le sujet, la disponibilité et l'adéquation éditoriale.",
    },
  },
  brandExperience: {
    nameplatesTitle: "Plaques de noms approuvées",
    nameplatesDisclosure:
      "L'expérience peut inclure du travail réalisé par des membres de l'équipe ou des partenaires de livraison avant ou en parallèle de Taskcover. Aucune catégorie ne doit être supposée s'appliquer à chaque marque nommée.",
    sectorMapTitle: "Carte secteurs-capacités",
    sectorMapDescription:
      "La valeur de l'exposition antérieure réside dans le jugement de recherche qu'elle apporte sur des marchés complexes, pas dans l'affichage appuyé d'un logo.",
    sectors: [
      { sector: "Voyage et marketplaces", signals: ["demande multi-marchés", "échelle technique", "profondeur de contenu"] },
      { sector: "Éducation et programmes publics", signals: ["exigences de confiance", "parcours localisés", "architecture de l'information"] },
      { sector: "Mobilité et services consommateurs", signals: ["intention locale", "friction de conversion", "coordination de campagnes"] },
    ],
    contributionTitle: "Types de contribution",
    contributionDescription:
      "Ces domaines décrivent des catégories d'expérience possibles. Ce ne sont pas des affirmations concernant chaque organisation nommée.",
    contributions: [
      "Stratégie SEO",
      "Programmes de contenu",
      "Revue technique",
      "Recherche internationale",
      "Campagnes numériques",
      "Recherche et reporting",
      "Livraison soutenue par des partenaires",
    ],
    challengesTitle: "Défis de recherche rencontrés",
    challenges: [
      { label: "Visibilité internationale", detail: "Équilibrer intention régionale, langue et architecture canonique." },
      { label: "Transfert d'autorité", detail: "Transformer l'expertise en systèmes de contenu, qualité des sources et actifs citables." },
      { label: "Priorisation technique", detail: "Distinguer les bloqueurs SEO critiques du bruit de plateforme." },
      { label: "Clarté pour les parties prenantes", detail: "Rendre les recommandations compréhensibles pour marketing, produit et direction." },
    ],
    methodologyTitle: "Méthodologie intégrée à Taskcover",
    methodologyDescription:
      "L'expérience compte lorsqu'elle améliore le système opérationnel reçu aujourd'hui par les acheteurs.",
    methodology: [
      { from: "Marchés complexes", to: "Architecture de recherche", detail: "Segmenter la demande par pays, intention, langue et étape d'achat." },
      { from: "Grandes surfaces de contenu", to: "Systèmes éditoriaux", detail: "Créer des briefs, clusters et contrôles qualité qui passent à l'échelle." },
      { from: "Livraison de campagnes", to: "Discipline de reporting", detail: "Relier l'activité aux décisions, risques, prochaines étapes et contexte commercial." },
    ],
    policyTitle: "Politique de divulgation et de preuve",
    policy: [
      "Les noms de marque restent un contexte d'expérience en texte seul sauf si des actifs publics autorisés existent.",
      "Les noms de marque ne sont pas des sources de témoignages.",
      "Le contexte d'expérience n'implique pas d'approbation actuelle.",
      "Les détails publics ne sont partagés que lorsque la divulgation est autorisée.",
    ],
  },
  mediaFeatures: {
    registryTitle: "Registre média vérifié",
    registryEmpty:
      "Les liens médias vérifiés sont publiés ici lorsque la divulgation publique est autorisée.",
    topicMapTitle: "Carte des sujets de commentaire",
    topicMapDescription:
      "Ces sujets sont des domaines que Taskcover peut évaluer selon l'adéquation éditoriale; ils ne prétendent pas à une couverture média passée.",
    topics: [
      "Évolutions de Google Search",
      "Visibilité en recherche IA",
      "SEO technique",
      "SEO international",
      "SEO multilingue",
      "RP numériques",
      "Autorité de contenu",
      "Recherche locale",
      "Mesure de la recherche",
    ],
    workflowTitle: "Flux de réponse éditoriale",
    workflow: [
      "Demande reçue",
      "Sujet et délai examinés",
      "Représentant associé",
      "Commentaire rédigé ou entretien planifié",
      "Source et citation approuvées",
      "Lien de publication enregistré une fois en ligne",
    ],
    standardsTitle: "Standards de source et d'autorisation",
    standards: [
      "Aucun logo de publication n'est affiché sans actif public vérifié.",
      "Aucun lien presse n'est listé sans URL source réelle.",
      "Les dates, titres, auteurs et sujets doivent correspondre à la source.",
      "Les corrections ou liens expirés sont retirés du rendu public.",
    ],
    ctaTitle: "Demander un commentaire d'expert",
    ctaDescription:
      "Pour une demande média, partagez le sujet, l'échéance, le format et si la citation sera publique.",
  },
  clientReviews: {
    registryTitle: "Registre public des avis",
    registryEmpty:
      "Les avis clients publics apparaissent seulement après vérification de l'identité, de l'autorisation, de la formulation et de la divulgation.",
    dimensionsTitle: "Dimensions d'évaluation",
    dimensions: [
      { label: "Clarté stratégique", detail: "Priorités et arbitrages compréhensibles." },
      { label: "Communication", detail: "Progression, risques et prochaines étapes expliqués avec régularité." },
      { label: "Priorisation", detail: "Travail séquencé selon l'impact et la faisabilité." },
      { label: "Profondeur technique", detail: "Audits qui distinguent les enjeux critiques du bruit." },
      { label: "Qualité du reporting", detail: "Reporting orienté décisions, pas vanité." },
      { label: "Transparence d'exécution", detail: "Responsabilités et dépendances exposées clairement." },
      { label: "Alignement business", detail: "Travail de recherche relié aux revenus et au contexte de marché." },
    ],
    methodTitle: "Méthode de vérification",
    method: [
      "Confirmer l'identité de la personne et le contexte organisationnel.",
      "Confirmer l'autorisation d'affichage public.",
      "Approuver la formulation finale avant publication.",
      "Stocker source, statut, texte de divulgation et notes internes séparément.",
    ],
    privatePathTitle: "Parcours de référence confidentielle/privée",
    privatePath: [
      "Qualifier l'engagement et le besoin de référence.",
      "Vérifier les restrictions de confidentialité avant toute introduction.",
      "Confirmer la volonté de la référence et le contexte autorisé.",
      "Partager uniquement le chemin privé approuvé lorsque pertinent.",
    ],
    evaluationTitle: "Ce que les clients peuvent évaluer",
    evaluation: [
      "Qualité de la stratégie",
      "Recommandations techniques",
      "Planification de l'exécution",
      "Cadence de communication",
      "Clarté du reporting",
      "Jugement commercial",
    ],
  },
  videoReviews: {
    libraryTitle: "Bibliothèque vidéo vérifiée",
    libraryEmpty:
      "Les vidéos publiques apparaissent seulement après approbation du participant, validation de la source et autorisation de publication.",
    usefulVideoTitle: "Ce qu'un avis vidéo utile devrait couvrir",
    usefulVideo: [
      "Le contexte d'affaires et le défi initial.",
      "Le périmètre du travail ou de la collaboration.",
      "Ce qui a changé dans les décisions, la visibilité ou l'exécution.",
      "Les limites de divulgation publique.",
    ],
    workflowTitle: "Flux d'autorisation et d'identité",
    workflow: [
      "Identité du participant confirmée",
      "Contexte d'organisation approuvé",
      "Droits d'enregistrement et de vignette vérifiés",
      "Formulation finale revue",
      "URL vidéo et date de publication vérifiées",
    ],
    privateAvailabilityTitle: "Disponibilité vidéo/référence privée",
    privateAvailability:
      "Certains éléments vidéo ou de référence peuvent rester privés. Les pages publiques n'exposent jamais d'enregistrements, noms, vignettes ou liens privés.",
  },
  spokesperson: {
    areasTitle: "Domaines de commentaire",
    areas: [
      "Évolutions de Google Search",
      "Visibilité en recherche IA",
      "SEO technique",
      "SEO international",
      "SEO multilingue",
      "RP numériques",
      "Autorité de contenu",
      "Recherche locale",
      "Mesure de la recherche",
    ],
    formatsTitle: "Formats d'entretien et de contribution",
    formats: [
      "Citation écrite d'expert",
      "Entretien",
      "Discussion podcast",
      "Contribution webinaire",
      "Relecture d'article",
      "Briefing technique",
      "Participation à un panel",
    ],
    processTitle: "Processus de réponse éditoriale",
    process: [
      "Sujet, audience et délai examinés.",
      "Représentant d'agence sélectionné selon l'adéquation et la disponibilité.",
      "Commentaire approuvé préparé avec contexte source.",
      "Formulation publique et attribution vérifiées avant utilisation.",
    ],
    profileTitle: "Zone de profil et vérification du porte-parole",
    profileEmpty:
      "Aucune identité de porte-parole public vérifié n'est actuellement publiée. Taskcover fournit des commentaires d'expertise par un représentant d'agence approuvé selon le sujet, la disponibilité et l'adéquation éditoriale.",
    profileFields: [
      "Nom",
      "Rôle",
      "Photo",
      "Biographie",
      "Références vérifiées",
      "Sujets approuvés",
      "Langues disponibles",
      "Liens sources",
      "Statut d'autorisation publique",
    ],
    ctaTitle: "Envoyer une demande média",
    ctaDescription:
      "Partagez le média, le sujet, l'échéance, le format et les besoins d'attribution afin que Taskcover évalue l'adéquation.",
  },
};
