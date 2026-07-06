import type { Locale } from "@/lib/i18n";
import type { CaseStudySlug } from "./work.types";

type AboutStoryCta = {
  label: string;
  href: string;
};

export type AboutStoryTimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type AboutStoryCapability = {
  id: string;
  title: string;
  body: string;
  caseStudySlugs: CaseStudySlug[];
};

export type AboutStoryLeader = {
  name: string;
  title: string;
  summary: string;
  focusAreas: string[];
  longDescription: string;
  alt: string;
  initials: string;
  futureImagePath: `/team/${string}.webp`;
  portraitAvailable: false;
};

export type AboutStoryContent = {
  meta: {
    title: string;
    description: string;
  };
  breadcrumb: {
    home: string;
    current: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    intro: string;
    primaryCta: AboutStoryCta;
    secondaryCta: AboutStoryCta;
    proofLine: string;
    identityLabel: string;
    identityTitle: string;
    identityItems: string[];
    timelinePreview: { year: string; label: string }[];
  };
  origin: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    signalsTitle: string;
    signals: string[];
  };
  timeline: {
    eyebrow: string;
    title: string;
    intro: string;
    entries: AboutStoryTimelineEntry[];
  };
  methodology: {
    eyebrow: string;
    title: string;
    intro: string;
    relatedLabel: string;
    capabilities: AboutStoryCapability[];
  };
  leadership: {
    eyebrow: string;
    title: string;
    intro: string;
    focusLabel: string;
    placeholderLabel: string;
    futurePhotoLabel: string;
    leaders: AboutStoryLeader[];
  };
  operatingModel: {
    eyebrow: string;
    title: string;
    intro: string;
    principles: { title: string; body: string }[];
    links: AboutStoryCta[];
  };
  company: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: {
      brand: string;
      formal: string;
      operator: string;
      address: string;
      email: string;
      phone: string;
    };
  };
  finalCta: {
    eyebrow: string;
    title: string;
    intro: string;
    primaryCta: AboutStoryCta;
    secondaryCta: AboutStoryCta;
  };
};

const timelineEn: AboutStoryTimelineEntry[] = [
  {
    year: "2017",
    title: "White-label search execution in Southeast Asia",
    description:
      "Taskcover begins as a behind-the-scenes execution team supporting agencies and consultants with SEO, content, technical search, and reporting work.",
  },
  {
    year: "2018",
    title: "Repeatable search delivery systems",
    description:
      "The team moves from task-based support into repeatable systems: technical audits, keyword and intent mapping, content briefs, internal linking, reporting, and search-growth roadmaps.",
  },
  {
    year: "2019",
    title: "Expansion direction toward Canada and the United States",
    description:
      "Founder Jamiez Nguyen expands the agency's commercial direction toward Canada and the United States, where competitive search, local visibility, compliance-sensitive industries, and national-market growth require a more strategic operating model.",
  },
  {
    year: "2020–2021",
    title: "Trust-sensitive industries and competitive SEO",
    description:
      "Work across education, legal and immigration, travel, hospitality, software, eCommerce, and local search strengthens Taskcover's focus on evidence, authority, technical foundations, and buyer intent.",
  },
  {
    year: "2022",
    title: "From SEO tasks to search-growth systems",
    description:
      "Taskcover connects technical SEO, content authority, local visibility, paid search intelligence, and conversion paths into one search-growth operating system.",
  },
  {
    year: "2023–2024",
    title: "AI Search and multi-surface visibility",
    description:
      "As search behavior changes, Taskcover expands its methodology around AI search, answer surfaces, entity clarity, source quality, and multi-surface visibility.",
  },
  {
    year: "Today",
    title: "Public specialist SEO agency by Stoa Global Corporation",
    description:
      "Taskcover Agency by Stoa Global Corporation now serves companies in the USA, Canada, and Australia with Local SEO, National SEO, Global SEO, SEO Mentor, AI Search, PPC intelligence, audits, and evidence-led search growth.",
  },
];

