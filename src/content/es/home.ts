/**
 * Spanish homepage content — fully localized including deep arrays.
 * Marketing-native Spanish for B2B SEO/agency buyers.
 */

import type { HomeContent } from "../home.types";
import { buildClientLogoProofAssets } from "../home-proof-assets";

const clientLogoProof = buildClientLogoProofAssets({
  hrefPrefix: "/es",
  alt: (clientName) => `Visual de prueba del caso verificado de ${clientName}`,
});

const searchSurfaces: HomeContent["searchHasChanged"]["surfaces"] = [
  {
    id: "google-organic",
    label: "Google orgánico",
    shortLabel: "Google",
    ariaLabel: "Explorar la visibilidad orgánica en Google",
    buyersSee: "Páginas posicionadas, snippets, entidades y funciones SERP que forman la primera impresión.",
    taskcoverImproves: "Acceso técnico, mapeo de intención, estructura de contenido y señales de autoridad.",
    growthSupport: "Acumula visibilidad no-marca cualificada y dirige la demanda a páginas de conversión.",
    angle: 0,
  },
  {
    id: "ai-overviews",
    label: "AI Overviews",
    shortLabel: "IA",
    ariaLabel: "Explorar la visibilidad en AI Overviews",
    buyersSee: "Bloques de respuesta resumidos y fuentes citadas antes del clic.",
    taskcoverImproves: "Secciones listas para respuestas, evidencia estructurada, claridad de entidad y fuentes citables.",
    growthSupport: "Ayuda a que la marca aparezca cuando la IA resume opciones.",
    angle: 40,
  },
  {
    id: "llms",
    label: "ChatGPT y LLM",
    shortLabel: "LLM",
    ariaLabel: "Explorar la visibilidad en ChatGPT y LLM",
    buyersSee: "Recomendaciones generadas, comparaciones y resúmenes respaldados por fuentes.",
    taskcoverImproves: "Consistencia de entidad, activos de respuesta reutilizables, calidad de fuente y autoridad temática.",
    growthSupport: "Apoya el descubrimiento asistido antes de volver a Google o al sitio web.",
    angle: 80,
  },
  {
    id: "local",
    label: "Resultados locales",
    shortLabel: "Local",
    ariaLabel: "Explorar búsqueda local y mapas",
    buyersSee: "Maps, local packs, reseñas, páginas locales y señales de área de servicio.",
    taskcoverImproves: "Arquitectura local, perfiles completos, temas de reseñas y relevancia por zona.",
    growthSupport: "Convierte demanda local de alta intención en llamadas, formularios y visitas cualificadas.",
    angle: 120,
  },
  {
    id: "reviews",
    label: "Plataformas de reseñas",
    shortLabel: "Reseñas",
    ariaLabel: "Explorar señales de confianza de reseñas",
    buyersSee: "Valoraciones, temas de reseñas, sentimiento de terceros y fricción de confianza.",
    taskcoverImproves: "Mapeo de señales de reseñas, alineación de contenido y tranquilidad en el recorrido.",
    growthSupport: "Reduce la duda cuando los compradores comparan proveedores.",
    angle: 160,
  },
  {
    id: "youtube",
    label: "YouTube",
    shortLabel: "Vídeo",
    ariaLabel: "Explorar YouTube y búsqueda en vídeo",
    buyersSee: "Explicaciones, reseñas, demostraciones y vídeos de respuesta dentro del recorrido de búsqueda.",
    taskcoverImproves: "Selección de temas, integración en páginas, estructura de transcripción y contenido de apoyo.",
    growthSupport: "Crea prueba más rica para compradores que necesitan ver la experiencia.",
    angle: 200,
  },
  {
    id: "forums",
    label: "Reddit y foros",
    shortLabel: "Foros",
    ariaLabel: "Explorar Reddit y foros en la demanda de búsqueda",
    buyersSee: "Preguntas de pares, objeciones, comparaciones y lenguaje de compra sin filtrar.",
    taskcoverImproves: "Minería de preguntas, cobertura de objeciones, respuestas con fuentes y briefs de contenido.",
    growthSupport: "Lleva el lenguaje real de compradores a páginas que posicionan, se citan y convierten.",
    angle: 240,
  },
  {
    id: "publications",
    label: "Publicaciones",
    shortLabel: "Prensa",
    ariaLabel: "Explorar publicaciones y señales de autoridad",
    buyersSee: "Menciones editoriales, comentarios expertos, citas y contexto de terceros confiables.",
    taskcoverImproves: "Objetivos de PR digital, activos de experto, higiene de prueba y rutas de autoridad.",
    growthSupport: "Construye la capa de confianza que ayuda a motores y compradores a creer en la marca.",
    angle: 280,
  },
  {
    id: "landing-pages",
    label: "Páginas de conversión",
    shortLabel: "Páginas",
    ariaLabel: "Explorar rutas de conversión en páginas",
    buyersSee: "Páginas comerciales, módulos de prueba, formularios, CTA y siguiente paso claro.",
    taskcoverImproves: "Intención de página, ubicación de prueba, rutas de CTA y caminos medibles.",
    growthSupport: "Convierte visibilidad en pipeline en lugar de dejar demanda sin convertir.",
    angle: 320,
  },
];

