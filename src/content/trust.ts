import type { Locale } from "@/lib/i18n";
import { companyAddressLine, companyDetails } from "@/lib/company";

export type TrustPageSlug =
  | "about"
  | "methodology"
  | "how-we-work"
  | "privacy-policy"
  | "cookie-policy"
  | "terms"
  | "accessibility"
  | "data-request"
  | "cookie-preferences";

export const trustPageSlugs = [
  "about",
  "methodology",
  "how-we-work",
  "privacy-policy",
  "cookie-policy",
  "terms",
  "accessibility",
  "data-request",
  "cookie-preferences",
] as const satisfies readonly TrustPageSlug[];

export const trustPagePaths: Record<TrustPageSlug, string> = {
  about: "/about",
  methodology: "/methodology",
  "how-we-work": "/how-we-work",
  "privacy-policy": "/privacy-policy",
  "cookie-policy": "/cookie-policy",
  terms: "/terms",
  accessibility: "/accessibility",
  "data-request": "/data-request",
  "cookie-preferences": "/cookie-preferences",
};

export type TrustSection = {
  title: string;
  body?: string;
  items?: string[];
};

export type TrustPageContent = {
  slug: TrustPageSlug;
  meta: { title: string; description: string };
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroNotes: string[];
  sections: TrustSection[];
  railTitle?: string;
  railItems?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

type TrustLocaleContent = {
  common: {
    home: string;
    lastUpdated: string;
    companyDetails: string;
    legalReview: string;
    email: string;
    phone: string;
    address: string;
    dataRequestFallback: string;
  };
  pages: Record<TrustPageSlug, TrustPageContent>;
  notFound: {
    eyebrow: string;
    h1: string;
    intro: string;
    links: { label: string; href: string }[];
  };
  error: {
    h1: string;
    intro: string;
    retry: string;
    home: string;
    contact: string;
  };
  unavailable: {
    title: string;
    body: string;
  };
};

const operatorLine = `${companyDetails.formalName}. Legal operator: ${companyDetails.legalOperator}.`;
const contactLine = `${companyAddressLine()} | ${companyDetails.phone} | ${companyDetails.email}`;
const operatorLineFr = `${companyDetails.formalName}. Exploitant juridique : ${companyDetails.legalOperator}.`;
const operatorLineEs = `${companyDetails.formalName}. Operador legal: ${companyDetails.legalOperator}.`;

export const trustContent: Record<Locale, TrustLocaleContent> = {
  en: {
    common: {
      home: "Home",
      lastUpdated: "Last updated: July 5, 2026",
      companyDetails: "Company details",
      legalReview: "Website-ready draft for final legal review before launch.",
      email: "Email",
      phone: "Phone",
      address: "Address",
      dataRequestFallback: `You can also send privacy requests to ${companyDetails.email}.`,
    },
    pages: {
      about: {
        slug: "about",
        meta: {
          title: "About Taskcover Agency",
          description: "Learn who operates Taskcover Agency, what the agency does, and how its search-growth work is grounded in evidence, implementation, and measurable outcomes.",
        },
        breadcrumb: "About",
        eyebrow: "Company",
        h1: "A specialist search-growth agency with an international execution network.",
        intro:
          "Taskcover Agency helps companies turn search demand into clearer visibility, stronger authority, and better-qualified lead paths across organic, AI, local, international, and paid search.",
        heroNotes: [operatorLine, contactLine, "Taskcover does not promise guaranteed rankings or guaranteed campaign results."],
        railTitle: "Operating principles",
        railItems: ["Evidence before execution", "Technical clarity before scale", "Transparent priorities", "No fabricated proof or ranking guarantees"],
        sections: [
          {
            title: "What Taskcover is",
            body:
              "Taskcover Agency is a specialist SEO and search-growth agency operated by Stoa Global Corporation. The agency focuses on strategy, technical diagnosis, content authority, AI search readiness, local and international SEO, PPC intelligence, analytics, and SEO mentorship.",
          },
          {
            title: "Who Taskcover helps",
            body:
              "Taskcover serves companies that need search growth across markets such as the United States, Canada, and Australia. The work is best suited to teams that want a practical plan, stronger implementation, and measurable commercial signal rather than vanity traffic.",
          },
          {
            title: "How proof is used",
            body:
              "Public proof is limited to visible case studies, sample audits, strategic content, and clearly labelled evidence pages. Private references and sensitive client context are routed through the contact process instead of being published as fake testimonials.",
          },
          {
            title: "Company details",
            items: [operatorLine, contactLine],
          },
        ],
        primaryCta: { label: "Get a Free SEO Audit", href: "/free-seo-audit" },
        secondaryCta: { label: "Book a Strategy Call", href: "/book-a-call" },
      },
      methodology: {
        slug: "methodology",
        meta: {
          title: "Search Growth Methodology",
          description: "Taskcover's search-growth methodology across diagnosis, intent mapping, technical foundations, authority building, AI search visibility, PPC intelligence, and measurement.",
        },
        breadcrumb: "Methodology",
        eyebrow: "Search Growth Operating System",
        h1: "A diagnostic methodology for SEO, AI search, PPC intelligence, and conversion quality.",
        intro:
          "The methodology starts with evidence before execution. Taskcover maps demand, technical constraints, content authority, entity visibility, paid and organic intelligence, and conversion paths before recommending work.",
        heroNotes: ["Diagnosis before execution", "No guaranteed rankings", "Measurement and QA built into the operating rhythm"],
        railTitle: "What the system protects against",
        railItems: ["Tactics without diagnosis", "Thin content scale", "Indexation waste", "Reporting that hides lead quality"],
        sections: [
          {
            title: "Diagnostic layer",
            body:
              "Taskcover evaluates search demand, crawlability, indexation, internal linking, SERP intent, content gaps, local and international structure, and conversion friction before building the roadmap.",
          },
          {
            title: "Strategy layer",
            body:
              "The roadmap connects SEO, AI search/GEO, PPC learning, content authority, technical sequencing, and market priorities. The goal is to choose the work most likely to improve qualified demand, not to chase isolated keyword counts.",
          },
          {
            title: "Execution layer",
            body:
              "Implementation can include technical fixes, content systems, entity and information-gain work, local or international architecture, paid-search intelligence, reporting, and conversion-path improvements.",
          },
          {
            title: "Measurement layer",
            body:
              "Reporting looks at visibility, indexation, content performance, paid/organic signal, lead quality, and iteration opportunities. QA is used to prevent unsupported claims, broken page states, and avoidable measurement gaps.",
          },
          {
            title: "What Taskcover will not do",
            items: ["Promise guaranteed rankings", "Publish fake testimonials", "Invent client metrics", "Activate tracking without the consent architecture planned for Task 16"],
          },
        ],
        primaryCta: { label: "Start with a Free SEO Audit", href: "/free-seo-audit" },
      },
      "how-we-work": {
        slug: "how-we-work",
        meta: {
          title: "How We Work",
          description: "Understand Taskcover's client engagement flow from inquiry and discovery through audit, roadmap, execution sprints, reporting, approvals, and scope management.",
        },
        breadcrumb: "How We Work",
        eyebrow: "Engagement Process",
        h1: "A practical collaboration flow from first request to search-growth execution.",
        intro:
          "This page explains what happens after an inquiry: qualification, discovery, audit, prioritization, implementation, reporting, approvals, and the client inputs needed to keep work moving.",
        heroNotes: ["Clear scope before execution", "Content and technical approvals are explicit", "No response-time or result guarantees are stated"],
        railTitle: "What clients typically provide",
        railItems: ["Website and analytics access where appropriate", "Business priorities and markets", "Subject-matter review", "Technical contacts for implementation"],
        sections: [
          {
            title: "After the first request",
            body:
              "Taskcover reviews the request type, market, website context, and stated goals. If the request is a fit, discovery focuses on business priorities, current search constraints, and the internal resources available for implementation.",
          },
          {
            title: "Discovery and audit",
            body:
              "The audit identifies technical issues, indexation patterns, demand opportunities, content gaps, authority requirements, PPC learning opportunities, and conversion-path friction.",
          },
          {
            title: "Roadmap and sprint work",
            body:
              "Taskcover prioritizes work by impact, dependency, and feasibility. Execution can run through focused sprints with client approval for content, technical tickets, and material scope changes.",
          },
          {
            title: "Reporting and communication",
            body:
              "Reporting connects search metrics to business signals. Communication expectations, review cadence, content approval flow, and technical collaboration are agreed within the engagement rather than implied on the website.",
          },
        ],
        primaryCta: { label: "Book a Strategy Call", href: "/book-a-call" },
        secondaryCta: { label: "Contact Taskcover", href: "/contact" },
      },
      "privacy-policy": {
        slug: "privacy-policy",
        meta: {
          title: "Privacy Policy",
          description: "Read Taskcover Agency's privacy policy draft covering visitor, lead, contact, admin, technical, cookie, provider, retention, and data request handling.",
        },
        breadcrumb: "Privacy Policy",
        eyebrow: "Privacy",
        h1: "Privacy Policy",
        intro:
          "This policy explains how Taskcover Agency, operated by Stoa Global Corporation, may collect, use, store, and share information from visitors, leads, contacts, and Admin users. It is a website-ready draft for final legal review.",
        heroNotes: [operatorLine, contactLine, "This policy does not claim attorney-reviewed compliance with any specific legal regime."],
        railTitle: "Covered data flows",
        railItems: ["Lead and strategy-call forms", "Contact and media inquiries", "Data-request form", "Admin account data", "Technical, security, cookie, and future consent-aware analytics data"],
        sections: [
          {
            title: "Information visitors provide",
            body:
              "Visitors may provide name, email, company, role, website, market, industry, service interests, business goals, preferred call windows, contact intent, and message details through lead, strategy-call, contact, media, private-reference, and data-request pathways.",
          },
          {
            title: "Technical, cookie, and security data",
            body:
              "The site may process technical data such as request metadata, source path, UTM parameters, spam signals, rate-limit signals, Turnstile verification status when configured, Admin session data, and strictly necessary cookies for security and functionality.",
          },
          {
            title: "Service providers and processors",
            body:
              "The implemented or planned production stack includes Cloudflare, Neon, Resend, HubSpot, Cal.com, and Cloudinary. These providers may process data for hosting, database storage, email, CRM, booking pathways, media handling, security, and operational delivery.",
          },
          {
            title: "How information is used",
            items: ["Respond to inquiries and privacy requests", "Assess fit for SEO, PPC, AI search, or mentorship services", "Operate Admin and publishing workflows", "Protect forms from spam and abuse", "Improve site operations without activating analytics or ads before Task 16"],
          },
          {
            title: "Retention and requests",
            body:
              "Taskcover may retain information as needed for business records, security, legal, operational, and service-delivery purposes. Visitors can request access, correction, deletion, opt-out, or other privacy actions through the data-request page or by emailing business@taskcover.com. Identity verification may be required before action is taken.",
          },
          {
            title: "International processing, children, and updates",
            body:
              "Information may be processed in countries where Taskcover or its providers operate. The site is not intended for children. This policy may be updated as providers, forms, consent architecture, analytics, or advertising systems change.",
          },
        ],
        primaryCta: { label: "Submit a Data Request", href: "/data-request" },
        secondaryCta: { label: "Cookie Preferences", href: "/cookie-preferences" },
      },
      "cookie-policy": {
        slug: "cookie-policy",
        meta: {
          title: "Cookie Policy",
          description: "Understand Taskcover's current strictly necessary and preference cookie architecture plus future consent-aware analytics and marketing categories.",
        },
        breadcrumb: "Cookie Policy",
        eyebrow: "Cookies",
        h1: "Cookie Policy",
        intro:
          "Taskcover currently uses a conservative cookie architecture. Strictly necessary cookies may support security, Admin sessions, preferences, anti-spam protection, and core site functionality. Analytics and advertising activation is deferred to Task 16.",
        heroNotes: ["No analytics or ads scripts are activated in this task", "Non-essential categories default off", "Cookie preferences can be changed at any time"],
        railTitle: "Cookie categories",
        railItems: ["Strictly necessary", "Preferences", "Analytics", "Marketing / advertising"],
        sections: [
          {
            title: "Strictly necessary",
            body:
              "These support security, Admin sessions, form protection, preferences architecture, rate limiting, and site functionality. They cannot be disabled through the preference page because the site relies on them to operate safely.",
          },
          {
            title: "Preferences",
            body:
              "Preference storage may remember visitor choices such as cookie category settings. The current preference helper stores choices locally in the browser and does not activate analytics or advertising.",
          },
          {
            title: "Analytics",
            body:
              "Analytics tools such as GA4 may be connected later only after the consent-aware implementation is completed. This task does not load GA4, Google Tag Manager, or equivalent analytics tags.",
          },
          {
            title: "Marketing and advertising",
            body:
              "Advertising or remarketing tags such as Google Ads may be connected later through Task 16. They must read the saved preference state before any marketing tag is activated.",
          },
        ],
        primaryCta: { label: "Manage Cookie Preferences", href: "/cookie-preferences" },
      },
      terms: {
        slug: "terms",
        meta: {
          title: "Website Terms",
          description: "Taskcover Agency website terms covering informational content, service inquiries, no guaranteed SEO results, proposals, acceptable use, providers, and contact details.",
        },
        breadcrumb: "Terms",
        eyebrow: "Website Terms",
        h1: "Website Terms",
        intro:
          "These terms govern use of the Taskcover Agency website and lead inquiry flows. They are drafted for a professional informational site and should receive final legal review before launch.",
        heroNotes: [operatorLine, "Service inquiries do not automatically create a client relationship", "SEO, PPC, and search outcomes are not guaranteed"],
        railTitle: "Core terms",
        railItems: ["Informational website", "Separate proposals and contracts", "No professional/legal/financial advice", "No guaranteed rankings or results"],
        sections: [
          {
            title: "Use of the website",
            body:
              "Visitors may use the website to learn about Taskcover's services, methodology, proof standards, content, and inquiry pathways. Visitors must not misuse the site, attempt to access Admin or internal systems, interfere with security controls, or submit misleading or unlawful material.",
          },
          {
            title: "Informational content and inquiries",
            body:
              "Website content is informational and does not provide legal, financial, or professional advice. Submitting a form, booking request, or contact inquiry does not create a client relationship. Proposals, scopes, fees, and service commitments are handled separately.",
          },
          {
            title: "No guaranteed results",
            body:
              "Search performance can be affected by competition, implementation, algorithms, market behavior, budget, site constraints, and other factors. Taskcover does not guarantee rankings, traffic, leads, revenue, ad performance, or AI search visibility.",
          },
          {
            title: "Intellectual property and third parties",
            body:
              "The website's text, design, and materials belong to Taskcover or its licensors unless otherwise stated. The site may link to or rely on third-party providers such as Cloudflare, Neon, Resend, HubSpot, Cal.com, and Cloudinary.",
          },
          {
            title: "Updates and contact",
            body: `These terms may be updated as the website and services evolve. Questions can be sent to ${companyDetails.email}.`,
          },
        ],
      },
      accessibility: {
        slug: "accessibility",
        meta: {
          title: "Accessibility Statement",
          description: "Taskcover's accessibility statement, practical WCAG 2.2 AA alignment target, feedback channels, and ongoing improvement approach.",
        },
        breadcrumb: "Accessibility",
        eyebrow: "Accessibility",
        h1: "Accessibility Statement",
        intro:
          "Taskcover aims to provide practical, accessible digital experiences and to improve the website over time. The site targets alignment with WCAG 2.2 AA where feasible, without claiming certification or audited full conformance.",
        heroNotes: [contactLine, "No third-party widget is claimed as fully controlled by Taskcover", "Feedback is welcome by email or phone"],
        railTitle: "When reporting an issue",
        railItems: ["Page URL", "Device and browser", "Assistive technology if used", "Description of the barrier", "Preferred contact method"],
        sections: [
          {
            title: "Accessibility approach",
            body:
              "Taskcover uses semantic HTML, keyboard-accessible controls, visible focus states, readable contrast, localized language attributes, reduced-motion support, and form labels where practical.",
          },
          {
            title: "Feedback channels",
            body: `Accessibility issues can be reported to ${companyDetails.email} or by phone at ${companyDetails.phone}. Include enough detail to help reproduce the issue and understand the affected task.`,
          },
          {
            title: "Ongoing improvement",
            body:
              "Accessibility work is ongoing. Taskcover may prioritize fixes based on severity, visitor impact, technical feasibility, and dependencies with third-party services.",
          },
        ],
        primaryCta: { label: "Contact Taskcover", href: "/contact" },
      },
      "data-request": {
        slug: "data-request",
        meta: {
          title: "Data Request",
          description: "Request access, correction, deletion, marketing opt-out, cookie preference help, or another privacy action from Taskcover Agency.",
        },
        breadcrumb: "Data Request",
        eyebrow: "Privacy Request",
        h1: "Request access, correction, deletion, or another data action.",
        intro:
          "Use this pathway for privacy and data requests related to Taskcover Agency. Do not upload sensitive documents or government ID here. Taskcover may need to verify identity before acting.",
        heroNotes: ["No sensitive documents by default", "No guaranteed response time stated", `Fallback contact: ${companyDetails.email}`],
        railTitle: "Request types",
        railItems: ["Access my information", "Correct my information", "Delete my information", "Opt out of marketing", "Cookie/preferences question", "Other privacy request"],
        sections: [
          {
            title: "How this works",
            body:
              "The form uses the same spam, rate-limit, Turnstile-ready, and database-first lead architecture as other Taskcover forms. If providers are unavailable, the form shows a fallback instead of a false success.",
          },
        ],
      },
      "cookie-preferences": {
        slug: "cookie-preferences",
        meta: {
          title: "Cookie Preferences",
          description: "Manage Taskcover cookie categories with a provider-neutral preference helper for future consent-aware analytics and advertising activation.",
        },
        breadcrumb: "Cookie Preferences",
        eyebrow: "Preferences",
        h1: "Manage cookie preferences.",
        intro:
          "This page stores provider-neutral cookie preferences for future analytics and ads integration. It is not a full consent banner and does not activate tracking scripts.",
        heroNotes: ["Strictly necessary is always on", "Analytics and marketing default off", "Saved locally in this browser"],
        railTitle: "Task 16 connection point",
        railItems: ["Read saved category state", "Load analytics only if analytics is allowed", "Load advertising only if marketing is allowed", "React to preference-change events"],
        sections: [
          {
            title: "Preference architecture",
            body:
              "The helper supports reading, saving, resetting, category checks, and a future event dispatch when preferences change. No GTM, GA4, Google Ads, or other marketing scripts are wired in this task.",
          },
        ],
      },
    },
    notFound: {
      eyebrow: "Page not found",
      h1: "This page is not available.",
      intro: "The page may have moved, or the URL may not match a public Taskcover route.",
      links: [
        { label: "Homepage", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Insights", href: "/insights" },
        { label: "Case Studies", href: "/work/case-studies" },
        { label: "Free SEO Audit", href: "/free-seo-audit" },
        { label: "Contact", href: "/contact" },
      ],
    },
    error: {
      h1: "Something went wrong.",
      intro: "The page could not be shown safely. No internal error details are exposed.",
      retry: "Try again",
      home: "Go to homepage",
      contact: "Contact Taskcover",
    },
    unavailable: {
      title: "This content is temporarily unavailable.",
      body: "Please use the main navigation or contact Taskcover if you need help finding a page.",
    },
  },
  fr: {
    common: {
      home: "Accueil",
      lastUpdated: "Dernière mise à jour : 5 juillet 2026",
      companyDetails: "Coordonnées de l'entreprise",
      legalReview: "Version prête pour le site, à valider juridiquement avant le lancement.",
      email: "Courriel",
      phone: "Téléphone",
      address: "Adresse",
      dataRequestFallback: `Vous pouvez aussi envoyer vos demandes de confidentialité à ${companyDetails.email}.`,
    },
    pages: {} as Record<TrustPageSlug, TrustPageContent>,
    notFound: {
      eyebrow: "Page introuvable",
      h1: "Cette page n'est pas disponible.",
      intro: "La page a peut-être été déplacée ou l'URL ne correspond pas à une route publique de Taskcover.",
      links: [
        { label: "Accueil", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Analyses", href: "/insights" },
        { label: "Cas clients", href: "/work/case-studies" },
        { label: "Audit SEO gratuit", href: "/free-seo-audit" },
        { label: "Contact", href: "/contact" },
      ],
    },
    error: {
      h1: "Une erreur est survenue.",
      intro: "La page n'a pas pu être affichée en toute sécurité. Aucun détail interne n'est exposé.",
      retry: "Réessayer",
      home: "Retour à l'accueil",
      contact: "Contacter Taskcover",
    },
    unavailable: {
      title: "Ce contenu est temporairement indisponible.",
      body: "Utilisez la navigation principale ou contactez Taskcover si vous avez besoin d'aide.",
    },
  },
  es: {
    common: {
      home: "Inicio",
      lastUpdated: "Última actualización: 5 de julio de 2026",
      companyDetails: "Datos de la empresa",
      legalReview: "Borrador listo para el sitio, sujeto a revisión legal final antes del lanzamiento.",
      email: "Email",
      phone: "Teléfono",
      address: "Dirección",
      dataRequestFallback: `También puedes enviar solicitudes de privacidad a ${companyDetails.email}.`,
    },
    pages: {} as Record<TrustPageSlug, TrustPageContent>,
    notFound: {
      eyebrow: "Página no encontrada",
      h1: "Esta página no está disponible.",
      intro: "La página puede haberse movido o la URL puede no coincidir con una ruta pública de Taskcover.",
      links: [
        { label: "Inicio", href: "/" },
        { label: "Servicios", href: "/services" },
        { label: "Análisis", href: "/insights" },
        { label: "Casos de estudio", href: "/work/case-studies" },
        { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
        { label: "Contacto", href: "/contact" },
      ],
    },
    error: {
      h1: "Algo salió mal.",
      intro: "La página no pudo mostrarse de forma segura. No se exponen detalles internos del error.",
      retry: "Intentar de nuevo",
      home: "Ir al inicio",
      contact: "Contactar a Taskcover",
    },
    unavailable: {
      title: "Este contenido no está disponible temporalmente.",
      body: "Usa la navegación principal o contacta a Taskcover si necesitas ayuda.",
    },
  },
};

trustContent.fr.pages = localizeFrenchPages();
trustContent.es.pages = localizeSpanishPages();

export function getTrustContent(locale: Locale) {
  return trustContent[locale] ?? trustContent.en;
}

export function getTrustPageContent(slug: TrustPageSlug, locale: Locale) {
  return getTrustContent(locale).pages[slug];
}

function localizeFrenchPages(): Record<TrustPageSlug, TrustPageContent> {
  return {
    about: {
      ...trustContent.en.pages.about,
      meta: { title: "À propos de Taskcover Agency", description: "Découvrez qui exploite Taskcover Agency, ce que fait l'agence et comment son travail de croissance search reste fondé sur les preuves." },
      breadcrumb: "À propos",
      eyebrow: "Entreprise",
      h1: "Une agence spécialisée en croissance search avec un réseau d'exécution international.",
      intro: "Taskcover Agency aide les entreprises à transformer la demande de recherche en visibilité plus claire, autorité plus forte et parcours de prospects mieux qualifiés.",
      heroNotes: [operatorLine, contactLine, "Taskcover ne promet pas de classements garantis ni de résultats garantis."],
      railTitle: "Principes d'exploitation",
      railItems: ["Des preuves avant l'exécution", "La clarté technique avant l'échelle", "Des priorités transparentes", "Aucune preuve fabriquée ni garantie de classement"],
      sections: [
        { title: "Ce qu'est Taskcover", body: "Taskcover Agency est une agence spécialisée en SEO et croissance search, exploitée par Stoa Global Corporation. L'agence couvre la stratégie, le diagnostic technique, l'autorité de contenu, la préparation à la recherche IA, le SEO local et international, l'intelligence PPC, l'analytique et le mentorat SEO." },
        { title: "Qui Taskcover aide", body: "Taskcover sert les entreprises qui ont besoin de croissance search aux États-Unis, au Canada et en Australie. Le travail convient aux équipes qui veulent un plan exploitable, une meilleure exécution et des signaux commerciaux mesurables." },
        { title: "Comment les preuves sont utilisées", body: "Les preuves publiques se limitent aux cas clients visibles, audits exemples, contenus stratégiques et pages d'évidence clairement libellées. Les références privées passent par le contact, sans faux témoignages." },
        { title: "Coordonnées", items: [operatorLine, contactLine] },
      ],
      primaryCta: { label: "Obtenir un audit SEO gratuit", href: "/free-seo-audit" },
      secondaryCta: { label: "Réserver un appel stratégique", href: "/book-a-call" },
    },
    methodology: {
      ...trustContent.en.pages.methodology,
      meta: { title: "Méthodologie de croissance search", description: "La méthodologie Taskcover pour le diagnostic, l'intention, les fondations techniques, l'autorité, la recherche IA, le PPC et la mesure." },
      breadcrumb: "Méthodologie",
      eyebrow: "Système de croissance search",
      h1: "Une méthodologie diagnostique pour le SEO, la recherche IA, l'intelligence PPC et la qualité de conversion.",
      intro: "La méthodologie commence par les preuves. Taskcover cartographie la demande, les contraintes techniques, l'autorité, la visibilité d'entité, les signaux payants et organiques, puis les parcours de conversion.",
      heroNotes: ["Diagnostic avant exécution", "Aucune garantie de classement", "Mesure et QA intégrées au rythme de travail"],
      railTitle: "Ce que le système évite",
      railItems: ["Des tactiques sans diagnostic", "Une production de contenu mince", "Le gaspillage d'indexation", "Des rapports qui masquent la qualité des prospects"],
      sections: [
        { title: "Couche diagnostic", body: "Taskcover évalue la demande, la crawlabilité, l'indexation, le maillage interne, l'intention SERP, les écarts de contenu, la structure locale et internationale, et les frictions de conversion." },
        { title: "Couche stratégie", body: "La feuille de route relie SEO, recherche IA/GEO, apprentissages PPC, autorité de contenu, séquençage technique et priorités de marché." },
        { title: "Couche exécution", body: "L'exécution peut inclure correctifs techniques, systèmes de contenu, travail d'entité et de gain informationnel, architecture locale ou internationale, intelligence paid search et reporting." },
        { title: "Couche mesure", body: "Le reporting observe visibilité, indexation, performance de contenu, signaux payants/organiques, qualité des leads et opportunités d'itération." },
        { title: "Ce que Taskcover ne fera pas", items: ["Promettre des classements garantis", "Publier de faux témoignages", "Inventer des métriques client", "Activer le tracking avant l'architecture de consentement prévue à la tâche 16"] },
      ],
      primaryCta: { label: "Commencer par un audit SEO gratuit", href: "/free-seo-audit" },
    },
    "how-we-work": {
      ...trustContent.en.pages["how-we-work"],
      meta: { title: "Comment nous travaillons", description: "Comprendre le déroulé client de Taskcover : demande, découverte, audit, feuille de route, exécution, reporting, approbations et périmètre." },
      breadcrumb: "Comment nous travaillons",
      eyebrow: "Processus d'engagement",
      h1: "Un flux de collaboration pratique, de la première demande à l'exécution search.",
      intro: "Cette page explique la qualification, la découverte, l'audit, la priorisation, l'exécution, le reporting, les approbations et les apports client nécessaires.",
      heroNotes: ["Périmètre clair avant exécution", "Approbations de contenu et techniques explicites", "Aucune promesse de délai de réponse ou de résultat"],
      railTitle: "Ce que les clients fournissent souvent",
      railItems: ["Accès site et analytics si pertinent", "Priorités business et marchés", "Revue métier", "Contacts techniques pour l'implémentation"],
      sections: [
        { title: "Après la première demande", body: "Taskcover examine le type de demande, le marché, le contexte du site et les objectifs déclarés. Si la demande convient, la découverte se concentre sur les priorités business, les contraintes search et les ressources disponibles." },
        { title: "Découverte et audit", body: "L'audit identifie les problèmes techniques, les modèles d'indexation, les opportunités de demande, les écarts de contenu, les besoins d'autorité, les signaux PPC et les frictions de conversion." },
        { title: "Feuille de route et sprints", body: "Taskcover priorise selon l'impact, les dépendances et la faisabilité. L'exécution peut passer par des sprints avec approbation client." },
        { title: "Reporting et communication", body: "Le reporting relie les métriques search aux signaux business. Le rythme de revue et les attentes de communication sont définis dans l'engagement." },
      ],
      primaryCta: { label: "Réserver un appel stratégique", href: "/book-a-call" },
      secondaryCta: { label: "Contacter Taskcover", href: "/contact" },
    },
    "privacy-policy": frLegal(
      "privacy-policy",
      "Politique de confidentialité",
      "Confidentialité",
      "Cette politique explique comment Taskcover Agency, exploitée par Stoa Global Corporation, peut collecter, utiliser, stocker et partager les informations des visiteurs, prospects, contacts et utilisateurs Admin. Elle doit être revue juridiquement avant le lancement.",
      ["Données de formulaires et demandes de rendez-vous", "Demandes de contact, média et références privées", "Demandes liées aux données", "Données Admin, techniques, sécurité, cookies et future mesure soumise au consentement"],
      [
        { title: "Informations fournies", body: "Les visiteurs peuvent fournir nom, courriel, entreprise, rôle, site web, marché, secteur, intérêts de service, objectifs, préférences d'appel, intention de contact et message." },
        { title: "Données techniques et sécurité", body: "Le site peut traiter des métadonnées de requête, chemins source, paramètres UTM, signaux anti-spam, limitation de débit, état Turnstile si configuré, sessions Admin et cookies strictement nécessaires." },
        { title: "Prestataires", body: "L'architecture mise en œuvre ou prévue inclut Cloudflare, Neon, Resend, HubSpot, Cal.com et Cloudinary pour l'hébergement, la base de données, l'email, le CRM, les rendez-vous, les médias et la sécurité." },
        { title: "Utilisation et conservation", body: "Les données servent à répondre aux demandes, évaluer l'adéquation des services, exploiter les workflows Admin, protéger les formulaires et gérer les opérations. La conservation dépend des besoins commerciaux, sécurité, juridiques et opérationnels." },
        { title: "Demandes et mises à jour", body: `Les demandes d'accès, correction, suppression, opposition marketing ou autre action peuvent passer par la page demande de données ou ${companyDetails.email}. Une vérification d'identité peut être nécessaire.` },
      ]
    ),
    "cookie-policy": frLegal(
      "cookie-policy",
      "Politique relative aux cookies",
      "Cookies",
      "Taskcover utilise une architecture de cookies conservatrice. Les cookies strictement nécessaires peuvent soutenir la sécurité, les sessions Admin, les préférences, la protection anti-spam et les fonctions du site. L'analytics et la publicité sont différés à la tâche 16.",
      ["Strictement nécessaires", "Préférences", "Analytics", "Marketing / publicité"],
      [
        { title: "Strictement nécessaires", body: "Ils soutiennent sécurité, sessions Admin, protection des formulaires, préférences, limitation de débit et fonctionnement du site. Ils restent toujours actifs." },
        { title: "Préférences", body: "Le stockage de préférences peut mémoriser les choix de catégories dans le navigateur, sans activer l'analytics ni la publicité." },
        { title: "Analytics", body: "GA4, Google Tag Manager ou outils similaires ne sont pas chargés dans cette tâche. Une activation future devra lire l'état de consentement." },
        { title: "Marketing et publicité", body: "Les balises publicitaires ou de remarketing ne sont pas activées. Elles devront être connectées via la tâche 16 et respecter les préférences enregistrées." },
      ]
    ),
    terms: frLegal(
      "terms",
      "Conditions d'utilisation du site",
      "Conditions",
      "Ces conditions régissent l'utilisation du site Taskcover Agency et des flux de demande. Elles sont destinées à un site professionnel d'information et doivent être validées juridiquement avant lancement.",
      ["Site informatif", "Propositions et contrats séparés", "Aucun conseil juridique, financier ou professionnel", "Aucun résultat SEO/PPC garanti"],
      [
        { title: "Utilisation du site", body: "Les visiteurs peuvent utiliser le site pour comprendre les services, méthodes, preuves et voies de contact. Il est interdit de tenter d'accéder aux systèmes Admin ou internes, de contourner la sécurité ou de soumettre du contenu trompeur." },
        { title: "Contenu et demandes", body: "Le contenu est informatif. Une demande de formulaire ou rendez-vous ne crée pas automatiquement de relation client. Les périmètres, tarifs et engagements relèvent de propositions ou contrats séparés." },
        { title: "Aucune garantie de résultats", body: "La performance search dépend de la concurrence, de l'implémentation, des algorithmes, du marché, du budget et d'autres facteurs. Taskcover ne garantit pas classements, trafic, prospects, revenus ou visibilité IA." },
        { title: "Propriété intellectuelle et tiers", body: "Les textes, designs et ressources du site appartiennent à Taskcover ou ses concédants, sauf indication contraire. Le site peut s'appuyer sur des prestataires tiers." },
      ]
    ),
    accessibility: frLegal(
      "accessibility",
      "Déclaration d'accessibilité",
      "Accessibilité",
      "Taskcover vise des expériences numériques pratiques et accessibles, avec une amélioration continue. Le site cible un alignement WCAG 2.2 AA lorsque faisable, sans revendiquer de certification ni conformité auditée complète.",
      ["URL concernée", "Appareil et navigateur", "Technologie d'assistance si utilisée", "Description de la barrière", "Mode de contact souhaité"],
      [
        { title: "Approche", body: "Taskcover utilise HTML sémantique, contrôles clavier, focus visible, contraste lisible, attributs de langue, réduction des mouvements et labels de formulaire lorsque possible." },
        { title: "Canaux de retour", body: `Les problèmes d'accessibilité peuvent être signalés à ${companyDetails.email} ou au ${companyDetails.phone}.` },
        { title: "Amélioration continue", body: "Les corrections sont priorisées selon la gravité, l'impact visiteur, la faisabilité technique et les dépendances avec les services tiers." },
      ]
    ),
    "data-request": frLegal(
      "data-request",
      "Demande d'accès, de correction, de suppression ou autre action sur les données.",
      "Demande de données",
      "Utilisez ce parcours pour les demandes de confidentialité et de données liées à Taskcover Agency. Ne soumettez pas de documents sensibles ni de pièce d'identité gouvernementale dans ce formulaire.",
      ["Accéder à mes informations", "Corriger mes informations", "Supprimer mes informations", "Me désinscrire du marketing", "Question cookies/préférences", "Autre demande"],
      [{ title: "Fonctionnement", body: "Le formulaire utilise la même architecture anti-spam, limitation de débit, préparation Turnstile et acceptation base de données que les autres formulaires. En cas d'indisponibilité des prestataires, il affiche un recours au lieu d'un faux succès." }]
    ),
    "cookie-preferences": frLegal(
      "cookie-preferences",
      "Gérer les préférences de cookies.",
      "Préférences de cookies",
      "Cette page enregistre des préférences de cookies neutres vis-à-vis des fournisseurs pour une future intégration analytics et publicité. Elle n'est pas une bannière CMP complète et n'active aucun tracking.",
      ["Strictement nécessaires toujours actifs", "Analytics et marketing désactivés par défaut", "Enregistré localement dans ce navigateur"],
      [{ title: "Architecture de préférences", body: "Le helper permet lecture, enregistrement, réinitialisation, vérification par catégorie et événement de changement. Aucun GTM, GA4, Google Ads ou script marketing n'est connecté dans cette tâche." }]
    ),
  };
}

function localizeSpanishPages(): Record<TrustPageSlug, TrustPageContent> {
  return {
    about: {
      ...trustContent.en.pages.about,
      meta: { title: "Acerca de Taskcover Agency", description: "Conoce quién opera Taskcover Agency, qué hace la agencia y cómo su trabajo de crecimiento search se basa en evidencia." },
      breadcrumb: "Acerca de",
      eyebrow: "Empresa",
      h1: "Una agencia especializada en crecimiento search con una red internacional de ejecución.",
      intro: "Taskcover Agency ayuda a empresas a convertir la demanda de búsqueda en visibilidad más clara, autoridad más fuerte y rutas de leads mejor calificadas.",
      heroNotes: [operatorLine, contactLine, "Taskcover no promete rankings garantizados ni resultados garantizados."],
      railTitle: "Principios operativos",
      railItems: ["Evidencia antes de ejecutar", "Claridad técnica antes de escalar", "Prioridades transparentes", "Sin pruebas fabricadas ni garantías de ranking"],
      sections: [
        { title: "Qué es Taskcover", body: "Taskcover Agency es una agencia especializada en SEO y crecimiento search, operada por Stoa Global Corporation. Cubre estrategia, diagnóstico técnico, autoridad de contenido, preparación para búsqueda con IA, SEO local e internacional, inteligencia PPC, analítica y mentoría SEO." },
        { title: "A quién ayuda Taskcover", body: "Taskcover atiende empresas que necesitan crecimiento search en Estados Unidos, Canadá y Australia. El trabajo encaja con equipos que quieren un plan práctico, mejor implementación y señales comerciales medibles." },
        { title: "Cómo se usan las pruebas", body: "Las pruebas públicas se limitan a casos visibles, auditorías de muestra, contenido estratégico y páginas de evidencia claramente identificadas. Las referencias privadas se gestionan por contacto, sin testimonios falsos." },
        { title: "Datos de la empresa", items: [operatorLine, contactLine] },
      ],
      primaryCta: { label: "Obtener auditoría SEO gratuita", href: "/free-seo-audit" },
      secondaryCta: { label: "Reservar llamada estratégica", href: "/book-a-call" },
    },
    methodology: {
      ...trustContent.en.pages.methodology,
      meta: { title: "Metodología de crecimiento search", description: "La metodología de Taskcover para diagnóstico, intención, base técnica, autoridad, búsqueda con IA, PPC y medición." },
      breadcrumb: "Metodología",
      eyebrow: "Sistema de crecimiento search",
      h1: "Una metodología diagnóstica para SEO, búsqueda con IA, inteligencia PPC y calidad de conversión.",
      intro: "La metodología empieza con evidencia. Taskcover mapea demanda, restricciones técnicas, autoridad, visibilidad de entidad, señales pagas y orgánicas, y rutas de conversión.",
      heroNotes: ["Diagnóstico antes de ejecución", "Sin garantías de ranking", "Medición y QA dentro del ritmo de trabajo"],
      railTitle: "Qué evita el sistema",
      railItems: ["Tácticas sin diagnóstico", "Contenido débil a escala", "Desperdicio de indexación", "Reportes que ocultan calidad de leads"],
      sections: [
        { title: "Capa diagnóstica", body: "Taskcover evalúa demanda, rastreo, indexación, enlazado interno, intención SERP, brechas de contenido, estructura local e internacional y fricción de conversión." },
        { title: "Capa estratégica", body: "La hoja de ruta conecta SEO, búsqueda con IA/GEO, aprendizajes de PPC, autoridad de contenido, secuencia técnica y prioridades de mercado." },
        { title: "Capa de ejecución", body: "La ejecución puede incluir arreglos técnicos, sistemas de contenido, entidad e información diferencial, arquitectura local o internacional, inteligencia paid search y reporting." },
        { title: "Capa de medición", body: "El reporting revisa visibilidad, indexación, desempeño de contenido, señales pagas/orgánicas, calidad de leads y oportunidades de iteración." },
        { title: "Lo que Taskcover no hará", items: ["Prometer rankings garantizados", "Publicar testimonios falsos", "Inventar métricas de clientes", "Activar tracking antes de la arquitectura de consentimiento de la tarea 16"] },
      ],
      primaryCta: { label: "Empezar con auditoría SEO gratuita", href: "/free-seo-audit" },
    },
    "how-we-work": {
      ...trustContent.en.pages["how-we-work"],
      meta: { title: "Cómo trabajamos", description: "Entiende el flujo de colaboración de Taskcover: solicitud, descubrimiento, auditoría, roadmap, ejecución, reporting, aprobaciones y alcance." },
      breadcrumb: "Cómo trabajamos",
      eyebrow: "Proceso de colaboración",
      h1: "Un flujo práctico desde la primera solicitud hasta la ejecución search.",
      intro: "Esta página explica la calificación, descubrimiento, auditoría, priorización, ejecución, reporting, aprobaciones y aportes del cliente.",
      heroNotes: ["Alcance claro antes de ejecutar", "Aprobaciones de contenido y técnicas explícitas", "Sin promesas de tiempo de respuesta o resultados"],
      railTitle: "Lo que suelen aportar los clientes",
      railItems: ["Acceso al sitio y analytics si aplica", "Prioridades de negocio y mercados", "Revisión especializada", "Contactos técnicos para implementación"],
      sections: [
        { title: "Después de la primera solicitud", body: "Taskcover revisa el tipo de solicitud, mercado, contexto del sitio y objetivos. Si hay encaje, el descubrimiento se centra en prioridades, restricciones search y recursos disponibles." },
        { title: "Descubrimiento y auditoría", body: "La auditoría identifica problemas técnicos, patrones de indexación, oportunidades de demanda, brechas de contenido, necesidades de autoridad, señales PPC y fricción de conversión." },
        { title: "Roadmap y sprints", body: "Taskcover prioriza por impacto, dependencia y viabilidad. La ejecución puede avanzar en sprints con aprobación del cliente." },
        { title: "Reporting y comunicación", body: "El reporting conecta métricas search con señales de negocio. El ritmo de revisión y comunicación se define dentro del engagement." },
      ],
      primaryCta: { label: "Reservar llamada estratégica", href: "/book-a-call" },
      secondaryCta: { label: "Contactar a Taskcover", href: "/contact" },
    },
    "privacy-policy": esLegal(
      "privacy-policy",
      "Política de privacidad",
      "Privacidad",
      "Esta política explica cómo Taskcover Agency, operada por Stoa Global Corporation, puede recopilar, usar, almacenar y compartir información de visitantes, leads, contactos y usuarios Admin. Requiere revisión legal final antes del lanzamiento.",
      ["Formularios de leads y llamadas", "Consultas de contacto, medios y referencias privadas", "Solicitudes de datos", "Datos Admin, técnicos, seguridad, cookies y medición futura con consentimiento"],
      [
        { title: "Información proporcionada", body: "Los visitantes pueden proporcionar nombre, email, empresa, cargo, sitio web, mercado, sector, intereses de servicio, objetivos, ventanas de llamada, intención de contacto y mensaje." },
        { title: "Datos técnicos y seguridad", body: "El sitio puede procesar metadatos de solicitud, rutas de origen, parámetros UTM, señales anti-spam, rate limiting, estado de Turnstile si está configurado, sesiones Admin y cookies estrictamente necesarias." },
        { title: "Proveedores", body: "La arquitectura implementada o prevista incluye Cloudflare, Neon, Resend, HubSpot, Cal.com y Cloudinary para hosting, base de datos, email, CRM, reservas, medios y seguridad." },
        { title: "Uso y retención", body: "Los datos se usan para responder solicitudes, evaluar encaje de servicios, operar flujos Admin, proteger formularios y gestionar operaciones. La retención depende de necesidades comerciales, de seguridad, legales y operativas." },
        { title: "Solicitudes y cambios", body: `Las solicitudes de acceso, corrección, eliminación, baja de marketing u otra acción pueden enviarse por la página de solicitud de datos o a ${companyDetails.email}. Puede requerirse verificación de identidad.` },
      ]
    ),
    "cookie-policy": esLegal(
      "cookie-policy",
      "Política de cookies",
      "Cookies",
      "Taskcover usa una arquitectura de cookies conservadora. Las cookies estrictamente necesarias pueden apoyar seguridad, sesiones Admin, preferencias, protección anti-spam y funciones del sitio. Analytics y publicidad se difieren a la tarea 16.",
      ["Estrictamente necesarias", "Preferencias", "Analytics", "Marketing / publicidad"],
      [
        { title: "Estrictamente necesarias", body: "Apoyan seguridad, sesiones Admin, protección de formularios, preferencias, rate limiting y funcionamiento del sitio. Permanecen siempre activas." },
        { title: "Preferencias", body: "El almacenamiento de preferencias puede recordar elecciones de categorías en el navegador, sin activar analytics ni publicidad." },
        { title: "Analytics", body: "GA4, Google Tag Manager o herramientas similares no se cargan en esta tarea. Cualquier activación futura debe leer el estado de consentimiento." },
        { title: "Marketing y publicidad", body: "Las etiquetas publicitarias o de remarketing no están activadas. Deberán conectarse en la tarea 16 y respetar las preferencias guardadas." },
      ]
    ),
    terms: esLegal(
      "terms",
      "Términos del sitio web",
      "Términos",
      "Estos términos regulan el uso del sitio de Taskcover Agency y los flujos de consulta. Están redactados para un sitio informativo profesional y requieren revisión legal antes del lanzamiento.",
      ["Sitio informativo", "Propuestas y contratos separados", "Sin asesoría legal, financiera o profesional", "Sin resultados SEO/PPC garantizados"],
      [
        { title: "Uso del sitio", body: "Los visitantes pueden usar el sitio para entender servicios, metodología, pruebas y rutas de contacto. No se permite intentar acceder a sistemas Admin o internos, evadir seguridad o enviar material engañoso." },
        { title: "Contenido y consultas", body: "El contenido es informativo. Enviar un formulario o solicitud de llamada no crea automáticamente una relación cliente. Alcances, precios y compromisos se manejan en propuestas o contratos separados." },
        { title: "Sin garantías", body: "El rendimiento search depende de competencia, implementación, algoritmos, mercado, presupuesto y otros factores. Taskcover no garantiza rankings, tráfico, leads, ingresos o visibilidad en IA." },
        { title: "Propiedad intelectual y terceros", body: "Los textos, diseños y materiales del sitio pertenecen a Taskcover o sus licenciantes salvo indicación distinta. El sitio puede apoyarse en proveedores externos." },
      ]
    ),
    accessibility: esLegal(
      "accessibility",
      "Declaración de accesibilidad",
      "Accesibilidad",
      "Taskcover busca ofrecer experiencias digitales prácticas y accesibles, con mejora continua. El sitio apunta a alinearse con WCAG 2.2 AA cuando sea viable, sin afirmar certificación ni conformidad total auditada.",
      ["URL afectada", "Dispositivo y navegador", "Tecnología asistiva si se usa", "Descripción de la barrera", "Método de contacto preferido"],
      [
        { title: "Enfoque", body: "Taskcover usa HTML semántico, controles por teclado, foco visible, contraste legible, atributos de idioma, soporte de movimiento reducido y etiquetas de formulario cuando es posible." },
        { title: "Canales de feedback", body: `Los problemas de accesibilidad pueden reportarse a ${companyDetails.email} o al ${companyDetails.phone}.` },
        { title: "Mejora continua", body: "Las correcciones se priorizan por gravedad, impacto en visitantes, viabilidad técnica y dependencias con servicios de terceros." },
      ]
    ),
    "data-request": esLegal(
      "data-request",
      "Solicita acceso, corrección, eliminación u otra acción sobre datos.",
      "Solicitud de datos",
      "Usa esta vía para solicitudes de privacidad y datos relacionadas con Taskcover Agency. No envíes documentos sensibles ni identificación gubernamental en este formulario.",
      ["Acceder a mi información", "Corregir mi información", "Eliminar mi información", "Darme de baja de marketing", "Pregunta sobre cookies/preferencias", "Otra solicitud"],
      [{ title: "Cómo funciona", body: "El formulario usa la misma arquitectura anti-spam, rate limiting, preparación para Turnstile y aceptación con base de datos que otros formularios. Si los proveedores no están disponibles, muestra una alternativa en lugar de un falso éxito." }]
    ),
    "cookie-preferences": esLegal(
      "cookie-preferences",
      "Gestiona las preferencias de cookies.",
      "Preferencias de cookies",
      "Esta página guarda preferencias de cookies neutrales respecto a proveedores para una futura integración de analytics y publicidad. No es un banner CMP completo y no activa tracking.",
      ["Estrictamente necesarias siempre activas", "Analytics y marketing desactivados por defecto", "Guardado localmente en este navegador"],
      [{ title: "Arquitectura de preferencias", body: "El helper permite leer, guardar, reiniciar, verificar categorías y emitir un evento de cambio. No se conecta GTM, GA4, Google Ads ni scripts de marketing en esta tarea." }]
    ),
  };
}

function frLegal(slug: TrustPageSlug, title: string, breadcrumb: string, intro: string, railItems: string[], sections: TrustSection[]): TrustPageContent {
  const base = trustContent.en.pages[slug];
  return {
    ...base,
    meta: { title, description: intro },
    breadcrumb,
    h1: title,
    intro,
    heroNotes: [operatorLineFr, contactLine, trustContent.fr.common.legalReview],
    railItems,
    sections,
  };
}

function esLegal(slug: TrustPageSlug, title: string, breadcrumb: string, intro: string, railItems: string[], sections: TrustSection[]): TrustPageContent {
  const base = trustContent.en.pages[slug];
  return {
    ...base,
    meta: { title, description: intro },
    breadcrumb,
    h1: title,
    intro,
    heroNotes: [operatorLineEs, contactLine, trustContent.es.common.legalReview],
    railItems,
    sections,
  };
}