const timelineFr: AboutStoryTimelineEntry[] = [
  {
    year: "2017",
    title: "Exécution search en marque blanche en Asie du Sud-Est",
    description:
      "Taskcover commence comme équipe d'exécution en coulisses, au service d'agences et de consultants avec du SEO, du contenu, de l'analyse technique search et du reporting.",
  },
  {
    year: "2018",
    title: "Systèmes de livraison search répétables",
    description:
      "L'équipe passe d'un soutien par tâches à des systèmes répétables : audits techniques, cartographie des mots-clés et intentions, briefs de contenu, maillage interne, reporting et feuilles de route de croissance search.",
  },
  {
    year: "2019",
    title: "Direction commerciale vers le Canada et les États-Unis",
    description:
      "Le fondateur Jamiez Nguyen oriente le développement commercial de l'agence vers le Canada et les États-Unis, où la concurrence search, la visibilité locale, les secteurs sensibles à la conformité et la croissance nationale demandent un modèle plus stratégique.",
  },
  {
    year: "2020–2021",
    title: "Secteurs sensibles à la confiance et SEO concurrentiel",
    description:
      "Le travail en éducation, droit et immigration, voyage, hôtellerie, logiciel, eCommerce et recherche locale renforce l'accent de Taskcover sur les preuves, l'autorité, les bases techniques et l'intention d'achat.",
  },
  {
    year: "2022",
    title: "Des tâches SEO aux systèmes de croissance search",
    description:
      "Taskcover relie SEO technique, autorité de contenu, visibilité locale, intelligence paid search et parcours de conversion dans un même système opérationnel de croissance search.",
  },
  {
    year: "2023–2024",
    title: "Recherche IA et visibilité multi-surfaces",
    description:
      "À mesure que les comportements de recherche évoluent, Taskcover élargit sa méthodologie autour de la recherche IA, des surfaces de réponse, de la clarté des entités, de la qualité des sources et de la visibilité multi-surfaces.",
  },
  {
    year: "Aujourd'hui",
    title: "Agence SEO spécialiste publique par Stoa Global Corporation",
    description:
      "Taskcover Agency by Stoa Global Corporation sert aujourd'hui des entreprises aux États-Unis, au Canada et en Australie avec Local SEO, National SEO, Global SEO, SEO Mentor, recherche IA, intelligence PPC, audits et croissance search guidée par les preuves.",
  },
];

const timelineEs: AboutStoryTimelineEntry[] = [
  {
    year: "2017",
    title: "Ejecución search white-label en el Sudeste Asiático",
    description:
      "Taskcover comienza como un equipo de ejecución detrás de escena, apoyando a agencias y consultores con SEO, contenido, búsqueda técnica y reporting.",
  },
  {
    year: "2018",
    title: "Sistemas repetibles de entrega search",
    description:
      "El equipo pasa del apoyo por tareas a sistemas repetibles: auditorías técnicas, mapeo de keywords e intención, briefs de contenido, enlazado interno, reporting y roadmaps de crecimiento search.",
  },
  {
    year: "2019",
    title: "Dirección comercial hacia Canadá y Estados Unidos",
    description:
      "El fundador Jamiez Nguyen amplía la dirección comercial de la agencia hacia Canadá y Estados Unidos, donde la búsqueda competitiva, la visibilidad local, los sectores sensibles al cumplimiento y el crecimiento nacional requieren un modelo operativo más estratégico.",
  },
  {
    year: "2020–2021",
    title: "Sectores sensibles a la confianza y SEO competitivo",
    description:
      "El trabajo en educación, legal e inmigración, viajes, hotelería, software, eCommerce y búsqueda local fortalece el foco de Taskcover en evidencia, autoridad, bases técnicas e intención de compra.",
  },
  {
    year: "2022",
    title: "De tareas SEO a sistemas de crecimiento search",
    description:
      "Taskcover conecta SEO técnico, autoridad de contenido, visibilidad local, inteligencia paid search y rutas de conversión en un sistema operativo de crecimiento search.",
  },
  {
    year: "2023–2024",
    title: "Búsqueda con IA y visibilidad multi-superficie",
    description:
      "A medida que cambia el comportamiento de búsqueda, Taskcover amplía su metodología hacia búsqueda con IA, superficies de respuesta, claridad de entidades, calidad de fuentes y visibilidad multi-superficie.",
  },
  {
    year: "Hoy",
    title: "Agencia SEO especialista pública por Stoa Global Corporation",
    description:
      "Taskcover Agency by Stoa Global Corporation sirve hoy a empresas en Estados Unidos, Canadá y Australia con Local SEO, National SEO, Global SEO, SEO Mentor, búsqueda con IA, inteligencia PPC, auditorías y crecimiento search basado en evidencia.",
  },
];

const capabilitiesEn: AboutStoryCapability[] = [
  {
    id: "education",
    title: "Education and international visibility",
    body:
      "Education search shaped how Taskcover connects program discovery, authority, content, and international student intent into one admissions-oriented search journey.",
    caseStudySlugs: ["british-university-vietnam"],
  },
  {
    id: "hospitality",
    title: "Local hospitality and restaurant discovery",
    body:
      "Hospitality and restaurant search shaped Taskcover's local SEO thinking: maps, reviews, local intent, menu and service discovery, and conversion paths.",
    caseStudySlugs: ["casa-madera", "the-bamboo-bar"],
  },
  {
    id: "legal",
    title: "Legal and immigration search recovery",
    body:
      "Legal and immigration work shaped Taskcover's focus on recovery, technical foundations, trust-sensitive content, reporting clarity, and buyer intent.",
    caseStudySlugs: ["matthew-jeffery-law-firm"],
  },
  {
    id: "ecommerce",
    title: "eCommerce and product discovery",
    body:
      "Product discovery work shaped how Taskcover thinks about category architecture, long-tail demand, merchandising content, and search paths that support buyers.",
    caseStudySlugs: ["skatepro"],
  },
  {
    id: "travel",
    title: "Travel and multi-location search",
    body:
      "Travel and mobility cases shaped Taskcover's approach to city intent, branch visibility, technical performance, paid-organic intelligence, and booking journeys.",
    caseStudySlugs: ["agoda", "avis"],
  },
  {
    id: "software-insurance",
    title: "Software, insurance, and competitive authority",
    body:
      "Software and insurance work shaped the agency's approach to localization, trust-sensitive explanations, competitive authority, source quality, and conversion confidence.",
    caseStudySlugs: ["ccleaner", "fwd-insurance"],
  },
  {
    id: "real-estate",
    title: "Large-scale real estate and buyer journeys",
    body:
      "Real estate search shaped Taskcover's thinking around launch-stage demand, buyer education, project architecture, paid support, and trust-building content.",
    caseStudySlugs: ["novaworld"],
  },
];

