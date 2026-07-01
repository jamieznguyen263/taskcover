/**
 * Spanish services localized content.
 *
 * The hub and the high-visibility per-service fields (h1, positioning,
 * subheadline, summary, meta) are fully translated. Deep body content
 * (problem, approach, deliverables, process, outcomes, faqs) is sourced
 * from the English canonical data and falls back per docs/I18N_STRATEGY.md.
 */

import type { ServicesContent } from "../services.types";

export const services: ServicesContent = {
  hub: {
    eyebrow: "Servicios",
    h1: "Servicios de crecimiento en búsqueda diseñados para funcionar juntos.",
    positioning:
      "Un sistema conectado para Google, la búsqueda con IA y los ingresos — no una lista de tareas SEO desconectadas.",
    description:
      "Cada servicio de Taskcover se integra en el mismo sistema operativo de crecimiento en búsqueda. Puede activar una capacidad o el sistema completo; en cualquier caso, el trabajo se mide por visibilidad, confianza, prospectos e ingresos.",
    primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
    secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
    connectSection: {
      eyebrow: "Un solo sistema operativo",
      title: "Cómo se conectan los servicios.",
      description:
        "La auditoría informa la estrategia. La estrategia da forma al trabajo técnico, de contenido y de autoridad. La preparación para la búsqueda con IA lo atraviesa todo. El CRO y los informes cierran el ciclo hacia los ingresos.",
    },
    whichServiceSection: {
      eyebrow: "Encuentre su encaje",
      title: "¿Qué servicio es el adecuado para usted?",
      description:
        "¿No sabe por dónde empezar? Use los resultados siguientes para encontrar el servicio que se asigna a su mayor brecha actual.",
    },
  },
  services: {
    "seo-agency": {
      title: "Estrategia SEO",
      shortLabel: "Estrategia SEO",
      h1: "Estrategia SEO diseñada para Google, la búsqueda con IA y el crecimiento de ingresos.",
      positioning: "Una hoja de ruta de crecimiento en búsqueda priorizada — no una lista de tareas SEO.",
      subheadline:
        "Taskcover construye el SEO como un sistema de crecimiento: técnico, contenido, autoridad y preparación para la búsqueda con IA conectados a los ingresos, no a posiciones de vanidad.",
      summary:
        "Una estrategia SEO integrada que alinea el trabajo técnico, el contenido, la autoridad y la búsqueda con IA con los resultados comerciales en Estados Unidos, Canadá y Australia.",
      outcomePromise:
        "Una hoja de ruta clara y priorizada que vincula la inversión en SEO con el pipeline y los ingresos.",
      metaTitle: "Agencia SEO para Google, búsqueda con IA y crecimiento de ingresos",
      metaDescription:
        "Taskcover es una agencia de crecimiento en búsqueda que ofrece estrategia SEO para Google, búsqueda con IA e ingresos. Técnico, contenido, autoridad y preparación IA en un sistema conectado.",
    },
    "technical-seo": {
      title: "SEO técnico",
      shortLabel: "SEO técnico",
      h1: "SEO técnico que hace su sitio más fácil de rastrear, comprender, indexar y hacer crecer.",
      positioning: "Una base rápida, rastreable e indexable en la que Google y la IA puedan confiar.",
      subheadline:
        "Taskcover diagnostica y corrige los problemas técnicos que bloquean la visibilidad — desde el rastreo y la indexación hasta la arquitectura, los Core Web Vitals, el esquema y el renderizado JavaScript.",
      summary:
        "SEO técnico integral: rastreabilidad, indexación, arquitectura del sitio, Core Web Vitals, datos estructurados, SEO JavaScript y migraciones.",
      outcomePromise:
        "Una base técnica que elimina los techos de crecimiento y reduce el riesgo del trabajo futuro de contenido y autoridad.",
      metaTitle: "Servicios SEO técnicos para rastreo, indexación y crecimiento",
      metaDescription:
        "Servicios SEO técnicos que cubren rastreabilidad, indexación, arquitectura del sitio, Core Web Vitals, esquema, SEO JavaScript y migraciones en Estados Unidos, Canadá y Australia.",
    },
    "ai-search-optimization": {
      title: "Optimización para búsqueda con IA",
      shortLabel: "Búsqueda IA",
      h1: "Optimización para búsqueda con IA para marcas que quieren ser comprendidas, citadas y elegidas.",
      positioning: "Visibilidad en AI Overviews, ChatGPT y respuestas de LLM — sin garantías falsas.",
      subheadline:
        "Taskcover hace que su marca, entidades y contenido sean fáciles de descubrir, comprender y citar para las superficies de búsqueda impulsadas por IA — complementando, no reemplazando, su SEO central.",
      summary:
        "Preparación para búsqueda con IA: AI Overviews, descubribilidad LLM, claridad de entidades, contenido estructurado y autoridad digna de citar.",
      outcomePromise: "Una presencia más clara y estructurada en las superficies de respuesta IA.",
      metaTitle: "Servicios de optimización para búsqueda con IA (AI Overviews y LLM)",
      metaDescription:
        "Servicios de optimización para búsqueda con IA para AI Overviews, ChatGPT y respuestas de LLM. Contenido estructurado, claridad de entidades y autoridad digna de citar — sin garantías falsas.",
    },
    "content-marketing": {
      title: "Marketing de contenidos",
      shortLabel: "Contenidos",
      h1: "Sistemas de contenidos diseñados para la autoridad temática, la confianza y la conversión.",
      positioning: "Clusters de contenido impulsados por expertos que capturan la intención y la convierten.",
      subheadline:
        "Taskcover diseña sistemas de contenidos en torno a la intención del comprador — clusters temáticos, briefs de expertos, artículos útiles, enlazado interno, actualizaciones y páginas de conversión.",
      summary:
        "Marketing de contenidos guiado por la intención: estrategia, clusters temáticos, briefs de expertos, artículos útiles, enlazado interno, actualizaciones y contenido de conversión.",
      outcomePromise: "Mayor autoridad temática y contenido que transforma la intención en pipeline.",
      metaTitle: "Servicios de marketing de contenidos SEO para autoridad temática",
      metaDescription:
        "Servicios de marketing de contenidos para autoridad temática, confianza y conversión. Clusters guiados por intención, briefs de expertos, enlazado interno, actualizaciones y contenido de conversión.",
    },
    "digital-pr-link-building": {
      title: "RP digitales y enlazado",
      shortLabel: "RP digitales",
      h1: "Construcción de autoridad mediante menciones relevantes, enlaces y señales de confianza.",
      positioning: "Autoridad ganada en publicaciones y socios reales — nunca spam.",
      subheadline:
        "Taskcover construye autoridad con RP digitales, enlaces ganados, menciones de marca, validación de terceros, artículos de prensa y comentarios de expertos — nunca tácticas de backlinks spam.",
      summary:
        "Construcción de autoridad mediante RP digitales, enlaces ganados, menciones de marca, validación de terceros, artículos de prensa y comentarios de expertos.",
      outcomePromise: "Señales de autoridad más claras que potencian la visibilidad y la confianza.",
      metaTitle: "Servicios de RP digitales y enlazado para autoridad SEO",
      metaDescription:
        "Servicios de RP digitales y enlazado que ganan autoridad mediante menciones relevantes, artículos de prensa y comentarios de expertos. Nada de backlinks spam — solo señales de confianza reales.",
    },
    "local-seo": {
      title: "SEO local",
      shortLabel: "SEO local",
      h1: "SEO local para marcas que necesitan ganar la demanda de ciudad, zona de servicio y mapa.",
      positioning: "Gane el pack local, los mapas y las superficies de reseñas.",
      subheadline:
        "Taskcover construye sistemas SEO locales para Google Business Profile, páginas de ubicación, reseñas, páginas de aterrizaje locales, SEO multiubicación, citas y demanda de zona de servicio.",
      summary:
        "SEO local que cubre Google Business Profile, páginas de ubicación, reseñas, páginas de aterrizaje locales, SEO multiubicación, citas y SEO de zona de servicio.",
      outcomePromise: "Mayor presencia en el pack local, los mapas y las superficies de reseñas.",
      metaTitle: "Servicios SEO locales para marcas multiubicación y de zona de servicio",
      metaDescription:
        "Servicios SEO locales para Google Business Profile, páginas de ubicación, reseñas, SEO multiubicación, citas y demanda de zona de servicio en Estados Unidos, Canadá y Australia.",
    },
    "ecommerce-seo": {
      title: "SEO para e-commerce",
      shortLabel: "SEO e-commerce",
      h1: "SEO para e-commerce para categorías, productos y demanda de búsqueda con intención de compra.",
      positioning: "Visibilidad de categorías y productos centrada en los ingresos.",
      subheadline:
        "Taskcover construye sistemas SEO para e-commerce para la arquitectura de categorías, la optimización de páginas de producto, la navegación por facetas, el SEO técnico, los hubs de contenido, el enlazado interno y los recorridos de conversión.",
      summary:
        "SEO para e-commerce que cubre la arquitectura de categorías, páginas de producto, navegación por facetas, SEO técnico, hubs de contenido, enlazado interno y recorridos de conversión.",
      outcomePromise: "Más demanda cualificada con intención de compra y recorridos de conversión más claros.",
      metaTitle: "Servicios SEO para e-commerce de categorías y productos",
      metaDescription:
        "Servicios SEO para e-commerce para arquitectura de categorías, optimización de páginas de producto, navegación por facetas, SEO técnico, hubs de contenido y recorridos de conversión en Estados Unidos, Canadá y Australia.",
    },
    "international-seo": {
      title: "SEO internacional",
      shortLabel: "SEO internacional",
      h1: "SEO internacional para marcas que compiten en múltiples mercados, idiomas y regiones.",
      positioning: "Un solo sistema, adaptado a cada mercado.",
      subheadline:
        "Taskcover construye SEO internacional para Estados Unidos, Canadá y Australia — contenido específico por mercado, hreflang donde sea relevante, investigación regional de palabras clave, localización y arquitectura internacional del sitio.",
      summary:
        "SEO internacional que cubre la estrategia USA/Canadá/Australia, investigación regional de palabras clave, localización, hreflang y arquitectura internacional del sitio.",
      outcomePromise: "Una presencia adaptada a cada mercado sin contenido duplicado.",
      metaTitle: "Servicios SEO internacionales para Estados Unidos, Canadá y Australia",
      metaDescription:
        "Servicios SEO internacionales para marcas que compiten en Estados Unidos, Canadá y Australia. Contenido específico por mercado, hreflang, investigación regional de palabras clave y localización.",
    },
    "seo-audit": {
      title: "Auditoría SEO",
      shortLabel: "Auditoría SEO",
      h1: "Auditorías SEO que convierten problemas ocultos en una hoja de ruta de crecimiento priorizada.",
      positioning: "Una instantánea clara y priorizada — y un plan de 90 días para actuar.",
      subheadline:
        "La auditoría de crecimiento SEO de Taskcover cubre la instantánea técnica, el mapa de oportunidades de palabras clave, la brecha de visibilidad competitiva, la brecha de autoridad de contenido, la verificación de preparación para búsqueda con IA y una hoja de ruta a 90 días.",
      summary:
        "Auditoría de crecimiento SEO orientada a conversión: instantánea técnica, mapa de oportunidades de palabras clave, brecha de visibilidad competitiva, brecha de autoridad de contenido, verificación de preparación IA y hoja de ruta a 90 días.",
      outcomePromise: "Claridad sobre dónde actuar primero — y un plan de 90 días para cerrar las mayores brechas.",
      metaTitle: "Auditoría SEO gratuita y hoja de ruta de crecimiento | Taskcover Agency",
      metaDescription:
        "Obtenga una auditoría de crecimiento SEO gratuita de Taskcover Agency. Instantánea técnica, mapa de oportunidades de palabras clave, brecha de visibilidad competitiva, brecha de autoridad de contenido, verificación de preparación IA y hoja de ruta a 90 días.",
    },
    "ppc-management": {
      title: "Gestión de PPC",
      shortLabel: "PPC",
      h1: "Gestión de PPC alineada con el crecimiento de la búsqueda orgánica — no medios pagados aleatorios.",
      positioning: "Captura de demanda en Google Ads y Microsoft Ads, vinculada a su sistema de búsqueda.",
      subheadline:
        "Taskcover gestiona el PPC como parte del crecimiento en búsqueda: PPC local, PPC global, anuncios de búsqueda, alineación de páginas de aterrizaje, seguimiento de conversiones e inteligencia de búsqueda pagada + orgánica funcionando juntos.",
      summary:
        "Gestión de PPC que cubre PPC local, PPC global, anuncios de búsqueda, alineación de páginas de aterrizaje, seguimiento de conversiones e inteligencia de búsqueda pagada + orgánica.",
      outcomePromise: "Búsqueda pagada que captura demanda de forma eficiente y refuerza su crecimiento orgánico.",
      metaTitle: "Servicios de gestión de PPC | Google Ads y Microsoft Ads",
      metaDescription:
        "Servicios de gestión de PPC para PPC local, PPC global, anuncios de búsqueda, alineación de páginas de aterrizaje y seguimiento de conversiones — alineados con el crecimiento de la búsqueda orgánica en Estados Unidos, Canadá y Australia.",
    },
    "seo-mentor-service": {
      title: "Servicio de mentoría SEO",
      shortLabel: "Mentoría SEO",
      h1: "Mentoría SEO 1:1, coaching estratégico y asesoría para fundadores y equipos.",
      positioning: "Orientación SEO de experto para fundadores, CMO y equipos internos — no una caja negra.",
      subheadline:
        "Taskcover proporciona mentoría SEO 1:1, asesoría para fundadores y CMO, formación de equipos internos, orientación SEO técnica, revisión de estrategia de contenido, orientación en búsqueda con IA y revisiones estratégicas mensuales.",
      summary:
        "Mentoría SEO que cubre coaching 1:1, asesoría fundador/CMO, formación de equipos, orientación SEO técnica, revisión de estrategia de contenido, orientación en búsqueda IA y revisiones estratégicas mensuales.",
      outcomePromise: "Soporte de decisiones de crecimiento en búsqueda para que su equipo ejecute con confianza.",
      metaTitle: "Servicio de mentoría SEO | Coaching 1:1, asesoría y formación de equipos",
      metaDescription:
        "Servicio de mentoría SEO para fundadores, CMO y equipos internos. Coaching 1:1, asesoría estratégica, orientación SEO técnica, revisión de contenido, orientación en búsqueda IA y revisiones estratégicas mensuales.",
    },
  },
  ui: {
    exploreService: "Explorar servicio",
    module: "Módulo",
    outcome: "Resultado",
    auditPreview: "Vista previa de auditoría",
    ninetyDayPlan: "Plan a 90 días",
    illustrative: "Ilustrativo — cada auditoría se adapta a su mercado y a sus objetivos.",
    allServices: "Todos los servicios",
    allServicesTitle: "Once servicios conectados. Un sistema operativo.",
    allServicesDesc:
      "Active una capacidad o el sistema completo. En cualquier caso, el trabajo se mide por visibilidad, confianza, prospectos e ingresos.",
    notSureEyebrow: "Empiece con una imagen clara",
    notSureTitle: "¿No sabe con qué servicio empezar?",
    notSureDesc:
      "La auditoría de crecimiento SEO gratuita identifica sus mayores brechas de visibilidad, autoridad y conversión — y recomienda dónde centrarse primero.",
    decisionVisibilityQ: "¿Necesita visibilidad?",
    decisionVisibilityA:
      "Empiece con Estrategia SEO o SEO técnico para construir una base rastreable y visible.",
    decisionCaptureQ: "¿Necesita captura de demanda?",
    decisionCaptureA: "El PPC y el SEO local capturan demanda de alta intención rápidamente — local y globalmente.",
    decisionAuthorityQ: "¿Necesita autoridad?",
    decisionAuthorityA:
      "El marketing de contenidos y las RP digitales construyen las señales que Google y las superficies IA citan.",
    decisionCapabilityQ: "¿Necesita capacidad de equipo?",
    decisionCapabilityA:
      "El servicio de mentoría SEO ofrece a fundadores y equipos internos orientación de nivel senior.",
  },
};