export const home: HomeContent = {
  hero: {
    eyebrow: "Agencia de crecimiento en búsqueda",
    headline: "SEO diseñado para Google, la búsqueda con IA y el crecimiento de ingresos.",
    subheadline:
      "Taskcover Agency ayuda a marcas en Estados Unidos, Canadá y Australia a hacer crecer su visibilidad orgánica, construir autoridad y convertir la demanda de búsqueda de alta intención en resultados comerciales medibles.",
    proofLine:
      "Explore casos de crecimiento search verificados en educación, viajes, SaaS, eCommerce, hospitalidad, seguros y marcas multi-mercado.",
    primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
    secondaryCta: { label: "Ver nuestro sistema", href: "/methodology" },
  },
  dashboard: {
    title: "Cockpit de crecimiento search",
    subtitle:
      "Google, búsqueda con IA, autoridad de contenido, salud técnica y prioridades de conversión en una sola vista operativa.",
    disclosure:
      "Vista ilustrativa del cockpit. Los datos verificados de clientes se agregan solo con autorización.",
    signals: [
      {
        label: "Demanda search",
        value: "240K",
        delta: "+18 %",
        status: "En expansión",
        icon: "search",
        tone: "teal",
      },
      {
        label: "Visibilidad orgánica",
        value: "90 %",
        delta: "+22 pts",
        status: "Acumulando",
        icon: "trend",
        tone: "emerald",
      },
      {
        label: "Cobertura de citas IA",
        value: "64 %",
        delta: "+31 pts",
        status: "En construcción activa",
        icon: "sparkles",
        tone: "blue",
      },
      {
        label: "Salud técnica",
        value: "98 %",
        delta: "+6 pts",
        status: "Protegida",
        icon: "gauge",
        tone: "green",
      },
    ],
    opportunityTitle: "Mapa de oportunidades",
    opportunitySubtitle: "Brechas prioritarias por demanda, autoridad y palanca de conversión.",
    opportunities: [
      { label: "Optimización búsqueda IA", intent: "Superficie de respuesta", value: "Alto", x: 18, y: 38 },
      { label: "Auditoría SEO técnica", intent: "Base", value: "Urgente", x: 48, y: 24 },
      { label: "SEO internacional", intent: "Expansión de mercado", value: "Escala", x: 72, y: 48 },
      { label: "Autoridad de contenido", intent: "Cobertura temática", value: "Construir", x: 34, y: 68 },
      { label: "Inteligencia PPC search", intent: "Captura de demanda", value: "Mixto", x: 82, y: 72 },
    ],
    entityTitle: "Cobertura de entidad y citas",
    entitySubtitle: "Señales de calidad de fuente que ayudan a Google y los sistemas IA a confiar en la marca.",
    entityRows: [
      { label: "Claridad de entidad de marca", value: "Fuerte", status: "Schema + fuentes alineadas" },
      { label: "Páginas listas para citar", value: "34", status: "Secciones expertas mapeadas" },
      { label: "Brechas de fuentes de confianza", value: "7", status: "Cola editorial de PR" },
    ],
    queueTitle: "Cola del próximo sprint",
    queueSubtitle: "Correcciones priorizadas antes de ampliar la producción de contenido.",
    queueRows: [
      { task: "Corregir trampas de rastreo y deriva canónica", impact: "Alto", effort: "Medio", status: "Técnico" },
      { task: "Publicar bloques FAQ listos para IA", impact: "Alto", effort: "Bajo", status: "Contenido" },
      { task: "Enrutar CTA de auditoría por intención del comprador", impact: "Medio", effort: "Bajo", status: "Conversión" },
    ],
    pathTitle: "Ruta de conversión",
    pathSteps: ["Solicitud de auditoría", "Revisión diagnóstica", "Hoja de ruta 90 días", "Decisión de sprint"],
    labels: {
      impact: "Impacto",
      effort: "Esfuerzo",
      value: "Valor",
    },
  },
  heroVideo: {
    eyebrow: "Introducción del portavoz",
    title: "Un módulo de vídeo listo para presentar el sistema Taskcover.",
    caption:
      "Una breve introducción a cómo Taskcover aborda el SEO, la búsqueda con IA y el crecimiento de ingresos.",
    playLabel: "Reproducir vídeo de introducción",
    unavailableLabel: "Vídeo pendiente de carga",
    fallbackTitle: "El vídeo del portavoz está listo para añadirse",
    fallbackBody:
      "La tarjeta está configurada para un futuro vídeo de introducción de Taskcover. No se carga vídeo falso ni de stock.",
    trustChips: ["Casos verificados", "SEO + búsqueda IA + PPC", "USA · Canadá · Australia"],
  },
  searchHasChanged: {
    eyebrow: "La búsqueda ha cambiado",
    title: "La búsqueda ya no es solo enlaces azules de Google.",
    description:
      "La demanda de búsqueda moderna está fragmentada entre Google, AI Overviews, ChatGPT y los LLM, resultados locales, plataformas de reseñas, YouTube, Reddit y foros, y publicaciones especializadas. Ganar significa ser visible y digno de confianza en todas partes donde los compradores buscan.",
    message:
      "No separamos SEO, GEO, AEO, contenido y autoridad. Los conectamos en un solo sistema de crecimiento en búsqueda.",
    surfaces: searchSurfaces,
    labels: {
      desktopGuidance: "Pasa el cursor o haz clic en una superficie",
      mobileGuidance: "Toca cada señal para ver la conexión",
      startHere: "Empieza aquí",
      defaultTitle: "Nueve superficies. Un sistema de crecimiento search.",
      defaultBody:
        "Elige un nodo para ver cómo los compradores descubren, validan y actúan antes de convertirse en lead.",
      buyersSee: "Lo que ven los compradores",
      taskcoverImproves: "Lo que mejora Taskcover",
      growthSupport: "Cómo impulsa crecimiento",
    },
  },
  operatingSystem: {
    eyebrow: "Sistema operativo de búsqueda Taskcover",
    title: "Un sistema conectado en todo el recorrido de búsqueda.",
    description:
      "Cada etapa alimenta la siguiente, de modo que la visibilidad, la autoridad y la conversión se potencian en lugar de quedar en entregables desconectados. Los informes retroalimentan la estrategia para que el sistema siga mejorando.",
    steps: [
      {
        label: "Auditoría",
        description: "Línea base técnica, de contenido, autoridad y búsqueda con IA.",
        input: "Datos de rastreo, analítica, instantáneas SERP y señales de la competencia.",
        action: "Mapear la salud técnica, las brechas de contenido, de autoridad y la preparación IA.",
        output: "Línea base priorizada con las oportunidades de mayor impacto marcadas.",
      },
      {
        label: "Estrategia",
        description: "Prioridades vinculadas a ingresos, no a posiciones de vanidad.",
        input: "Hallazgos de la auditoría, modelo de ingresos y datos de intención de compra.",
        action: "Construir un mapa de oportunidades vinculado al pipeline y a los resultados comerciales.",
        output: "Una hoja de ruta priorizada a 90 días con responsabilidades claras.",
      },
      {
        label: "SEO técnico",
        description: "Rastreo, indexación, Core Web Vitals y estructura.",
        input: "Archivos de registro, auditorías de renderizado e informes de indexación.",
        action: "Corregir el desperdicio de rastreo, mejorar la estructura y reforzar las señales de confianza.",
        output: "Un sitio rápido, rastreable e indexable en el que Google y la IA puedan confiar.",
      },
      {
        label: "Autoridad de contenido",
        description: "Clusters temáticos impulsados por expertos, vinculados a la intención de compra.",
        input: "Mapa de intención y análisis de brechas frente a la competencia.",
        action: "Construir clusters impulsados por expertos que capturen y conviertan la demanda.",
        output: "Un sistema de contenido que se acumula vinculado a la intención de ingresos.",
      },
      {
        label: "Preparación para búsqueda con IA",
        description: "Datos estructurados, citas y activos optimizados para respuestas.",
        input: "Modelo de entidades, auditoría de esquema y revisión de formato de respuesta.",
        action: "Optimizar para AI Overviews, ChatGPT y citas de LLM.",
        output: "Activos listos para responder que las superficies IA pueden encontrar y citar.",
      },
      {
        label: "RP digitales",
        description: "Señales de autoridad de publicaciones y socios reales.",
        input: "Línea base de autoridad y lista de objetivos relevantes.",
        action: "Ejecutar divulgación basada en datos y cobertura basada en relaciones.",
        output: "Señales de autoridad y referencias de confianza (enlaces añadidos cuando se confirman).",
      },
      {
        label: "CRO",
        description: "Convertir el tráfico de alta intención en pipeline e ingresos.",
        input: "Analítica de embudo, mapas de calor y rutas de conversión.",
        action: "Eliminar fricción y reforzar las llamadas a la acción en páginas clave.",
        output: "Mayor conversión en la demanda de búsqueda cualificada.",
      },
      {
        label: "Informes",
        description: "Paneles centrados en el impacto comercial, no solo en informes de tráfico.",
        input: "Datos de rendimiento en Google, IA y atribución de ingresos.",
        action: "Traducir señales en decisiones y en el plan del próximo sprint.",
        output: "Una revisión clara que devuelve la visión a la estrategia.",
      },
    ],
  },
  growthPlays: {
    eyebrow: "Playbook de crecimiento en búsqueda",
    title: "Jugadas repetibles, no campañas únicas.",
    description:
      "Cada jugada describe el desafío que abordamos, la estrategia que aplicamos y el resultado que producimos — mapeado al sistema operativo de búsqueda Taskcover.",
    featured: {
      title: "Jugada SEO de viajes globales",
      tag: "Viajes",
      challenge:
        "Demanda de viajes muy competitiva en múltiples mercados, idiomas y superficies de agregadores.",
      strategy:
        "Arquitectura SEO internacional, clusters de destino guiados por intención y RP digitales para la autoridad de destino.",
      output:
        "Priorización clara de mercados, mapa de demanda de reserva directa y hoja de ruta de contenido centrada en autoridad.",
      systemStages: ["Auditoría", "SEO técnico", "Autoridad de contenido", "RP digitales"],
      cta: { label: "Ver la jugada", href: "/work/case-studies" },
    },
    plays: [
      {
        title: "Confianza en educación e institucional",
        tag: "Educación",
        challenge: "Construir credibilidad para audiencias educativas e institucionales.",
        strategy:
          "Contenido impulsado por expertos, datos de programas estructurados y RP a través de publicaciones de confianza.",
        output: "Sistema de contenido centrado en confianza y plan de cobertura de autoridad.",
        systemStages: ["Estrategia", "Autoridad de contenido", "RP digitales"],
        cta: { label: "Ver la jugada", href: "/work/case-studies" },
      },
      {
        title: "Recuperación SEO técnica",
        tag: "Recuperación técnica",
        challenge:
          "Pérdida repentina de visibilidad por migraciones, indexación o actualizaciones centrales.",
        strategy:
          "Análisis de rastreo y registros, reparación de indexación y reversiones estructuradas.",
        output: "Hoja de ruta de recuperación con correcciones técnicas priorizadas.",
        systemStages: ["Auditoría", "SEO técnico", "Informes"],
        cta: { label: "Ver la jugada", href: "/services/technical-seo" },
      },
      {
        title: "Visibilidad en búsqueda con IA",
        tag: "Búsqueda IA",
        challenge: "Ausente en AI Overviews, ChatGPT y respuestas de LLM.",
        strategy:
          "Contenido optimizado para respuestas, datos estructurados y autoridad digna de citar.",
        output: "Evaluación de preparación IA y plan de activos optimizados para respuestas.",
        systemStages: ["Preparación para búsqueda con IA", "Autoridad de contenido"],
        cta: { label: "Ver la jugada", href: "/services/ai-search-optimization" },
      },
      {
        title: "RP digitales y autoridad",
        tag: "RP digitales",
        challenge: "Autoridad de dominio débil y bajas señales de referencia de confianza.",
        strategy:
          "Historias basadas en datos y divulgación basada en relaciones hacia publicaciones relevantes.",
        output: "Pipeline de cobertura editorial (enlaces añadidos cuando se confirman).",
        systemStages: ["RP digitales", "Autoridad de contenido"],
        cta: { label: "Ver la jugada", href: "/services/digital-pr-link-building" },
      },
    ],
  },
  servicesBento: {
    eyebrow: "Servicios",
    title: "Cada servicio vinculado a un resultado comercial.",
    description:
      "Sin entregables aislados. Cada capacidad se integra en el sistema de crecimiento en búsqueda y se mide por ingresos e impacto en el pipeline.",
    featureCard: {
      title: "Estrategia SEO",
      outcome: "Una hoja de ruta priorizada vinculada a ingresos, no a posiciones de vanidad.",
      href: "/services/seo-agency",
      roadmap: [
        { phase: "Diagnosticar", detail: "Línea base técnica, de contenido, autoridad e IA." },
        { phase: "Priorizar", detail: "Oportunidades clasificadas por impacto en ingresos." },
        { phase: "Secuenciar", detail: "Sprints de 90 días con responsabilidades claras." },
        { phase: "Acumular", detail: "Autoridad y visibilidad que crecen con el tiempo." },
      ],
      chips: [
        "Mapeo de intención",
        "Atribución de ingresos",
        "Hoja de ruta a 90 días",
        "Re-planificación trimestral",
      ],
      outcomePreview:
        "Una hoja de ruta de crecimiento en búsqueda lista para decisiones, que su equipo puede ejecutar con confianza.",
    },
    cards: [
      {
        title: "SEO técnico",
        outcome: "Un sitio rápido, rastreable e indexable en el que Google y la IA puedan confiar.",
        href: "/services/technical-seo",
        icon: "technical",
        span: "default",
        visual: "crawl",
      },
      {
        title: "Optimización para búsqueda con IA",
        outcome: "Visibilidad en AI Overviews, ChatGPT y respuestas de LLM.",
        href: "/services/ai-search-optimization",
        icon: "ai",
        span: "default",
        visual: "citation",
      },
      {
        title: "Marketing de contenidos",
        outcome: "Clusters de contenido impulsados por expertos que capturan y convierten la intención.",
        href: "/services/content-marketing",
        icon: "content",
        span: "wide",
        visual: "cluster",
      },
      {
        title: "RP digitales y enlazado",
        outcome: "Señales de autoridad de publicaciones y socios reales.",
        href: "/services/digital-pr-link-building",
        icon: "pr",
        span: "default",
        visual: "authority",
      },
      {
        title: "SEO local",
        outcome: "Gane el pack local, los mapas y las superficies de reseñas.",
        href: "/services/local-seo",
        icon: "local",
        span: "default",
        visual: "pins",
      },
      {
        title: "SEO para e-commerce",
        outcome: "Visibilidad de categorías y productos que impulsa los ingresos.",
        href: "/services/ecommerce-seo",
        icon: "ecommerce",
        span: "default",
        visual: "products",
      },
      {
        title: "SEO internacional",
        outcome: "Un sistema adaptado a cada mercado sin contenido duplicado.",
        href: "/services/international-seo",
        icon: "international",
        span: "default",
        visual: "globe",
      },
      {
        title: "Analítica e informes",
        outcome: "Paneles centrados en el impacto comercial, no solo en informes de tráfico.",
        href: "/services/seo-audit",
        icon: "analytics",
        span: "wide",
        visual: "dashboard",
      },
      {
        title: "Gestión de PPC",
        outcome: "Captura de demanda en búsqueda pagada, alineada con el crecimiento orgánico.",
        href: "/services/ppc-management",
        icon: "ppc",
        span: "default",
        visual: "ppc",
      },
      {
        title: "Servicio de mentoría SEO",
        outcome: "Coaching estratégico 1:1, asesoría para fundadores y formación de equipos.",
        href: "/services/seo-mentor-service",
        icon: "mentor",
        span: "default",
        visual: "mentor",
      },
    ],
  },
  industries: {
    eyebrow: "Industrias",
    title: "Diseñado para industrias donde la búsqueda impulsa los ingresos.",
    description:
      "Cada sector vertical tiene diferentes patrones de intención, competidores y señales de confianza. Adaptamos el sistema en consecuencia.",
    cards: [
      {
        title: "SEO para viajes y hostelería",
        short: "Viajes",
        pain: "Alta fuga de embudo hacia OTAs y agregadores.",
        opportunity: "Capturar la demanda de reserva directa y la autoridad de destino.",
        solution: "Sistemas de contenido de destino y propiedad guiados por intención.",
        intentPattern: "Demanda intensa de destinos, propiedades y comparaciones.",
        trustSignals: "Reseñas, cobertura editorial y autoridad de destino.",
        recommendedServices: ["SEO técnico", "Autoridad de contenido", "RP digitales"],
        href: "/industries/travel-seo",
      },
      {
        title: "SEO para educación e institucional",
        short: "Educación",
        pain: "Ciclos de consideración largos y decisiones muy basadas en confianza.",
        opportunity: "Dominar la intención de programa, resultado y comparación.",
        solution: "Clusters de contenido impulsados por expertos y datos de programas estructurados.",
        intentPattern: "Recorridos de investigación guiados por programas, resultados y comparaciones.",
        trustSignals: "Acreditaciones, resultados y comentarios de expertos.",
        recommendedServices: ["Estrategia SEO", "Autoridad de contenido", "Preparación para búsqueda con IA"],
        href: "/industries/education-seo",
      },
      {
        title: "SEO para salud y bienestar",
        short: "Salud",
        pain: "Requisitos estrictos de confianza y cumplimiento.",
        opportunity: "Ganar visibilidad en la intención de condición, tratamiento y proveedor.",
        solution: "Contenido centrado en E-E-A-T y citas autorizadas.",
        intentPattern: "Demanda guiada por condiciones, tratamientos y proveedores.",
        trustSignals: "Autoridad clínica, citas y señales E-E-A-T.",
        recommendedServices: ["SEO técnico", "Autoridad de contenido", "RP digitales"],
        href: "/industries/healthcare-seo",
      },
      {
        title: "SEO para legal e inmigración",
        short: "Legal",
        pain: "Demanda de alto riesgo, alta intención y basada en reputación.",
        opportunity: "Convertir la intención de tipo de caso y jurisdicción.",
        solution: "Contenido centrado en confianza, reseñas y autoridad local.",
        intentPattern: "Demanda de tipo de caso, jurisdicción e intención urgente.",
        trustSignals: "Reseñas, credenciales del colegio de abogados y autoridad local.",
        recommendedServices: ["SEO local", "Autoridad de contenido", "RP digitales"],
        href: "/industries/legal-immigration-seo",
      },
      {
        title: "SEO para SaaS y tecnología",
        short: "SaaS",
        pain: "Términos de categoría saturados y compradores orientados a comparación.",
        opportunity: "Dominar la intención de categoría, alternativa e integración.",
        solution: "Contenido de comparación, SEO de integraciones y páginas product-led.",
        intentPattern: "Investigación guiada por categoría, alternativas e integraciones.",
        trustSignals: "Pruebas de producto, integraciones y reseñas de expertos.",
        recommendedServices: ["Estrategia SEO", "Autoridad de contenido", "Preparación para búsqueda con IA"],
        href: "/industries/saas-seo",
      },
      {
        title: "SEO para e-commerce",
        short: "e-commerce",
        pain: "Competencia en páginas de categoría y producto.",
        opportunity: "Visibilidad de categoría y producto centrada en ingresos.",
        solution: "SEO técnico para comercio y datos de producto estructurados.",
        intentPattern: "Demanda de categoría, producto y transaccional.",
        trustSignals: "Reseñas, datos estructurados y confianza de fulfillment.",
        recommendedServices: ["SEO técnico", "CRO", "Analítica e informes"],
        href: "/industries/ecommerce-seo",
      },
      {
        title: "SEO para franquicias y multiubicación",
        short: "Franquicia",
        pain: "Visibilidad local inconsistente entre ubicaciones.",
        opportunity: "Ganar el pack local y los mapas de cada ubicación.",
        solution: "SEO local a escala con arquitectura de autoridad de ubicación.",
        intentPattern: "Demanda «cerca de mí» y específica de ubicación.",
        trustSignals: "Reseñas por ubicación y datos comerciales consistentes.",
        recommendedServices: ["SEO local", "SEO técnico", "Autoridad de contenido"],
        href: "/industries/franchise-local-seo",
      },
    ],
  },
  markets: {
    eyebrow: "Mercados",
    title: "Contexto local para Estados Unidos, Canadá y Australia.",
    description:
      "Cada mercado tiene su propio comportamiento de búsqueda, competidores y señales de confianza. No duplicamos contenido entre regiones.",
    cards: [
      {
        title: "Agencia SEO Estados Unidos",
        region: "Estados Unidos",
        context:
          "SERPs nacionales y locales hipercompetitivas en los 50 estados, con fuerte adopción de respuestas IA y señales de confianza basadas en reseñas.",
        href: "/markets/usa-seo-agency",
        highlights: [
          "Priorización de mercados nacional y local",
          "Estrategia de superficie de respuestas IA y reseñas",
          "Consideraciones de cumplimiento multiestado",
        ],
        differentiator: "Escala y adopción de respuestas IA",
        mapDots: [
          { x: 25, y: 40 },
          { x: 50, y: 55 },
          { x: 75, y: 35 },
        ],
      },
      {
        title: "Agencia SEO Canadá",
        region: "Canadá",
        context:
          "Patrones de demanda bilingües y regionales, con fuerte comportamiento de pack local y dinámicas de mercado provincial distintas. Soporte completo del sitio planificado para inglés, francés y español.",
        href: "/markets/canada-seo-agency",
        highlights: [
          "Mapeo de demanda en inglés y francés (Quebec)",
          "Priorización provincial y metropolitana",
          "Contenido bilingüe y optimización del pack local",
        ],
        differentiator: "Contexto bilingüe EN/FR",
        mapDots: [
          { x: 30, y: 30 },
          { x: 55, y: 45 },
          { x: 70, y: 25 },
        ],
      },
      {
        title: "Agencia SEO Australia",
        region: "Australia",
        context:
          "Demanda metropolitana concentrada, fuerte intención local y alta sensibilidad a las reseñas en las capitales y hubs regionales.",
        href: "/markets/australia-seo-agency",
        highlights: [
          "Mapeo de mercados de capitales y regionales",
          "Enfoque en pack local y reputación de reseñas",
          "Preparación para expansión trans-Tasman y APAC",
        ],
        differentiator: "Demanda metropolitana concentrada",
        mapDots: [
          { x: 40, y: 55 },
          { x: 60, y: 40 },
          { x: 75, y: 65 },
        ],
      },
    ],
  },
  methodology: {
    eyebrow: "Metodología",
    title: "El proceso de crecimiento SEO de 90 días de Taskcover.",
    description:
      "Un ritmo repetible que acumula visibilidad, autoridad y conversión sin convertirse en una caja negra.",
    phases: [
      {
        phase: "Días 1–30",
        label: "Diagnosticar y mapear",
        detail:
          "Línea base de salud técnica, contenido, autoridad y preparación IA. Mapear oportunidades a ingresos.",
        steps: ["Descubrimiento", "Auditoría de crecimiento SEO", "Mapa de oportunidades"],
      },
      {
        phase: "Días 31–60",
        label: "Construir y corregir",
        detail:
          "Ejecutar correcciones técnicas y construir clusters de contenido impulsados por expertos vinculados a la intención de compra.",
        steps: ["Sprint de 90 días", "Construcción de contenido y autoridad"],
      },
      {
        phase: "Días 61–90",
        label: "Autoridad y conversión",
        detail:
          "Acumular autoridad con RP digitales y convertir la demanda cualificada mediante CRO e informes claros.",
        steps: ["RP digitales", "CRO", "Revisión mensual de inteligencia de búsqueda"],
      },
    ],
  },
  technology: {
    eyebrow: "Capa de inteligencia de búsqueda",
    title: "Una capa tecnológica que convierte los datos de búsqueda en decisiones.",
    description:
      "Conectamos el análisis de rastreo, el mapeo de intención, el seguimiento de visibilidad IA y los informes para que la estrategia siempre esté guiada por evidencia.",
    modules: [
      {
        id: "technical",
        title: "Análisis de rastreo técnico",
        detail:
          "Las auditorías de rastreo conscientes del renderizado, el análisis de registros y el seguimiento de indexación revelan problemas estructurales antes de que cuesten visibilidad.",
        capabilities: [
          "Rastreo consciente del renderizado en páginas con mucho JS",
          "Análisis de archivos de registro para el desperdicio de presupuesto de rastreo",
          "Cobertura de indexación y salud canónica",
        ],
        monitors: "Errores de rastreo, URL huérfanas, cadenas de redireccionamiento y regresiones de Core Web Vitals.",
        decision: "Priorizar las correcciones de ingeniería que desbloquean visibilidad antes de la inversión en contenido.",
        visual: "crawl-health",
      },
      {
        id: "intent",
        title: "Mapeo de palabras clave e intención",
        detail:
          "Demanda mapeada por etapa de intención y vinculada a ingresos para que el contenido apunte a compradores cualificados, no a volumen de vanidad.",
        capabilities: [
          "Clasificación de intención (comercial, informacional, transaccional)",
          "Puntuación de demanda ponderada por ingresos",
          "Mapeo por etapa de embudo y por cluster temático",
        ],
        monitors: "Cambios de intención, señales de canibalización y salud de la agrupación de palabras clave.",
        decision: "Dirigir la producción de contenido hacia la demanda que convierte, no al volumen de vanidad.",
        visual: "intent-matrix",
      },
      {
        id: "ai",
        title: "Seguimiento de visibilidad IA",
        detail:
          "Monitoreo en AI Overviews y respuestas de LLM para ver dónde se cita su marca — y dónde están ganando los competidores.",
        capabilities: [
          "Seguimiento de superficie de citas de AI Overviews",
          "Monitoreo de menciones en respuestas de LLM",
          "Comparación de menciones IA de la competencia",
        ],
        monitors: "Presencia de citas, cobertura de respuestas y share of voice IA de la competencia.",
        decision: "Asignar la inversión de preparación IA donde las brechas de cita sean mayores.",
        visual: "ai-coverage",
      },
      {
        id: "content",
        title: "Modelado de brechas de contenido",
        detail:
          "Análisis de clusters y brechas frente a la competencia para priorizar el contenido que acumula autoridad.",
        capabilities: [
          "Análisis de cobertura de clusters temáticos",
          "Identificación de brechas de contenido de la competencia",
          "Puntuación del potencial de autoridad por tema",
        ],
        monitors: "Salud de clusters, señales de decaimiento de contenido y fuerza del enlazado interno.",
        decision: "Secuenciar la producción de contenido por potencial de autoridad e ingresos.",
        visual: "cluster-coverage",
      },
      {
        id: "serp",
        title: "Análisis SERP de la competencia",
        detail:
          "Seguimiento de funcionalidades SERP y de la cuota de la competencia para entender las superficies que realmente generan demanda.",
        capabilities: [
          "Seguimiento de cuota de funcionalidades SERP",
          "Benchmarking de visibilidad de la competencia",
          "Mapeo de oportunidades por superficie",
        ],
        monitors: "Inestabilidad de funcionalidades, movimientos de la competencia y adopción de nuevas superficies.",
        decision: "Elegir qué superficies SERP atacar para máxima captura de demanda.",
        visual: "serp-comparison",
      },
      {
        id: "reporting",
        title: "Paneles de informes",
        detail:
          "Informes centrados en el impacto comercial que conectan el rendimiento de búsqueda con el pipeline y los ingresos.",
        capabilities: [
          "Unificación de KPIs de visibilidad, confianza e ingresos",
          "Modelado de atribución a lo largo del recorrido de búsqueda",
          "Formato de revisión mensual listo para ejecutivos",
        ],
        monitors: "Dirección de tendencias, ritmo de objetivos e indicadores adelantados de crecimiento.",
        decision: "Traducir el rendimiento de búsqueda en decisiones comerciales a nivel de consejo.",
        visual: "kpi-dashboard",
      },
      {
        id: "conversion",
        title: "Seguimiento de conversiones",
        detail:
          "Análisis de embudo y rutas de conversión para convertir la demanda de búsqueda cualificada en leads y clientes.",
        capabilities: [
          "Análisis de rutas de conversión multi-touch",
          "Detección de fricción en landing pages",
          "Priorización de oportunidades de CRO",
        ],
        monitors: "Puntos de caída del embudo, abandono de formularios y efectividad de los CTA.",
        decision: "Corregir fugas de conversión antes de invertir en más adquisición de tráfico.",
        visual: "funnel-chart",
      },
      {
        id: "authority",
        title: "Monitoreo de autoridad",
        detail:
          "Seguimiento de referencias, citas y señales de autoridad para medir el efecto acumulativo de las RP digitales.",
        capabilities: [
          "Seguimiento de referencias y menciones",
          "Monitoreo de tendencias de autoridad de dominio",
          "Presencia de citas en fuentes de confianza",
        ],
        monitors: "Velocidad de enlaces, calidad de menciones e impulso de las señales de autoridad.",
        decision: "Guiar las RP digitales hacia las publicaciones que más mueven la autoridad.",
        visual: "mention-graph",
      },
    ],
  },
  mediaCommentary: {
    eyebrow: "Medios y comentarios de expertos",
    title: "Señales de autoridad en inteligencia de búsqueda.",
    description:
      "Ofrecemos comentarios de expertos en inteligencia de búsqueda, búsqueda con IA, estrategia SEO y RP digitales — sin fabricar publicaciones ni cobertura.",
    categories: [
      {
        label: "Comentarios sobre inteligencia de búsqueda",
        detail:
          "Perspectiva sobre cambios de algoritmo, funcionalidades SERP y tendencias de visibilidad orgánica.",
      },
      {
        label: "Perspectiva sobre búsqueda con IA",
        detail:
          "Análisis de AI Overviews, respuestas de LLM y cómo las marcas pueden ganar citas.",
      },
      {
        label: "Análisis de estrategia SEO",
        detail:
          "Comentarios sobre diseño de hojas de ruta, mapeo de intención y programas de búsqueda centrados en ingresos.",
      },
      {
        label: "RP digitales y autoridad",
        detail:
          "Visión sobre señales de autoridad, cobertura editorial y construcción de confianza de marca.",
      },
    ],
  },
  videoProof: {
    eyebrow: "Confianza registrada",
    title: "Un marco de prueba diseñado para activos autorizados.",
    description:
      "No fabricamos testimonios ni vídeos. Este marco está listo para introducciones de portavoces, clips de reseñas de clientes y recorridos de casos cuando se proporcionan activos autorizados.",
    slots: [
      {
        label: "Introducción del portavoz",
        detail: "Quién lidera el trabajo y por qué funciona el sistema.",
      },
      {
        label: "Clip de reseña de cliente",
        detail: "Un cliente explica qué cambió y por qué importó.",
      },
      {
        label: "Recorrido de caso",
        detail: "Un recorrido guiado de un engagement de crecimiento en búsqueda.",
      },
    ],
  },
  comparison: {
    eyebrow: "Por qué Taskcover",
    title: "Proveedor SEO tradicional vs Taskcover Agency.",
    description: "Mismo presupuesto, sistema muy diferente. Aquí es donde divergen los enfoques.",
    rows: [
      {
        dimension: "Modelo de engagement",
        traditional: "Lista de tareas mensuales con prioridad comercial poco clara.",
        taskcover:
          "Un sistema de crecimiento en búsqueda priorizado, vinculado a visibilidad, confianza e ingresos.",
      },
      {
        dimension: "Medida de éxito",
        traditional: "Posiciones reportadas de forma aislada de los resultados comerciales.",
        taskcover:
          "Visibilidad, confianza, demanda cualificada y señales de ingresos rastreadas juntas.",
      },
      {
        dimension: "Estrategia de contenido",
        traditional: "Artículos de blog genéricos desconectados de la intención de compra.",
        taskcover:
          "Clusters de contenido impulsados por expertos, mapeados a intención e ingresos.",
      },
      {
        dimension: "Informes",
        traditional: "Un informe de tráfico con poca conexión al pipeline.",
        taskcover:
          "Paneles centrados en el impacto comercial en Google, búsqueda con IA y atribución.",
      },
      {
        dimension: "Búsqueda con IA",
        traditional: "Trata la búsqueda con IA como fuera del alcance o la ignora.",
        taskcover: "Preparación para Google y búsqueda con IA integrada en cada engagement.",
      },
      {
        dimension: "Transparencia de ejecución",
        traditional: "Ejecución en caja negra con visibilidad limitada de las prioridades.",
        taskcover: "Una hoja de ruta transparente y priorizada con responsabilidades claras.",
      },
      {
        dimension: "Señales de autoridad",
        traditional: "Tácticas de enlaces de baja calidad o basadas en volumen.",
        taskcover:
          "RP digitales basadas en relaciones con publicaciones y socios reales.",
      },
      {
        dimension: "Conversión / calidad de leads",
        traditional: "Volumen de tráfico priorizado sobre demanda cualificada.",
        taskcover:
          "Enfoque CRO en convertir la demanda de búsqueda de alta intención en pipeline.",
      },
      {
        dimension: "Hoja de ruta estratégica",
        traditional: "Listas de tareas reactivas, mes a mes.",
        taskcover: "Una hoja de ruta de 90 días que se acumula y se replanifica cada trimestre.",
      },
    ],
  },
  brandExperience: {
    caption:
      "Casos verificados en educación, hospitalidad, viajes, software, seguros y crecimiento search multi-mercado.",
    logos: clientLogoProof,
    cta: { label: "Ver casos de estudio", href: "/es/work/case-studies" },
  },
  audit: {
    eyebrow: "Auditoría de crecimiento SEO gratuita",
    title: "Vea exactamente dónde se fugue su crecimiento en búsqueda.",
    description:
      "Una instantánea clara y priorizada de su salud técnica, autoridad de contenido, preparación IA y brecha competitiva — con un esquema de hoja de ruta a 90 días.",
    checklist: [
      "Instantánea SEO técnica",
      "Mapa de oportunidades de palabras clave",
      "Brecha de visibilidad competitiva",
      "Brecha de autoridad de contenido",
      "Verificación de preparación para búsqueda con IA",
      "Hoja de ruta a 90 días",
    ],
    primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
  },
  caseStudyPreview: {
    eyebrow: "Caso de estudio verificado",
    title: "British University Vietnam: +37 % de tráfico orgánico.",
    description: "Explora 10 casos de estudio verificados de Taskcover Agency.",
    metricLabel: "Tráfico orgánico",
    metricValue: "+37 %",
    clientName: "British University Vietnam",
    cta: { label: "Ver todos los casos", href: "/es/work/case-studies" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas, respondidas directamente.",
    items: [
      {
        q: "¿Qué hace Taskcover Agency?",
        a: "Taskcover Agency es una agencia de crecimiento en búsqueda. Ayudamos a las marcas a hacer crecer su visibilidad orgánica, construir autoridad, mejorar su preparación para la búsqueda con IA y convertir la demanda de búsqueda de alta intención en resultados comerciales medibles en Google y las superficies de búsqueda impulsadas por IA.",
      },
      {
        q: "¿Qué diferencia a Taskcover de una agencia SEO tradicional?",
        a: "Tratamos el SEO, el contenido, la autoridad y la búsqueda con IA como un solo sistema conectado en lugar de entregables aislados, y medimos el éxito por visibilidad, confianza, prospectos e ingresos en lugar de solo posiciones.",
      },
      {
        q: "¿Trabajan con empresas en Estados Unidos, Canadá y Australia?",
        a: "Sí. Trabajamos con clientes en Estados Unidos, Canadá y Australia, con contexto específico de cada mercado en lugar de contenido duplicado.",
      },
      {
        q: "¿Garantizan posiciones?",
        a: "Ninguna agencia seria puede garantizar posiciones específicas, y no hacemos garantías de posicionamiento. Nos centramos en visibilidad duradera, autoridad y resultados comerciales que podamos influir y medir realmente.",
      },
      {
        q: "¿Qué es la optimización para búsqueda con IA?",
        a: "La optimización para búsqueda con IA consiste en hacer que su contenido y datos estructurados sean fáciles de encontrar, citar y confiar para las superficies impulsadas por IA — como AI Overviews y respuestas de LLM. Complementa, no reemplaza, al SEO tradicional.",
      },
      {
        q: "¿Cuánto tiempo tarda el SEO?",
        a: "Los plazos dependen de su mercado, competencia, línea base técnica y madurez de contenido. Estructuramos el trabajo en sprints de 90 días con prioridades claras, mientras construimos autoridad que se acumula a más largo plazo.",
      },
      {
        q: "¿Pueden combinar SEO técnico y contenido?",
        a: "Sí. El SEO técnico, el contenido, la autoridad y la preparación para búsqueda con IA se entregan como un solo sistema conectado, no como flujos de trabajo separados.",
      },
      {
        q: "¿Qué incluye la auditoría SEO gratuita?",
        a: "La auditoría de crecimiento SEO gratuita incluye una instantánea técnica, un mapa de oportunidades de palabras clave, una brecha de visibilidad competitiva, una brecha de autoridad de contenido, una verificación de preparación para búsqueda con IA y una hoja de ruta a 90 días.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Inicie su sistema de crecimiento en búsqueda",
    title: "Construya un sistema de búsqueda que sus competidores no puedan copiar fácilmente.",
    description:
      "Obtenga una imagen clara y priorizada de dónde están sus brechas de visibilidad, autoridad y conversión — y un plan de 90 días para cerrarlas.",
    primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
    secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
  },
  ui: {
    osLoopLabel: "Los informes devuelven la visión a la estrategia",
    osStageLabel: "Etapa",
    osInputLabel: "Entrada",
    osActionLabel: "Acción",
    osOutputLabel: "Resultado",
    osCompoundLabel: "Cada etapa se acumula en la siguiente",
    featuredPlay: "Jugada destacada",
    challengeLabel: "Desafío",
    strategyLabel: "Estrategia",
    outputLabel: "Resultado",
    connectedToSystem: "Conectado al sistema operativo de búsqueda",
    coreModule: "Módulo central",
    roadmapLabel: "Hoja de ruta",
    businessOutcome: "Resultado comercial",
    explore: "Explorar",
    activeVertical: "Sector activo",
    painPoint: "Punto de dolor",
    opportunityLabel: "Oportunidad",
    taskcoverSolution: "Solución Taskcover",
    intentPattern: "Patrón de intención",
    trustSignals: "Señales de confianza",
    recommendedServices: "Servicios recomendados",
    viewIndustry: "Ver",
    differentiator: "Diferenciador",
    phasesLabel: "Fases",
    traditionalLabel: "Proveedor SEO tradicional",
    taskcoverLabel: "Taskcover Agency",
    auditTechnical: "Técnico",
    auditAiReady: "Listo IA",
    auditContent: "Contenido",
    auditAuthority: "Autoridad",
    auditScored: "Evaluado",
  },
};