const capabilitiesFr: AboutStoryCapability[] = [
  {
    id: "education",
    title: "Éducation et visibilité internationale",
    body:
      "La recherche en éducation a façonné la manière dont Taskcover relie découverte des programmes, autorité, contenu et intention des étudiants internationaux dans un parcours orienté admissions.",
    caseStudySlugs: ["british-university-vietnam"],
  },
  {
    id: "hospitality",
    title: "Hôtellerie locale et découverte de restaurants",
    body:
      "La recherche en hôtellerie et restauration a façonné la réflexion Local SEO de Taskcover : cartes, avis, intention locale, découverte des menus et services, et chemins de conversion.",
    caseStudySlugs: ["casa-madera", "the-bamboo-bar"],
  },
  {
    id: "legal",
    title: "Relance search en droit et immigration",
    body:
      "Le travail en droit et immigration a renforcé l'accent de Taskcover sur la reprise, les bases techniques, les contenus sensibles à la confiance, la clarté du reporting et l'intention d'achat.",
    caseStudySlugs: ["matthew-jeffery-law-firm"],
  },
  {
    id: "ecommerce",
    title: "eCommerce et découverte produit",
    body:
      "La découverte produit a façonné la réflexion de Taskcover sur l'architecture de catégories, la longue traîne, le contenu de merchandising et les parcours search qui soutiennent les acheteurs.",
    caseStudySlugs: ["skatepro"],
  },
  {
    id: "travel",
    title: "Voyage et recherche multi-localisation",
    body:
      "Les cas voyage et mobilité ont façonné l'approche de Taskcover autour de l'intention par ville, la visibilité par agence, la performance technique, l'intelligence paid-organic et les parcours de réservation.",
    caseStudySlugs: ["agoda", "avis"],
  },
  {
    id: "software-insurance",
    title: "Logiciel, assurance et autorité concurrentielle",
    body:
      "Le logiciel et l'assurance ont façonné l'approche de l'agence en matière de localisation, d'explications sensibles à la confiance, d'autorité concurrentielle, de qualité des sources et de confiance de conversion.",
    caseStudySlugs: ["ccleaner", "fwd-insurance"],
  },
  {
    id: "real-estate",
    title: "Immobilier à grande échelle et parcours acheteur",
    body:
      "La recherche immobilière a façonné la réflexion de Taskcover sur la demande au lancement, l'éducation des acheteurs, l'architecture projet, le soutien paid et les contenus de confiance.",
    caseStudySlugs: ["novaworld"],
  },
];

const capabilitiesEs: AboutStoryCapability[] = [
  {
    id: "education",
    title: "Educación y visibilidad internacional",
    body:
      "La búsqueda educativa moldeó cómo Taskcover conecta descubrimiento de programas, autoridad, contenido e intención de estudiantes internacionales en un recorrido orientado a admisiones.",
    caseStudySlugs: ["british-university-vietnam"],
  },
  {
    id: "hospitality",
    title: "Hotelería local y descubrimiento de restaurantes",
    body:
      "La búsqueda en hotelería y restaurantes moldeó el pensamiento de Local SEO de Taskcover: mapas, reseñas, intención local, descubrimiento de menús y servicios, y rutas de conversión.",
    caseStudySlugs: ["casa-madera", "the-bamboo-bar"],
  },
  {
    id: "legal",
    title: "Recuperación search legal e inmigratoria",
    body:
      "El trabajo legal e inmigratorio fortaleció el foco de Taskcover en recuperación, bases técnicas, contenido sensible a la confianza, claridad de reporting e intención de compra.",
    caseStudySlugs: ["matthew-jeffery-law-firm"],
  },
  {
    id: "ecommerce",
    title: "eCommerce y descubrimiento de productos",
    body:
      "El descubrimiento de productos moldeó cómo Taskcover piensa en arquitectura de categorías, demanda long-tail, contenido de merchandising y rutas search que ayudan al comprador.",
    caseStudySlugs: ["skatepro"],
  },
  {
    id: "travel",
    title: "Viajes y búsqueda multi-ubicación",
    body:
      "Los casos de viajes y movilidad moldearon el enfoque de Taskcover sobre intención por ciudad, visibilidad de sucursales, rendimiento técnico, inteligencia paid-organic y recorridos de reserva.",
    caseStudySlugs: ["agoda", "avis"],
  },
  {
    id: "software-insurance",
    title: "Software, seguros y autoridad competitiva",
    body:
      "El trabajo en software y seguros moldeó el enfoque de la agencia sobre localización, explicaciones sensibles a la confianza, autoridad competitiva, calidad de fuentes y confianza de conversión.",
    caseStudySlugs: ["ccleaner", "fwd-insurance"],
  },
  {
    id: "real-estate",
    title: "Bienes raíces a gran escala y recorridos de comprador",
    body:
      "La búsqueda inmobiliaria moldeó el pensamiento de Taskcover sobre demanda en etapa de lanzamiento, educación del comprador, arquitectura de proyecto, soporte paid y contenido de confianza.",
    caseStudySlugs: ["novaworld"],
  },
];

export const aboutStoryContent = {
  en: {
    meta: {
      title: "About Taskcover Agency: Story, Leadership, and Search Growth Systems",
      description:
        "Learn how Taskcover grew from a Southeast Asia white-label search execution team into Taskcover Agency by Stoa Global Corporation, serving the USA, Canada, and Australia.",
    },
    breadcrumb: { home: "Home", current: "About" },
    hero: {
      eyebrow: "Taskcover story",
      h1: "Built behind the scenes. Now built for brands that need serious search growth.",
      intro:
        "Taskcover began in 2017 as a white-label search execution team in Southeast Asia. Today, Taskcover Agency by Stoa Global Corporation is a specialist SEO agency helping companies in the USA, Canada, and Australia grow through SEO, AI Search, PPC intelligence, content authority, and technical execution.",
      primaryCta: { label: "View Our Methodology", href: "/methodology" },
      secondaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
      proofLine:
        "From white-label execution systems to verified case studies across education, hospitality, travel, software, insurance, legal, eCommerce, and multi-market search.",
      identityLabel: "From execution team to public agency",
      identityTitle: "Taskcover Agency by Stoa Global Corporation",
      identityItems: [
        "Origin: white-label search execution in Southeast Asia",
        "Public markets today: USA, Canada, and Australia",
        "Operator: Stoa Global Corporation",
      ],
      timelinePreview: [
        { year: "2017", label: "Behind-the-scenes execution" },
        { year: "2019", label: "Canada and US commercial direction" },
        { year: "Today", label: "Public specialist SEO agency" },
      ],
    },
    origin: {
      eyebrow: "Origin story",
      title: "Our story started before the Taskcover brand went public.",
      paragraphs: [
        "Taskcover did not begin as a public-facing agency selling packaged SEO. It began behind the scenes, helping other agencies and consultants deliver the research, technical analysis, content systems, reporting, and execution work needed to support search-growth campaigns.",
        "That early white-label model shaped the company around implementation quality. The team learned from real campaigns rather than generic SEO theory, then turned recurring work into stronger systems for audits, search intent, technical prioritization, content authority, and reporting.",
      ],
      signalsTitle: "What the early model created",
      signals: [
        "Execution discipline before public positioning",
        "Repeatable delivery systems instead of one-off SEO tasks",
        "Commercial direction toward competitive North American markets",
        "A public agency built from operating experience, not presentation alone",
      ],
    },
    timeline: {
      eyebrow: "Company timeline",
      title: "A practical evolution from white-label execution to public specialist agency.",
      intro:
        "The milestones below explain how Taskcover's operating model matured without inventing offices, awards, or unsupported claims.",
      entries: timelineEn,
    },
    methodology: {
      eyebrow: "What shaped our methodology",
      title: "The work taught the system.",
      intro:
        "Taskcover's methodology is shaped by verified case-study work across industries where search visibility depends on trust, technical foundations, content authority, local intent, and conversion quality.",
      relatedLabel: "Related case studies",
      capabilities: capabilitiesEn,
    },
    leadership: {
      eyebrow: "Leadership",
      title: "The people behind Taskcover",
      intro:
        "Taskcover is founder-led and technically directed. The public page shows only confirmed leadership details and leaves portrait slots ready for real approved photos.",
      focusLabel: "Focus areas",
      placeholderLabel: "Portrait slot reserved",
      futurePhotoLabel: "Real photo expected later",
      leaders: [
        {
          name: "Jamiez Nguyen",
          title: "Founder & CEO",
          summary:
            "Jamiez Nguyen founded Taskcover's search-growth practice and has led its expansion from Southeast Asian white-label execution into a public SEO agency serving the USA, Canada, and Australia.",
          focusAreas: [
            "SEO strategy",
            "market expansion",
            "client growth systems",
            "pricing and offer strategy",
            "international execution network",
            "SEO Mentor / advisory",
          ],
          longDescription:
            "Jamiez leads Taskcover's commercial strategy, client growth direction, and search methodology. His focus is turning SEO, AI search, content authority, PPC intelligence, and market expansion into practical systems that clients can understand, execute, and measure.",
          alt: "Jamiez Nguyen, Founder and CEO of Taskcover Agency",
          initials: "JN",
          futureImagePath: "/team/jamiez-nguyen.webp",
          portraitAvailable: false,
        },
        {
          name: "John Edward",
          title: "CTO",
          summary:
            "John Edward leads Taskcover's technical direction, platform architecture, automation systems, and technical SEO infrastructure.",
          focusAreas: [
            "technical SEO systems",
            "web architecture",
            "automation",
            "analytics/infrastructure",
            "site performance",
            "admin/content systems",
          ],
          longDescription:
            "John leads the technical layer behind Taskcover's systems: web architecture, technical SEO infrastructure, automation, content operations, performance, and the tooling required to turn strategy into repeatable execution.",
          alt: "John Edward, CTO of Taskcover Agency",
          initials: "JE",
          futureImagePath: "/team/john-edward.webp",
          portraitAvailable: false,
        },
      ],
    },
    operatingModel: {
      eyebrow: "How we work today",
      title: "Search growth is operated as a system, not a pile of tasks.",
      intro:
        "Taskcover keeps strategy, technical work, content, AI search readiness, paid-search intelligence, scope, and reporting connected so clients can see what is being diagnosed, executed, and measured.",
      principles: [
        {
          title: "Diagnosis before execution",
          body: "Audits, market context, technical constraints, and conversion paths come before recommendations.",
        },
        {
          title: "Search systems, not isolated SEO tasks",
          body: "Technical SEO, content authority, local/national/global architecture, and PPC intelligence are sequenced together.",
        },
        {
          title: "Evidence-led content",
          body: "Content is shaped by search intent, source quality, proof requirements, buyer questions, and measurable decision paths.",
        },
        {
          title: "Senior oversight with execution network",
          body: "Taskcover combines a repeatable execution network with senior direction on strategy, prioritization, and quality control.",
        },
      ],
      links: [
        { label: "Explore methodology", href: "/methodology" },
        { label: "See how we work", href: "/how-we-work" },
        { label: "Review pricing", href: "/pricing" },
      ],
    },
    company: {
      eyebrow: "Company details",
      title: "Public company information",
      intro:
        "Taskcover presents one confirmed public identity and one legal operator. The site does not publish invented branches, office hours, awards, certifications, or social profiles.",
      labels: {
        brand: "Brand",
        formal: "Formal presentation",
        operator: "Legal/operator",
        address: "Address",
        email: "Email",
        phone: "Phone",
      },
    },
    finalCta: {
      eyebrow: "Next step",
      title: "See what your search growth system should look like.",
      intro:
        "Start with your website, market, and goals. Taskcover will identify the clearest path across SEO, AI Search, content authority, PPC intelligence, or advisory support.",
      primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
      secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
    },
  },
  fr: {
    meta: {
      title: "À propos de Taskcover Agency : histoire, direction et systèmes search",
      description:
        "Découvrez comment Taskcover est passée d'une équipe white-label d'exécution search en Asie du Sud-Est à Taskcover Agency by Stoa Global Corporation, au service des États-Unis, du Canada et de l'Australie.",
    },
    breadcrumb: { home: "Accueil", current: "À propos" },
    hero: {
      eyebrow: "Histoire de Taskcover",
      h1: "Née en coulisses. Aujourd'hui conçue pour les marques qui ont besoin d'une croissance search sérieuse.",
      intro:
        "Taskcover a commencé en 2017 comme équipe white-label d'exécution search en Asie du Sud-Est. Aujourd'hui, Taskcover Agency by Stoa Global Corporation est une agence SEO spécialiste qui aide les entreprises aux États-Unis, au Canada et en Australie à croître grâce au SEO, à la recherche IA, à l'intelligence PPC, à l'autorité de contenu et à l'exécution technique.",
      primaryCta: { label: "Voir notre méthodologie", href: "/methodology" },
      secondaryCta: { label: "Obtenir un audit SEO gratuit", href: "/free-seo-audit" },
      proofLine:
        "Des systèmes d'exécution white-label aux études de cas vérifiées en éducation, hôtellerie, voyage, logiciel, assurance, droit, eCommerce et recherche multi-marchés.",
      identityLabel: "De l'équipe d'exécution à l'agence publique",
      identityTitle: "Taskcover Agency by Stoa Global Corporation",
      identityItems: [
        "Origine : exécution search en marque blanche en Asie du Sud-Est",
        "Marchés publics aujourd'hui : États-Unis, Canada et Australie",
        "Exploitant : Stoa Global Corporation",
      ],
      timelinePreview: [
        { year: "2017", label: "Exécution en coulisses" },
        { year: "2019", label: "Direction commerciale Canada et États-Unis" },
        { year: "Aujourd'hui", label: "Agence SEO spécialiste publique" },
      ],
    },
    origin: {
      eyebrow: "Origine",
      title: "Notre histoire a commencé avant que la marque Taskcover devienne publique.",
      paragraphs: [
        "Taskcover n'a pas commencé comme une agence publique vendant des forfaits SEO. Elle a commencé en coulisses, en aidant des agences et consultants à livrer la recherche, l'analyse technique, les systèmes de contenu, le reporting et l'exécution nécessaires aux campagnes de croissance search.",
        "Ce modèle white-label initial a ancré l'entreprise dans la qualité d'implémentation. L'équipe a appris à partir de campagnes réelles plutôt que de théorie SEO générique, puis a transformé les tâches récurrentes en systèmes plus solides pour les audits, l'intention search, la priorisation technique, l'autorité de contenu et le reporting.",
      ],
      signalsTitle: "Ce que le modèle initial a créé",
      signals: [
        "Discipline d'exécution avant positionnement public",
        "Systèmes de livraison répétables plutôt que tâches SEO isolées",
        "Direction commerciale vers les marchés nord-américains concurrentiels",
        "Une agence publique issue de l'expérience opérationnelle, pas seulement de la présentation",
      ],
    },
    timeline: {
      eyebrow: "Chronologie",
      title: "Une évolution pratique de l'exécution white-label à l'agence spécialiste publique.",
      intro:
        "Les étapes ci-dessous expliquent comment le modèle opérationnel de Taskcover a mûri sans inventer bureaux, prix ou affirmations non étayées.",
      entries: timelineFr,
    },
    methodology: {
      eyebrow: "Ce qui a façonné notre méthodologie",
      title: "Le travail a enseigné le système.",
      intro:
        "La méthodologie Taskcover est façonnée par des études de cas vérifiées dans des secteurs où la visibilité search dépend de la confiance, des bases techniques, de l'autorité de contenu, de l'intention locale et de la qualité de conversion.",
      relatedLabel: "Études de cas liées",
      capabilities: capabilitiesFr,
    },
    leadership: {
      eyebrow: "Direction",
      title: "Les personnes derrière Taskcover",
      intro:
        "Taskcover est dirigée par son fondateur et pilotée techniquement. Cette page publique montre uniquement les informations confirmées et réserve les emplacements portraits à de vraies photos approuvées.",
      focusLabel: "Domaines d'attention",
      placeholderLabel: "Emplacement portrait réservé",
      futurePhotoLabel: "Photo réelle attendue plus tard",
      leaders: [
        {
          name: "Jamiez Nguyen",
          title: "Founder & CEO",
          summary:
            "Jamiez Nguyen a fondé la pratique de croissance search de Taskcover et a mené son passage de l'exécution white-label en Asie du Sud-Est vers une agence SEO publique servant les États-Unis, le Canada et l'Australie.",
          focusAreas: [
            "stratégie SEO",
            "expansion de marché",
            "systèmes de croissance client",
            "stratégie d'offres et de prix",
            "réseau international d'exécution",
            "SEO Mentor / conseil",
          ],
          longDescription:
            "Jamiez dirige la stratégie commerciale, l'orientation de croissance client et la méthodologie search de Taskcover. Son objectif est de transformer SEO, recherche IA, autorité de contenu, intelligence PPC et expansion de marché en systèmes pratiques que les clients peuvent comprendre, exécuter et mesurer.",
          alt: "Jamiez Nguyen, fondateur et CEO de Taskcover Agency",
          initials: "JN",
          futureImagePath: "/team/jamiez-nguyen.webp",
          portraitAvailable: false,
        },
        {
          name: "John Edward",
          title: "CTO",
          summary:
            "John Edward dirige l'orientation technique, l'architecture plateforme, les systèmes d'automatisation et l'infrastructure SEO technique de Taskcover.",
          focusAreas: [
            "systèmes SEO techniques",
            "architecture web",
            "automatisation",
            "analytics/infrastructure",
            "performance de site",
            "systèmes admin/contenu",
          ],
          longDescription:
            "John dirige la couche technique derrière les systèmes Taskcover : architecture web, infrastructure SEO technique, automatisation, opérations de contenu, performance et outillage nécessaires pour transformer la stratégie en exécution répétable.",
          alt: "John Edward, CTO de Taskcover Agency",
          initials: "JE",
          futureImagePath: "/team/john-edward.webp",
          portraitAvailable: false,
        },
      ],
    },
    operatingModel: {
      eyebrow: "Comment nous travaillons aujourd'hui",
      title: "La croissance search est opérée comme un système, pas comme une liste de tâches.",
      intro:
        "Taskcover garde stratégie, technique, contenu, préparation à la recherche IA, intelligence paid search, périmètre et reporting connectés pour montrer ce qui est diagnostiqué, exécuté et mesuré.",
      principles: [
        {
          title: "Diagnostic avant exécution",
          body: "Audits, contexte marché, contraintes techniques et parcours de conversion précèdent les recommandations.",
        },
        {
          title: "Systèmes search, pas tâches SEO isolées",
          body: "SEO technique, autorité de contenu, architecture locale/nationale/globale et intelligence PPC sont séquencés ensemble.",
        },
        {
          title: "Contenu guidé par les preuves",
          body: "Le contenu est orienté par l'intention search, la qualité des sources, les exigences de preuve, les questions acheteur et les parcours de décision mesurables.",
        },
        {
          title: "Supervision senior avec réseau d'exécution",
          body: "Taskcover combine un réseau d'exécution répétable avec une direction senior sur la stratégie, la priorisation et le contrôle qualité.",
        },
      ],
      links: [
        { label: "Explorer la méthodologie", href: "/methodology" },
        { label: "Voir notre façon de travailler", href: "/how-we-work" },
        { label: "Consulter les tarifs", href: "/pricing" },
      ],
    },
    company: {
      eyebrow: "Détails de l'entreprise",
      title: "Informations publiques de l'entreprise",
      intro:
        "Taskcover présente une seule identité publique confirmée et un seul exploitant juridique. Le site ne publie pas de branches, horaires, prix, certifications ou profils sociaux inventés.",
      labels: {
        brand: "Marque",
        formal: "Présentation formelle",
        operator: "Exploitant juridique",
        address: "Adresse",
        email: "Email",
        phone: "Téléphone",
      },
    },
    finalCta: {
      eyebrow: "Prochaine étape",
      title: "Voyez à quoi devrait ressembler votre système de croissance search.",
      intro:
        "Commencez par votre site, votre marché et vos objectifs. Taskcover identifiera le chemin le plus clair entre SEO, recherche IA, autorité de contenu, intelligence PPC ou accompagnement conseil.",
      primaryCta: { label: "Obtenir un audit SEO gratuit", href: "/free-seo-audit" },
      secondaryCta: { label: "Réserver un appel stratégique", href: "/book-a-call" },
    },
  },
  es: {
    meta: {
      title: "Acerca de Taskcover Agency: historia, liderazgo y sistemas search",
      description:
        "Conoce cómo Taskcover pasó de ser un equipo white-label de ejecución search en el Sudeste Asiático a Taskcover Agency by Stoa Global Corporation, sirviendo a Estados Unidos, Canadá y Australia.",
    },
    breadcrumb: { home: "Inicio", current: "Acerca de" },
    hero: {
      eyebrow: "Historia de Taskcover",
      h1: "Nacida detrás de escena. Ahora construida para marcas que necesitan crecimiento search serio.",
      intro:
        "Taskcover comenzó en 2017 como un equipo white-label de ejecución search en el Sudeste Asiático. Hoy, Taskcover Agency by Stoa Global Corporation es una agencia SEO especialista que ayuda a empresas en Estados Unidos, Canadá y Australia a crecer mediante SEO, búsqueda con IA, inteligencia PPC, autoridad de contenido y ejecución técnica.",
      primaryCta: { label: "Ver nuestra metodología", href: "/methodology" },
      secondaryCta: { label: "Obtener auditoría SEO gratuita", href: "/free-seo-audit" },
      proofLine:
        "De sistemas de ejecución white-label a estudios de caso verificados en educación, hotelería, viajes, software, seguros, legal, eCommerce y búsqueda multi-mercado.",
      identityLabel: "De equipo de ejecución a agencia pública",
      identityTitle: "Taskcover Agency by Stoa Global Corporation",
      identityItems: [
        "Origen: ejecución search white-label en el Sudeste Asiático",
        "Mercados públicos hoy: Estados Unidos, Canadá y Australia",
        "Operador: Stoa Global Corporation",
      ],
      timelinePreview: [
        { year: "2017", label: "Ejecución detrás de escena" },
        { year: "2019", label: "Dirección comercial Canadá y Estados Unidos" },
        { year: "Hoy", label: "Agencia SEO especialista pública" },
      ],
    },
    origin: {
      eyebrow: "Origen",
      title: "Nuestra historia empezó antes de que la marca Taskcover fuera pública.",
      paragraphs: [
        "Taskcover no comenzó como una agencia pública vendiendo paquetes SEO. Comenzó detrás de escena, ayudando a otras agencias y consultores a entregar investigación, análisis técnico, sistemas de contenido, reporting y ejecución para sostener campañas de crecimiento search.",
        "Ese modelo white-label inicial formó la empresa alrededor de la calidad de implementación. El equipo aprendió de campañas reales, no de teoría SEO genérica, y convirtió el trabajo repetido en sistemas más sólidos para auditorías, intención search, priorización técnica, autoridad de contenido y reporting.",
      ],
      signalsTitle: "Lo que creó el modelo inicial",
      signals: [
        "Disciplina de ejecución antes del posicionamiento público",
        "Sistemas repetibles en lugar de tareas SEO aisladas",
        "Dirección comercial hacia mercados norteamericanos competitivos",
        "Una agencia pública construida desde experiencia operativa, no solo presentación",
      ],
    },
    timeline: {
      eyebrow: "Cronología",
      title: "Una evolución práctica desde la ejecución white-label hacia una agencia especialista pública.",
      intro:
        "Los hitos siguientes explican cómo maduró el modelo operativo de Taskcover sin inventar oficinas, premios ni afirmaciones sin soporte.",
      entries: timelineEs,
    },
    methodology: {
      eyebrow: "Qué moldeó nuestra metodología",
      title: "El trabajo enseñó el sistema.",
      intro:
        "La metodología de Taskcover está moldeada por estudios de caso verificados en sectores donde la visibilidad search depende de confianza, bases técnicas, autoridad de contenido, intención local y calidad de conversión.",
      relatedLabel: "Estudios de caso relacionados",
      capabilities: capabilitiesEs,
    },
    leadership: {
      eyebrow: "Liderazgo",
      title: "Las personas detrás de Taskcover",
      intro:
        "Taskcover está liderada por su fundador y dirigida técnicamente. La página pública muestra solo información confirmada y deja espacios de retrato listos para fotos reales aprobadas.",
      focusLabel: "Áreas de enfoque",
      placeholderLabel: "Espacio de retrato reservado",
      futurePhotoLabel: "Foto real prevista más adelante",
      leaders: [
        {
          name: "Jamiez Nguyen",
          title: "Founder & CEO",
          summary:
            "Jamiez Nguyen fundó la práctica de crecimiento search de Taskcover y ha liderado su expansión desde la ejecución white-label en el Sudeste Asiático hacia una agencia SEO pública que sirve a Estados Unidos, Canadá y Australia.",
          focusAreas: [
            "estrategia SEO",
            "expansión de mercado",
            "sistemas de crecimiento de clientes",
            "estrategia de precios y ofertas",
            "red internacional de ejecución",
            "SEO Mentor / asesoría",
          ],
          longDescription:
            "Jamiez lidera la estrategia comercial, la dirección de crecimiento de clientes y la metodología search de Taskcover. Su foco es convertir SEO, búsqueda con IA, autoridad de contenido, inteligencia PPC y expansión de mercado en sistemas prácticos que los clientes puedan entender, ejecutar y medir.",
          alt: "Jamiez Nguyen, fundador y CEO de Taskcover Agency",
          initials: "JN",
          futureImagePath: "/team/jamiez-nguyen.webp",
          portraitAvailable: false,
        },
        {
          name: "John Edward",
          title: "CTO",
          summary:
            "John Edward lidera la dirección técnica, la arquitectura de plataforma, los sistemas de automatización y la infraestructura de SEO técnico de Taskcover.",
          focusAreas: [
            "sistemas de SEO técnico",
            "arquitectura web",
            "automatización",
            "analytics/infraestructura",
            "rendimiento del sitio",
            "sistemas admin/contenido",
          ],
          longDescription:
            "John lidera la capa técnica detrás de los sistemas de Taskcover: arquitectura web, infraestructura de SEO técnico, automatización, operaciones de contenido, rendimiento y herramientas necesarias para convertir estrategia en ejecución repetible.",
          alt: "John Edward, CTO de Taskcover Agency",
          initials: "JE",
          futureImagePath: "/team/john-edward.webp",
          portraitAvailable: false,
        },
      ],
    },
    operatingModel: {
      eyebrow: "Cómo trabajamos hoy",
      title: "El crecimiento search se opera como un sistema, no como una pila de tareas.",
      intro:
        "Taskcover mantiene conectados estrategia, técnica, contenido, preparación para búsqueda con IA, inteligencia paid search, alcance y reporting para que los clientes vean qué se diagnostica, ejecuta y mide.",
      principles: [
        {
          title: "Diagnóstico antes de ejecución",
          body: "Auditorías, contexto de mercado, restricciones técnicas y rutas de conversión van antes de las recomendaciones.",
        },
        {
          title: "Sistemas search, no tareas SEO aisladas",
          body: "SEO técnico, autoridad de contenido, arquitectura local/nacional/global e inteligencia PPC se secuencian juntas.",
        },
        {
          title: "Contenido guiado por evidencia",
          body: "El contenido se forma por intención search, calidad de fuentes, requisitos de prueba, preguntas del comprador y rutas de decisión medibles.",
        },
        {
          title: "Supervisión senior con red de ejecución",
          body: "Taskcover combina una red repetible de ejecución con dirección senior en estrategia, priorización y control de calidad.",
        },
      ],
      links: [
        { label: "Explorar metodología", href: "/methodology" },
        { label: "Ver cómo trabajamos", href: "/how-we-work" },
        { label: "Revisar precios", href: "/pricing" },
      ],
    },
    company: {
      eyebrow: "Datos de la empresa",
      title: "Información pública de la empresa",
      intro:
        "Taskcover presenta una sola identidad pública confirmada y un solo operador legal. El sitio no publica sucursales, horarios, premios, certificaciones ni perfiles sociales inventados.",
      labels: {
        brand: "Marca",
        formal: "Presentación formal",
        operator: "Operador legal",
        address: "Dirección",
        email: "Email",
        phone: "Teléfono",
      },
    },
    finalCta: {
      eyebrow: "Siguiente paso",
      title: "Mira cómo debería verse tu sistema de crecimiento search.",
      intro:
        "Empieza con tu sitio web, mercado y objetivos. Taskcover identificará el camino más claro entre SEO, búsqueda con IA, autoridad de contenido, inteligencia PPC o apoyo de asesoría.",
      primaryCta: { label: "Obtener auditoría SEO gratuita", href: "/free-seo-audit" },
      secondaryCta: { label: "Reservar llamada estratégica", href: "/book-a-call" },
    },
  },
} satisfies Record<Locale, AboutStoryContent>;
