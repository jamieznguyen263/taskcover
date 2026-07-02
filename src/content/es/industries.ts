/**
 * Spanish industries content — hub + all 7 industry detail objects + UI strings.
 *
 * Credibility rules (see docs/SEO_STANDARDS.md):
 *  - No fabricated metrics, testimonials, or case-study numbers.
 *  - Brand names referenced only as selected team/partner experience context.
 *  - Slugs and icons stay English/shared across locales.
 */

import type { IndustriesContent } from "../industries.types";

export const industries: IndustriesContent = {
  hub: {
    eyebrow: "Sectores",
    h1: "Sistemas SEO sectoriales diseñados según cómo buscan realmente los compradores.",
    positioning:
      "Cada sector tiene patrones de intención, señales de confianza, necesidades de contenido y rutas de conversión diferentes. Adaptamos el sistema a cómo busca realmente tu mercado.",
    description:
      "El SEO genérico deja de funcionar cuando la intención de búsqueda cambia según el sector. Viajes, educación, salud, legal, SaaS, e-commerce y franquicia recompensan cada uno una combinación diferente de trabajo técnico, de contenido, de autoridad, local y de búsqueda IA.",
    primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
    secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
    selectorSection: {
      eyebrow: "Mapa de sectores",
      title: "Encuentra el sector que coincide con tu desafío de búsqueda.",
      description:
        "Viajes y Educación son sectores prioritarios donde Taskcover tiene experiencia relevante en equipo y socios. Cada sector a continuación recibe un sistema adaptado, no una plantilla.",
      priorityBadge: "Sector prioritario",
    },
    comparisonSection: {
      eyebrow: "Matriz de comportamientos de búsqueda",
      title: "Cómo difieren los sectores en búsqueda.",
      description:
        "La misma tarea SEO produce resultados diferentes en distintos sectores. Esta matriz muestra dónde está la verdadera fricción — para que sepas qué priorizar.",
      columns: [
        { key: "intent", label: "Intención de búsqueda" },
        { key: "trust", label: "Sensibilidad de confianza" },
        { key: "content", label: "Profundidad de contenido" },
        { key: "demand", label: "Local vs nacional" },
        { key: "authority", label: "Necesidad de autoridad" },
        { key: "cycle", label: "Ciclo de conversión" },
      ],
    },
    bundlesSection: {
      eyebrow: "Paquetes de servicios",
      title: "Paquetes de servicios recomendados por necesidad.",
      description:
        "La mayoría de los sectores necesitan una pila conectada — no un solo servicio. Estos paquetes agrupan las capacidades de Taskcover según el resultado que cada sector más necesita.",
      groups: [
        {
          label: "Fundación técnica",
          description: "Rastreo, indexación, arquitectura y Core Web Vitals.",
          slugs: ["technical-seo", "seo-audit", "seo-agency"],
        },
        {
          label: "Autoridad de contenido",
          description: "Clústeres dirigidos por expertos, enlazado interno y profundidad temática.",
          slugs: ["content-marketing", "digital-pr-link-building", "ai-search-optimization"],
        },
        {
          label: "Visibilidad IA / búsqueda",
          description: "Claridad de entidades, datos estructurados y activos citables.",
          slugs: ["ai-search-optimization", "technical-seo", "content-marketing"],
        },
        {
          label: "Crecimiento local o internacional",
          description: "Páginas de ubicación, arquitectura multi-mercado y hreflang.",
          slugs: ["local-seo", "international-seo", "technical-seo"],
        },
        {
          label: "Captura de demanda de pago",
          description: "Anuncios de búsqueda alineados con la intención orgánica para captura rápida.",
          slugs: ["ppc-management", "seo-agency"],
        },
      ],
    },
    ctaSection: {
      eyebrow: "Empieza con una auditoría sectorial",
      title: "Obtén una auditoría de crecimiento SEO específica para tu sector.",
      description:
        "Dinos tu sector y revisaremos la salud técnica, la demanda de búsqueda, las brechas competitivas, la autoridad de contenido y la preparación IA — luego mapearemos un plan de 90 días.",
    },
  },

  industries: {
    "travel-seo": {
      slug: "travel-seo",
      icon: "travel",
      name: "SEO Viajes y Hostelería",
      eyebrow: "Viajes y Hostelería",
      h1: "SEO Viajes para autoridad de destino, reservas directas y demanda multilingüe.",
      metaTitle: "Servicios SEO Viajes y Hostelería para Destinos y Reservas",
      metaDescription:
        "SEO Viajes para SERPs de destino, competencia de agregadores, demanda estacional, búsqueda internacional y respuestas IA de viajes. Sistemas adaptados, no plantillas.",
      heroDescription:
        "La búsqueda de viajes está fragmentada entre OTA, agregadores, plataformas de reseñas y respuestas IA. Taskcover construye autoridad de destino, demanda de reserva directa y visibilidad multilingüe — la experiencia seleccionada del equipo y socios incluye marcas y campañas globales de viajes incluyendo Agoda y Skyscanner.",
      marketContext:
        "Los compradores de viajes investigan destinos, comparan propiedades, leen reseñas y piden recomendaciones a herramientas IA antes de reservar. Las SERPs están dominadas por agregadores, OTA y marketplaces — las marcas directas deben ganar autoridad, datos estructurados y contenido de destino para competir.",
      buyerSearchBehavior:
        "La demanda se divide entre consultas de destino (« cosas que hacer en Kioto »), comparaciones de propiedades y rutas (« Agoda vs Booking.com »), intención estacional (« mejor época para visitar Bali ») y consultas de recomendación IA (« dónde alojarse en Lisboa »). Cada tipo de consulta necesita contenido, estructura y señales de confianza diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los compradores de viajes",
        description:
          "El recorrido de búsqueda de viajes pasa de la inspiración a la comparación y luego a la reserva — cada etapa recompensa un trabajo SEO diferente.",
        steps: [
          { stage: "Inspiración", label: "Descubrimiento de destino", description: "Los compradores exploran « mejores lugares para visitar » y contenido estacional — la autoridad de destino y las guías ganan." },
          { stage: "Investigación", label: "Comparación de propiedades y rutas", description: "Los compradores comparan propiedades, rutas y precios — los datos estructurados y el contenido de comparación ganan." },
          { stage: "Validación", label: "Verificaciones de reseñas y confianza", description: "Los compradores verifican reseñas y señales de autoridad antes de reservar." },
          { stage: "Reserva", label: "Decisión directa vs agregador", description: "Los compradores deciden entre reserva directa y OTA — el contenido de conversión y la confianza ganan." },
          { stage: "Respuestas IA", label: "Recomendaciones de viajes IA", description: "Los compradores piden a las herramientas IA consejos de destino y propiedad — el contenido citable gana." },
        ],
      },
      painPoints: {
        title: "Dónde las marcas de viajes pierden demanda de búsqueda.",
        description:
          "Las SERPs de viajes están entre las más competitivas. Estos son los puntos de fricción que cuestan reservas directas y autoridad de destino.",
        items: [
          { label: "Competencia de destino", detail: "Los agregadores y OTA dominan las SERPs de destino y propiedad, empujando a las marcas directas bajo el pliegue.", severity: "high" },
          { label: "Dominio de SERPs por agregadores", detail: "Los agregadores de comparación y reserva poseen la intención transaccional, dejando a las marcas directas con demanda de awareness.", severity: "high" },
          { label: "Demanda multilingüe", detail: "Los compradores de viajes buscan en su idioma nativo — la mayoría de las marcas directas sirven un solo idioma y pierden demanda internacional.", severity: "medium" },
          { label: "Volatilidad estacional", detail: "La demanda sube y baja estacionalmente — el contenido y la preparación técnica deben anticipar ciclos, no reaccionar a ellos.", severity: "medium" },
          { label: "Brechas de confianza de reseñas", detail: "Los compradores validan con reseñas en múltiples plataformas — una estrategia de reseñas inconsistente erosiona la confianza en el momento de reserva.", severity: "medium" },
          { label: "Ausencia de respuestas IA de viajes", detail: "Las herramientas IA recomiendan cada vez más destinos y propiedades — las marcas ausentes de contenido citable pierden cuota.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las marcas de viajes pueden ganar.",
        items: [
          "Poseer autoridad de contenido de destino donde los agregadores tienen páginas finas y de plantilla",
          "Capturar demanda de reserva directa con datos estructurados de propiedad y precios",
          "Ganar demanda multilingüe y multi-mercado con arquitectura internacional adecuada",
          "Obtener citas en respuestas IA de viajes con guías de destino y contenido experto",
          "Anticipar demanda estacional con contenido sincronizado con ciclos de reserva",
          "Construir autoridad de destino mediante RP digitales con publicaciones de viajes",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO de viajes conectado.",
        description:
          "Conectamos lo técnico, el contenido, la autoridad, lo internacional, la búsqueda IA y la conversión en un solo sistema — cada capa refuerza la siguiente.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura diseñados para grandes catálogos de destinos y propiedades." },
          { label: "Autoridad de contenido de destino", description: "Guías de destino, páginas de propiedades y contenido de comparación estructurados para búsqueda e IA." },
          { label: "Arquitectura internacional", description: "Hreflang, estrategia de locale y contenido multilingüe para demanda de viajes transfronteriza." },
          { label: "Autoridad de RP digitales", description: "Menciones ganadas en publicaciones de viajes que construyen autoridad de destino y marca." },
          { label: "Preparación de búsqueda IA", description: "Datos estructurados y activos citables para superficies de respuestas IA de viajes." },
          { label: "Rutas de conversión", description: "Enlazado interno y CRO que dirigen la intención de destino hacia reservas directas." },
        ],
      },
      recommendedServices: ["international-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ai-search-optimization", "ppc-management"],
      fitSummary: {
        title: "Cómo se integra el viaje en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Autoridad de destino y reservas directas" },
          { label: "Tipo de demanda de búsqueda", value: "Destino, comparación, estacionalidad, recomendación IA" },
          { label: "Requisito de confianza", value: "Reseñas, cobertura editorial, autoridad de destino" },
          { label: "Trayectoria de crecimiento", value: "Alcance multilingüe → conversión directa" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["technical-seo"] },
          { label: "Demanda", slugs: ["international-seo", "ppc-management"] },
          { label: "Autoridad", slugs: ["content-marketing", "digital-pr-link-building"] },
          { label: "Escala", slugs: ["ai-search-optimization"] },
        ],
      },
      contentStrategy: {
        title: "Contenido de destino que acumula autoridad.",
        description:
          "El contenido de viajes debe servir la intención de inspiración, comparación y reserva. Construimos clústeres de destino con enlazado interno que canaliza la demanda hacia la conversión.",
        pillars: [
          "Guías de destino que poseen la intención de « mejores lugares para visitar » y « cosas que hacer »",
          "Páginas de propiedades y tipos de propiedades con datos estructurados para consultas de comparación",
          "Contenido estacional y de itinerarios sincronizado con ciclos de reserva",
          "Contenido de comparación que captura la intención « vs » y alternativa",
          "Contenido de confianza y reseñas que valida la decisión de reserva",
        ],
      },
      authorityStrategy: {
        title: "Autoridad de destino mediante cobertura ganada.",
        description:
          "La autoridad de viajes viene de publicaciones relevantes, menciones de destino y comentarios de expertos — nunca de tácticas de enlaces spam.",
        tactics: [
          "RP digitales con publicaciones de viajes y medios de destino",
          "Historias de viajes basadas en datos (tendencias estacionales, patrones de reserva, insights de destino)",
          "Comentarios de portavoces experto sobre tendencias de viajes y hostelería",
          "Activos de destino citables que las superficies IA referencian",
        ],
      },
      localInternationalAngle: {
        title: "Demanda de viajes internacional y multilingüe",
        description:
          "Los viajes son intrínsecamente internacionales. Diseñamos arquitectura hreflang, estrategia de locale y contenido localizado para que la página correcta gane demanda en cada mercado e idioma.",
      },
      trustSignals:
        "Reseñas, cobertura editorial, autoridad de destino y datos estructurados que validan decisiones de reserva en todas las plataformas y superficies IA.",
      outcomes: [
        { label: "Cobertura de búsqueda más clara", description: "Intención de destino, propiedad y comparación capturada en todo el embudo." },
        { label: "Señales de confianza más fuertes", description: "Reseñas, menciones y autoridad que validan decisiones de reserva." },
        { label: "Mejor demanda calificada", description: "El contenido alcanza a los compradores en las etapas de inspiración, investigación y reserva." },
        { label: "Visibilidad internacional más fuerte", description: "La arquitectura multilingüe y multi-mercado captura demanda transfronteriza." },
        { label: "Mejor preparación IA de viajes", description: "Contenido citable estructurado para superficies de respuestas IA." },
      ],
      faqs: [
        { q: "¿Tienen experiencia en SEO de viajes?", a: "La experiencia seleccionada del equipo y socios incluye marcas y campañas globales en viajes y crecimiento de búsqueda, incluyendo el contexto de Agoda y Skyscanner. Los nombres de marca se mencionan únicamente como contexto de experiencia y no implican respaldo." },
        { q: "¿Pueden ayudar con la competencia de OTA y agregadores?", a: "Sí. Construimos autoridad de destino, datos estructurados y contenido de reserva directa que ayuda a las marcas directas a competir con agregadores y OTA en las consultas que importan." },
        { q: "¿Gestionan SEO de viajes multilingüe?", a: "Sí. La arquitectura internacional, hreflang y el contenido localizado son fundamentales para el SEO de viajes — la demanda de viajes es intrínsecamente transfronteriza y multilingüe." },
        { q: "¿Cómo abordan las respuestas IA de viajes?", a: "Estructuramos el contenido de destino y propiedad para que las superficies IA puedan analizarlo, resumirlo y citarlo — creando las condiciones que hacen las citas más probables." },
        { q: "¿Garantizan aumentos de reservas directas?", a: "No. Nos enfocamos en visibilidad duradera, autoridad y rutas de conversión que podemos influir y medir — no garantías de reserva específicas." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO Viajes.",
        description:
          "Ve exactamente dónde está tu visibilidad de destino, propiedad y reserva directa — y obtén un plan de 90 días para cerrar las brechas.",
        auditLabel: "Tu auditoría de viajes incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (destino, propiedad, comparación)",
          "Brecha competitiva vs agregadores y OTA",
          "Brecha de autoridad de contenido",
          "Verificación de preparación IA de viajes",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["education-seo", "saas-seo", "ecommerce-seo"],
    },

    "education-seo": {
      slug: "education-seo",
      icon: "education",
      name: "SEO Educación e Institucional",
      eyebrow: "Educación e Instituciones",
      h1: "SEO Educación para visibilidad de programas, confianza institucional y ciclos de decisión largos.",
      metaTitle: "Servicios SEO Educación e Institucional para Programas y Confianza",
      metaDescription:
        "SEO Educación para búsqueda de programas, intención de comparación, confianza institucional, ciclos de decisión largos y demanda de estudiantes internacionales. Sistemas adaptados para educación.",
      heroDescription:
        "Las decisiones educativas son de mucha confianza y orientadas a la investigación. Taskcover construye autoridad de programas, datos estructurados y contenido experto para ciclos de consideración largos — la experiencia seleccionada del equipo y socios incluye contexto educativo e institucional global incluyendo British Council.",
      marketContext:
        "Los estudiantes y familias investigan programas, comparan instituciones, validan resultados y buscan orientación experta durante semanas o meses. Las señales de confianza — acreditación, resultados, autoridad del profesorado — pesan mucho tanto en Google como en superficies de respuestas IA.",
      buyerSearchBehavior:
        "La demanda educativa se centra en consultas de programas (« programas de MBA en Canadá »), intención de comparación (« universidad vs instituto »), preguntas de resultados (« vale la pena este título ») e investigación de estudiantes internacionales. Cada etapa necesita señales de confianza y profundidad de contenido diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los compradores de educación",
        description:
          "El recorrido educativo es largo y orientado a la confianza. Cada etapa recompensa un trabajo de contenido y autoridad diferente.",
        steps: [
          { stage: "Descubrimiento", label: "Exploración de programas y campos", description: "Los estudiantes exploran campos y tipos de programas — el contenido amplio de programas y resultados gana." },
          { stage: "Comparación", label: "Comparación de instituciones y programas", description: "Los estudiantes comparan programas, costos y resultados — los datos estructurados de programas ganan." },
          { stage: "Validación", label: "Verificaciones de acreditación y confianza", description: "Los estudiantes y familias verifican acreditación, resultados y reputación." },
          { stage: "Decisión", label: "Solicitud e inscripción", description: "Los estudiantes avanzan hacia la solicitud — el contenido de conversión y rutas claras ganan." },
          { stage: "Internacional", label: "Investigación de estudiantes transfronterizos", description: "Los estudiantes internacionales investigan en su idioma — el contenido localizado y la confianza ganan." },
        ],
      },
      painPoints: {
        title: "Dónde las instituciones educativas pierden demanda de búsqueda.",
        description:
          "El SEO educativo falla cuando las instituciones lo tratan como marketing de contenido genérico. Estos son los puntos de fricción que cuestan inscripciones y autoridad.",
        items: [
          { label: "Ciclos de decisión largos", detail: "Los estudiantes investigan durante semanas o meses — el contenido debe sostener autoridad durante todo el recorrido, no solo una visita.", severity: "high" },
          { label: "Brechas de comparación de programas", detail: "Los estudiantes comparan programas entre instituciones — la mayoría de los sitios carecen de datos estructurados y contenido de comparación.", severity: "high" },
          { label: "Déficits de confianza institucional", detail: "La acreditación, los resultados y la autoridad del profesorado son escasos o faltan — erosionando la confianza en el momento de decisión.", severity: "high" },
          { label: "Brechas en preguntas de resultados", detail: "Los estudiantes preguntan « vale la pena » — la mayoría de las instituciones carecen de contenido honesto sobre resultados y valor.", severity: "medium" },
          { label: "Demanda de estudiantes internacionales", detail: "Los estudiantes internacionales buscan en su idioma y contexto — la mayoría de las instituciones sirven un solo locale y pierden demanda.", severity: "medium" },
          { label: "Datos de programas no estructurados", detail: "Los detalles de programas están enterrados en PDFs o páginas genéricas — haciéndolos invisibles para búsqueda y superficies IA.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las instituciones educativas pueden ganar.",
        items: [
          "Poseer autoridad de programas y campos de estudio con clústeres de contenido experto",
          "Capturar intención de comparación con datos estructurados y comparaciones honestas",
          "Construir confianza con contenido de acreditación, resultados y autoridad del profesorado",
          "Ganar demanda de estudiantes internacionales con contenido y arquitectura localizados",
          "Obtener citas en respuestas IA con contenido de programas estructurado y citable",
          "Sostener autoridad durante ciclos largos con contenido de actualización y nurturing",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO educativo orientado a confianza.",
        description:
          "Conectamos lo técnico, el contenido, la autoridad, la búsqueda IA y lo internacional en un sistema diseñado para ciclos de decisión educativos largos.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura para grandes catálogos de programas y cursos." },
          { label: "Autoridad de contenido de programas", description: "Clústeres de programas, resultados y campos de estudio dirigidos por expertos que construyen confianza." },
          { label: "Datos de programas estructurados", description: "Schema y contenido estructurado que hacen los programas comprensibles para máquinas en búsqueda e IA." },
          { label: "Autoridad institucional", description: "RP digitales y comentarios de expertos que construyen credibilidad institucional y del profesorado." },
          { label: "Preparación de búsqueda IA", description: "Contenido educativo citable para superficies de respuestas IA." },
          { label: "Alcance de estudiantes internacionales", description: "Contenido y arquitectura localizados para demanda educativa transfronteriza." },
        ],
      },
      recommendedServices: ["content-marketing", "technical-seo", "ai-search-optimization", "digital-pr-link-building", "international-seo", "seo-mentor-service"],
      fitSummary: {
        title: "Cómo se integra la educación en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Autoridad de programas y confianza institucional" },
          { label: "Tipo de demanda de búsqueda", value: "Programas, comparación, resultados, internacional" },
          { label: "Requisito de confianza", value: "Acreditación, resultados, autoridad del profesorado" },
          { label: "Trayectoria de crecimiento", value: "Confianza de ciclo largo → pipeline de inscripción" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["technical-seo"] },
          { label: "Demanda", slugs: ["international-seo"] },
          { label: "Autoridad", slugs: ["content-marketing", "digital-pr-link-building"] },
          { label: "Escala", slugs: ["ai-search-optimization", "seo-mentor-service"] },
        ],
      },
      contentStrategy: {
        title: "Contenido que construye confianza en ciclos largos.",
        description:
          "El contenido educativo debe responder a preguntas de programas, resultados y comparación con experiencia genuina. Construimos clústeres que sostienen autoridad durante todo el recorrido de decisión.",
        pillars: [
          "Páginas de programas y cursos con datos estructurados para búsqueda e IA",
          "Clústeres de campos de estudio que poseen la intención amplia de descubrimiento y comparación",
          "Contenido de resultados y valor que responde honestamente a « vale la pena »",
          "Contenido de autoridad de acreditación, profesorado e institucional",
          "Contenido para estudiantes internacionales localizado para demanda transfronteriza",
        ],
      },
      authorityStrategy: {
        title: "Autoridad institucional mediante experiencia y cobertura.",
        description:
          "La autoridad educativa viene de acreditación, experiencia del profesorado y cobertura en publicaciones confiables — no de esquemas de enlaces.",
        tactics: [
          "RP digitales con publicaciones educativas e industriales",
          "Comentarios del profesorado y expertos sobre tendencias educativas y de carrera",
          "Historias basadas en datos (resultados, inscripciones, tendencias educativas)",
          "Activos de programas y resultados citables que las superficies IA referencian",
        ],
      },
      localInternationalAngle: {
        title: "Demanda de estudiantes internacionales",
        description:
          "Los estudiantes internacionales son un segmento de demanda importante. Diseñamos contenido y arquitectura localizados para que las instituciones alcancen estudiantes a través de mercados e idiomas.",
      },
      trustSignals:
        "Acreditación, resultados, autoridad del profesorado, comentarios de expertos y datos estructurados de programas que validan decisiones educativas en búsqueda y superficies IA.",
      outcomes: [
        { label: "Cobertura de búsqueda más clara", description: "Intención de programas, campos y comparación capturada en todo el recorrido." },
        { label: "Señales de confianza más fuertes", description: "Acreditación, resultados y experiencia que validan decisiones." },
        { label: "Mejor demanda calificada", description: "El contenido alcanza a los estudiantes en las etapas de descubrimiento, comparación y decisión." },
        { label: "Alcance internacional más fuerte", description: "El contenido localizado captura demanda transfronteriza de estudiantes." },
        { label: "Mejor preparación de búsqueda IA", description: "Contenido de programas estructurado para superficies de respuestas IA." },
      ],
      faqs: [
        { q: "¿Tienen experiencia en SEO educativo?", a: "La experiencia seleccionada del equipo y socios incluye contexto educativo e institucional global, incluyendo el contexto de British Council. Los nombres de marca se mencionan únicamente como contexto de experiencia y no implican respaldo." },
        { q: "¿Pueden ayudar con contenido de comparación de programas?", a: "Sí. Construimos datos estructurados de programas y contenido de comparación honesta que captura la intención de comparación que los estudiantes realmente buscan." },
        { q: "¿Gestionan SEO para estudiantes internacionales?", a: "Sí. La arquitectura internacional, localización y estrategia de contenido transfronteriza son fundamentales para el SEO educativo." },
        { q: "¿Cómo abordan los ciclos de decisión largos?", a: "Construimos clústeres de contenido que sostienen autoridad durante todo el recorrido — descubrimiento, comparación, validación y decisión — con contenido de actualización y nurturing." },
        { q: "¿Garantizan aumentos de inscripciones?", a: "No. Nos enfocamos en visibilidad duradera, autoridad y demanda calificada que podemos influir y medir — no garantías de inscripción." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO Educación.",
        description:
          "Ve exactamente dónde está tu visibilidad de programas, institucional y de resultados — y obtén un plan de 90 días para construir confianza y capturar demanda.",
        auditLabel: "Tu auditoría educativa incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (programas, campos, comparación)",
          "Brecha competitiva",
          "Brecha de autoridad de contenido y confianza",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["travel-seo", "healthcare-seo", "saas-seo"],
    },

    "healthcare-seo": {
      slug: "healthcare-seo",
      icon: "healthcare",
      name: "SEO Salud y Bienestar",
      eyebrow: "Salud y Bienestar",
      h1: "SEO Salud para confianza, credibilidad experta y demanda de servicios locales.",
      metaTitle: "Servicios SEO Salud y Bienestar para Confianza y Demanda Local",
      metaDescription:
        "SEO Salud para sensibilidad de confianza, credibilidad experta, demanda local, páginas de servicios y contenido consciente del cumplimiento. Sin afirmaciones médicas — sistemas orientados a autoridad.",
      heroDescription:
        "La búsqueda de salud es sensible a la confianza y orientada localmente. Taskcover construye contenido experto, visibilidad de área de servicio y señales de reputación — con mensajería consciente del cumplimiento que evita afirmaciones médicas.",
      marketContext:
        "Los pacientes y familias buscan condiciones, tratamientos, proveedores y servicios locales. Las señales de confianza — revisión experta, credenciales, reputación — pesan mucho, y los requisitos de cumplimiento dan forma a lo que se puede y no se puede afirmar.",
      buyerSearchBehavior:
        "La demanda de salud se divide entre consultas de condiciones, investigación de tratamientos, búsqueda de proveedores e intención de servicios locales (« cerca de mí »). Cada tipo necesita señales de confianza, profundidad de contenido y visibilidad local diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los compradores de salud",
        description:
          "El recorrido de salud va de la investigación de síntomas a la selección de proveedores — cada etapa recompensa la confianza y la visibilidad local.",
        steps: [
          { stage: "Investigación", label: "Exploración de condiciones y tratamientos", description: "Los pacientes investigan condiciones y tratamientos — el contenido autoritario y revisado por expertos gana." },
          { stage: "Evaluación", label: "Comparación de proveedores y clínicas", description: "Los pacientes comparan proveedores y clínicas — las páginas de servicios estructuradas ganan." },
          { stage: "Local", label: "Búsquedas de servicios cerca de mí", description: "Los pacientes buscan proveedores y servicios cercanos — el paquete local y la ficha de Google ganan." },
          { stage: "Validación", label: "Verificaciones de reseñas y reputación", description: "Los pacientes validan con reseñas y reputación antes de reservar." },
          { stage: "Decisión", label: "Reserva y contacto", description: "Los pacientes avanzan hacia la reserva — rutas de conversión claras y confianza ganan." },
        ],
      },
      painPoints: {
        title: "Dónde las marcas de salud pierden demanda de búsqueda.",
        description:
          "El SEO de salud falla cuando las señales de confianza son débiles o el contenido hace afirmaciones que no puede sostener. Estos son los puntos de fricción que cuestan pacientes y autoridad.",
        items: [
          { label: "Sensibilidad de confianza y cumplimiento", detail: "El contenido de salud debe ser preciso, revisado por expertos y consciente del cumplimiento — afirmaciones débiles erosionan la confianza y arriesgan penalizaciones.", severity: "high" },
          { label: "Brechas de intención local", detail: "Los pacientes buscan « cerca de mí » — una ficha de Google, páginas de ubicación y presencia de paquete local débiles cuestan demanda cercana.", severity: "high" },
          { label: "Déficits de credibilidad experta", detail: "El contenido carece de revisión experta o credenciales — fallando las señales de confianza que la salud exige.", severity: "high" },
          { label: "Delgadez de páginas de servicios", detail: "Las páginas de servicios y tratamientos son finas o de plantilla — perdiendo visibilidad en consultas de alta intención.", severity: "medium" },
          { label: "Brechas de señales de reputación", detail: "Las reseñas se ganan lentamente y se gestionan raramente — debilitando la confianza en el momento de reserva.", severity: "medium" },
          { label: "Ausencia de respuestas IA", detail: "Las superficies IA responden cada vez más preguntas de salud — las marcas sin contenido citable pierden cuota.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las marcas de salud pueden ganar.",
        items: [
          "Poseer autoridad de condiciones y tratamientos con contenido revisado por expertos",
          "Ganar demanda local con ficha de Google, páginas de ubicación y estrategia de área de servicio",
          "Construir confianza con credenciales, revisión experta y señales de reputación",
          "Capturar intención de proveedores y servicios con páginas de servicios estructuradas",
          "Obtener citas en respuestas IA con contenido de salud autoritario y citable",
          "Fortalecer rutas de conversión de búsqueda local a reserva",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO de salud orientado a confianza.",
        description:
          "Conectamos lo técnico, el contenido, la autoridad, lo local y la búsqueda IA en un sistema diseñado para confianza y cumplimiento de salud.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura para catálogos de servicios y proveedores." },
          { label: "Contenido revisado por expertos", description: "Contenido de condiciones, tratamientos y servicios revisado por precisión y confianza." },
          { label: "Visibilidad local", description: "Ficha de Google, páginas de ubicación y estrategia de área de servicio para demanda cerca de mí." },
          { label: "Señales de reputación", description: "Estrategia y gestión de reseñas que construyen confianza en el momento de reserva." },
          { label: "Preparación de búsqueda IA", description: "Contenido de salud citable estructurado para superficies de respuestas IA." },
          { label: "Mensajería consciente del cumplimiento", description: "Guía de contenido que evita afirmaciones médicas y respeta los límites de cumplimiento." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "seo-audit", "ai-search-optimization"],
      fitSummary: {
        title: "Cómo se integra la salud en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Visibilidad local y de servicio basada en confianza" },
          { label: "Tipo de demanda de búsqueda", value: "Condición, tratamiento, proveedor, cerca de mí" },
          { label: "Requisito de confianza", value: "Revisión de expertos, credenciales, reputación" },
          { label: "Trayectoria de crecimiento", value: "Autoridad conforme → reserva" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["technical-seo", "seo-audit"] },
          { label: "Demanda", slugs: ["local-seo"] },
          { label: "Autoridad", slugs: ["content-marketing"] },
          { label: "Escala", slugs: ["ai-search-optimization"] },
        ],
      },
      contentStrategy: {
        title: "Contenido que gana confianza de salud.",
        description:
          "El contenido de salud debe ser revisado por expertos, preciso y genuinamente útil. Construimos clústeres de condiciones y servicios que las señales de confianza validan.",
        pillars: [
          "Contenido de condiciones y tratamientos revisado por precisión y autoridad",
          "Páginas de servicios y proveedores con datos estructurados para búsqueda e IA",
          "Contenido local y de área de servicio para demanda cerca de mí",
          "Contenido de confianza y credenciales que valida la experiencia",
          "Contenido del recorrido del paciente de investigación a reserva",
        ],
      },
      authorityStrategy: {
        title: "Autoridad mediante experiencia y reputación.",
        description:
          "La autoridad de salud viene de revisión experta, credenciales y reputación — no de tácticas de enlaces agresivas.",
        tactics: [
          "Contenido revisado por expertos que demuestra experiencia genuina",
          "RP digitales con publicaciones de salud y bienestar",
          "Estrategia de reputación y reseñas que construye confianza",
          "Activos de salud citables que las superficies IA referencian",
        ],
      },
      trustSignals:
        "Revisión experta, credenciales, acreditación, reputación y datos estructurados que validan decisiones de salud en búsqueda y superficies IA.",
      outcomes: [
        { label: "Cobertura de búsqueda más clara", description: "Intención de condiciones, tratamientos, servicios y proveedores capturada." },
        { label: "Señales de confianza más fuertes", description: "Experiencia, credenciales y reputación que validan decisiones." },
        { label: "Mejor visibilidad local", description: "Ficha de Google, páginas de ubicación y presencia de paquete local para demanda cerca de mí." },
        { label: "Mejor demanda calificada", description: "El contenido alcanza a los pacientes en las etapas de investigación, evaluación y reserva." },
        { label: "Mejor preparación de búsqueda IA", description: "Contenido de salud citable para superficies de respuestas IA." },
      ],
      faqs: [
        { q: "¿Hacen afirmaciones médicas en el contenido?", a: "No. Evitamos afirmaciones médicas y mensajería riesgosa para el cumplimiento. El contenido es revisado por expertos cuando corresponde y se enfoca en información útil y autorizada." },
        { q: "¿Pueden ayudar con SEO de salud local?", a: "Sí. La optimización de la ficha de Google, páginas de ubicación, estrategia de área de servicio y visibilidad del paquete local son fundamentales para la captura de demanda de salud." },
        { q: "¿Cómo gestionan la revisión experta?", a: "Construimos sistemas de contenido diseñados para revisión experta y proporcionamos guía sobre cómo demostrar experiencia y credenciales de manera visible en búsqueda." },
        { q: "¿Gestionan reseñas de salud?", a: "Proporcionamos estrategia de reseñas y guía de respuesta. No publicamos reseñas falsas." },
        { q: "¿Garantizan aumentos de pacientes?", a: "No. Nos enfocamos en visibilidad duradera, autoridad y demanda calificada que podemos influir y medir — no garantías de pacientes." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO Salud.",
        description:
          "Ve exactamente dónde está tu visibilidad de servicios, local y de confianza — y obtén un plan de 90 días para capturar demanda de salud de forma segura.",
        auditLabel: "Tu auditoría de salud incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (condiciones, servicios, local)",
          "Brecha competitiva",
          "Brecha de autoridad de contenido y confianza",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["legal-immigration-seo", "franchise-local-seo", "education-seo"],
    },

    "legal-immigration-seo": {
      slug: "legal-immigration-seo",
      icon: "legal",
      name: "SEO Legal e Inmigración",
      eyebrow: "Legal e Inmigración",
      h1: "SEO Legal e Inmigración para demanda de alta confianza, visibilidad de área de servicio y conversión de admisión.",
      metaTitle: "Servicios SEO Legal e Inmigración para Confianza y Admisión",
      metaDescription:
        "SEO legal e inmigración para demanda consultiva de alta confianza, páginas de área de servicio, preguntas de cola larga, autoridad local y conversión de admisión. Sin garantías legales.",
      heroDescription:
        "Las decisiones legales y de inmigración son de altos riesgos y orientadas a la confianza. Taskcover construye visibilidad de área de servicio, contenido orientado a confianza y señales de autoridad para demanda consultiva — sin garantías legales.",
      marketContext:
        "Los clientes buscan tipos de casos, jurisdicciones y servicios legales locales con alta sensibilidad de confianza. La demanda es consultiva, orientada a la reputación y a menudo urgente — haciendo las señales de confianza y la visibilidad local críticas.",
      buyerSearchBehavior:
        "La demanda legal se centra en consultas de tipos de casos, búsquedas específicas de jurisdicción, preguntas de cola larga (« cómo solicitar... ») e intención de servicios locales. Cada tipo necesita señales de confianza y profundidad de contenido diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los clientes legal e inmigración",
        description:
          "El recorrido legal va de investigación de preguntas a consulta — cada etapa recompensa la confianza y la autoridad local.",
        steps: [
          { stage: "Investigación", label: "Preguntas de tipos de casos y procesos", description: "Los clientes investigan tipos de casos y procesos — el contenido de P&R de cola larga gana." },
          { stage: "Evaluación", label: "Comparación de firmas y servicios", description: "Los clientes comparan firmas y servicios — las páginas de servicios estructuradas ganan." },
          { stage: "Local", label: "Búsquedas de jurisdicción y cerca de mí", description: "Los clientes buscan servicios locales y específicos de jurisdicción — las páginas locales ganan." },
          { stage: "Validación", label: "Verificaciones de reseñas y credenciales", description: "Los clientes validan con reseñas, credenciales y reputación." },
          { stage: "Admisión", label: "Consulta y contacto", description: "Los clientes avanzan hacia la consulta — rutas de admisión claras y confianza ganan." },
        ],
      },
      painPoints: {
        title: "Dónde las firmas legal e inmigración pierden demanda de búsqueda.",
        description:
          "El SEO legal falla cuando la confianza es débil o la visibilidad local falta. Estos son los puntos de fricción que cuestan consultas y autoridad.",
        items: [
          { label: "Comportamiento de decisión de alta confianza", detail: "Las decisiones legales son de altos riesgos — señales de confianza y credenciales débiles cuestan consultas en el momento de evaluación.", severity: "high" },
          { label: "Brechas de visibilidad de área de servicio", detail: "Los clientes buscan por jurisdicción y ubicación — páginas de área de servicio finas y ficha de Google débil cuestan demanda local.", severity: "high" },
          { label: "Brechas de preguntas de cola larga", detail: "Los clientes hacen preguntas detalladas de procesos — la mayoría de las firmas carecen del contenido de P&R que captura esta demanda.", severity: "medium" },
          { label: "Duplicación de páginas locales", detail: "Las páginas de ubicación son finas o duplicadas — fallando en capturar intención específica de jurisdicción.", severity: "medium" },
          { label: "Déficits de autoridad y credenciales", detail: "Las credenciales del colegio de abogados, resultados de casos y experiencia son escasos — erosionando la confianza en el momento de consulta.", severity: "high" },
          { label: "Fricción de conversión de admisión", detail: "Las rutas de consulta y contacto son poco claras — fugando demanda calificada en el paso final.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las firmas legal e inmigración pueden ganar.",
        items: [
          "Poseer autoridad de tipos de casos y procesos con contenido de P&R experto",
          "Ganar demanda local con páginas de área de servicio, ficha de Google y contenido de jurisdicción",
          "Construir confianza con credenciales, experiencia y señales de reputación",
          "Capturar intención de preguntas de cola larga con contenido de FAQ estructurado",
          "Fortalecer conversión de admisión de búsqueda a consulta",
          "Obtener autoría mediante RP digitales con publicaciones legales y de inmigración",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO legal orientado a confianza.",
        description:
          "Conectamos lo técnico, el contenido, la autoridad, lo local y la conversión en un sistema diseñado para demanda legal de alta confianza.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura para catálogos de servicios y ubicaciones." },
          { label: "Contenido orientado a confianza", description: "Contenido de tipos de casos, procesos y FAQ que demuestra experiencia genuina." },
          { label: "Visibilidad de área de servicio", description: "Páginas de ubicación, ficha de Google y contenido de jurisdicción para demanda local y regional." },
          { label: "Autoridad y credenciales", description: "RP digitales y visibilidad de credenciales que construyen confianza en el momento de consulta." },
          { label: "Conversión de admisión", description: "Rutas claras de consulta y contacto de búsqueda a admisión." },
          { label: "Señales de reputación", description: "Estrategia y gestión de reseñas que validan la fiabilidad de la firma." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ppc-management"],
      fitSummary: {
        title: "Cómo se integran lo jurídico y la inmigración en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Demanda consultiva de alta confianza" },
          { label: "Tipo de demanda de búsqueda", value: "Tipo de caso, jurisdicción, preguntas larga cola, local" },
          { label: "Requisito de confianza", value: "Credenciales, reputación, reseñas" },
          { label: "Trayectoria de crecimiento", value: "Autoridad de zona de servicio → conversión de admisión" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["technical-seo"] },
          { label: "Demanda", slugs: ["local-seo", "ppc-management"] },
          { label: "Autoridad", slugs: ["content-marketing", "digital-pr-link-building"] },
          { label: "Escala", slugs: [] },
        ],
      },
      contentStrategy: {
        title: "Contenido que construye confianza legal.",
        description:
          "El contenido legal debe responder a preguntas detalladas con experiencia genuina. Construimos clústeres de tipos de casos y procesos que las señales de confianza validan.",
        pillars: [
          "Páginas de tipos de casos y áreas de práctica con datos estructurados",
          "Contenido de P&R de procesos y guías para demanda de preguntas de cola larga",
          "Páginas de ubicación y jurisdicción para visibilidad de área de servicio",
          "Contenido de credenciales, experiencia y autoridad que valida confianza",
          "Contenido del recorrido del cliente de investigación a consulta",
        ],
      },
      authorityStrategy: {
        title: "Autoridad mediante credenciales y cobertura.",
        description:
          "La autoridad legal viene de credenciales, experiencia y cobertura en publicaciones confiables — no de esquemas de enlaces.",
        tactics: [
          "RP digitales con publicaciones legales y de inmigración",
          "Comentarios de expertos sobre tendencias legales y de inmigración",
          "Visibilidad de credenciales y experiencia que demuestra autoridad",
          "Contenido legal citable que las superficies IA referencian",
        ],
      },
      trustSignals:
        "Credenciales del colegio de abogados, experiencia, reputación, reseñas y datos estructurados que validan decisiones legales y de inmigración en búsqueda y superficies IA.",
      outcomes: [
        { label: "Cobertura de búsqueda más clara", description: "Intención de tipos de casos, procesos y local capturada en todo el recorrido." },
        { label: "Señales de confianza más fuertes", description: "Credenciales, experiencia y reputación que validan decisiones." },
        { label: "Mejor visibilidad local", description: "Páginas de área de servicio, ficha de Google y contenido de jurisdicción para demanda regional." },
        { label: "Mejor demanda calificada", description: "El contenido alcanza a los clientes en las etapas de investigación, evaluación y admisión." },
        { label: "Mejor conversión de admisión", description: "Rutas claras de búsqueda a consulta y contacto." },
      ],
      faqs: [
        { q: "¿Hacen garantías legales?", a: "No. Evitamos garantías legales y promesas de resultados. El contenido se enfoca en demostrar experiencia y capturar demanda calificada." },
        { q: "¿Pueden ayudar con SEO de área de servicio?", a: "Sí. Las páginas de ubicación, ficha de Google, contenido de jurisdicción y estrategia de área de servicio son fundamentales para la captura de demanda legal y de inmigración." },
        { q: "¿Gestionan SEO específico de inmigración?", a: "Sí. La demanda de inmigración tiene patrones distintos de confianza, jurisdicción y preguntas de cola larga a los que adaptamos contenido y arquitectura." },
        { q: "¿Cómo abordan el comportamiento de alta confianza?", a: "Construimos contenido orientado a confianza, visibilidad de credenciales y señales de autoridad que validan decisiones en el momento de consulta." },
        { q: "¿Garantizan aumentos de consultas?", a: "No. Nos enfocamos en visibilidad duradera, autoridad y demanda calificada que podemos influir y medir — no garantías de consultas." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO Legal e Inmigración.",
        description:
          "Ve exactamente dónde está tu visibilidad de tipos de casos, local y de confianza — y obtén un plan de 90 días para capturar demanda consultiva.",
        auditLabel: "Tu auditoría legal incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (tipos de casos, procesos, local)",
          "Brecha competitiva",
          "Brecha de autoridad de contenido y confianza",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["healthcare-seo", "franchise-local-seo", "saas-seo"],
    },

    "saas-seo": {
      slug: "saas-seo",
      icon: "saas",
      name: "SEO SaaS y Tecnología",
      eyebrow: "SaaS y Tecnología",
      h1: "SEO SaaS para autoridad de categoría, intención de comparación y contenido product-led.",
      metaTitle: "Servicios SEO SaaS y Tecnología para Categorías y Comparación",
      metaDescription:
        "SEO SaaS para páginas de categorías, intención de comparación, contenido product-led, documentación técnica, SERPs competidoras, búsqueda IA y contenido de conversión.",
      heroDescription:
        "Las categorías SaaS están saturadas y orientadas a la comparación. Taskcover construye autoridad de categoría, contenido de comparación y páginas product-led que capturan compradores investigando alternativas e integraciones.",
      marketContext:
        "Los compradores SaaS investigan categorías, comparan alternativas, evalúan integraciones y buscan prueba de producto antes de convertir. Las SERPs son competitivas, orientadas a la comparación y cada vez más respondidas por superficies IA.",
      buyerSearchBehavior:
        "La demanda SaaS se centra en consultas de categorías (« mejor software CRM »), intención de comparación (« Herramienta A vs Herramienta B »), búsquedas de alternativas (« alternativas Herramienta A ») y preguntas de integración. Cada tipo necesita contenido y señales de autoridad diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los compradores SaaS",
        description:
          "El recorrido SaaS va de investigación de categorías a comparación y luego a prueba — cada etapa recompensa una profundidad de contenido diferente.",
        steps: [
          { stage: "Descubrimiento", label: "Investigación de categorías y soluciones", description: "Los compradores exploran categorías y tipos de soluciones — el contenido de categorías y guías de compra gana." },
          { stage: "Comparación", label: "Comparación de herramientas y alternativas", description: "Los compradores comparan herramientas y alternativas — el contenido de comparación y « vs » gana." },
          { stage: "Integración", label: "Verificaciones de integración y compatibilidad", description: "Los compradores verifican integraciones y compatibilidad — el contenido técnico y de integración gana." },
          { stage: "Validación", label: "Verificaciones de prueba y reseñas", description: "Los compradores validan con reseñas, pruebas de casos y comentarios de expertos." },
          { stage: "Prueba", label: "Conversión de registro y prueba", description: "Los compradores avanzan hacia la prueba — el contenido product-led y de conversión gana." },
        ],
      },
      painPoints: {
        title: "Dónde las marcas SaaS pierden demanda de búsqueda.",
        description:
          "El SEO SaaS falla cuando el contenido de categoría y comparación es fino o ausente. Estos son los puntos de fricción que cuestan pruebas y autoridad.",
        items: [
          { label: "Competencia de categoría", detail: "Las SERPs de categorías SaaS están saturadas — páginas de categorías finas pierden visibilidad frente a competidores y sitios de listas.", severity: "high" },
          { label: "Brechas de intención de comparación", detail: "Los compradores comparan herramientas — la mayoría de los sitios SaaS carecen del contenido « vs » y alternativa que captura esta demanda.", severity: "high" },
          { label: "Déficits de contenido product-led", detail: "El contenido es marketing inflado, no product-led — fallando en alcanzar compradores que evalúan características y casos de uso.", severity: "medium" },
          { label: "Brechas de documentación técnica", detail: "Los docs y el contenido de integración están pobremente optimizados — perdiendo visibilidad en consultas de desarrolladores e integración.", severity: "medium" },
          { label: "Dominio de SERPs competidoras", detail: "Los competidores y sitios de reseñas agregadores poseen las consultas de comparación y alternativas.", severity: "high" },
          { label: "Ausencia de respuestas IA", detail: "Las superficies IA recomiendan cada vez más herramientas — las marcas sin contenido estructurado y citable pierden cuota.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las marcas SaaS pueden ganar.",
        items: [
          "Poseer autoridad de categoría con contenido de categoría profundo y experto",
          "Capturar intención de comparación y alternativa con contenido « vs » honesto",
          "Ganar consultas de desarrolladores e integración con documentación optimizada",
          "Construir contenido product-led que alcance compradores evaluando características",
          "Obtener citas en respuestas IA con contenido de producto y comparación estructurado",
          "Fortalecer rutas de conversión de prueba de búsqueda a registro",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO SaaS orientado a categoría.",
        description:
          "Conectamos lo técnico, el contenido, la autoridad, la búsqueda IA y la conversión en un sistema diseñado para la competencia de categorías SaaS.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura para catálogos de productos, docs y contenido." },
          { label: "Autoridad de contenido de categoría", description: "Clústeres de categorías, guías de compra y casos de uso dirigidos por expertos que construyen autoridad." },
          { label: "Contenido de comparación", description: "Contenido honesto « vs », alternativa y comparación que captura intención de evaluación." },
          { label: "Contenido product-led", description: "Contenido de características, casos de uso e integración que alcanza compradores evaluando productos." },
          { label: "Preparación de búsqueda IA", description: "Contenido de producto y comparación estructurado para superficies de respuestas IA." },
          { label: "Rutas de conversión", description: "Enlazado interno y CRO que dirigen la intención de evaluación hacia prueba y registro." },
        ],
      },
      recommendedServices: ["seo-agency", "technical-seo", "content-marketing", "ai-search-optimization", "ppc-management", "seo-mentor-service"],
      fitSummary: {
        title: "Cómo se integra el SaaS en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Autoridad de categoría y captura de evaluación" },
          { label: "Tipo de demanda de búsqueda", value: "Categoría, comparación, integración, alternativas" },
          { label: "Requisito de confianza", value: "Prueba de producto, reseñas de expertos, integraciones" },
          { label: "Trayectoria de crecimiento", value: "Contenido de evaluación → conversión de prueba" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["seo-agency", "technical-seo"] },
          { label: "Demanda", slugs: ["ppc-management"] },
          { label: "Autoridad", slugs: ["content-marketing"] },
          { label: "Escala", slugs: ["ai-search-optimization", "seo-mentor-service"] },
        ],
      },
      contentStrategy: {
        title: "Contenido que gana categorías SaaS.",
        description:
          "El contenido SaaS debe servir la intención de categoría, comparación y evaluación con profundidad de producto genuina. Construimos clústeres que capturan compradores durante todo el recorrido de evaluación.",
        pillars: [
          "Contenido de categorías y guías de compra que posee la intención amplia de descubrimiento",
          "Contenido de comparación y alternativa que captura consultas de evaluación",
          "Contenido product-led de características y casos de uso para demanda específica de características",
          "Documentación técnica optimizada para consultas de desarrolladores e integración",
          "Contenido de prueba y reseñas que valida la decisión de prueba",
        ],
      },
      authorityStrategy: {
        title: "Autoridad mediante prueba de producto y cobertura.",
        description:
          "La autoridad SaaS viene de prueba de producto, reseñas de expertos y cobertura en publicaciones confiables — no de esquemas de enlaces.",
        tactics: [
          "RP digitales con publicaciones tecnológicas y SaaS",
          "Comentarios de expertos sobre tendencias SaaS y tecnológicas",
          "Visibilidad de prueba de producto e integraciones que demuestra autoridad",
          "Contenido de producto citable que las superficies IA referencian",
        ],
      },
      trustSignals:
        "Prueba de producto, integraciones, reseñas de expertos y cobertura en publicaciones confiables que validan decisiones SaaS en búsqueda y superficies IA.",
      outcomes: [
        { label: "Cobertura de búsqueda más clara", description: "Intención de categorías, comparación e integración capturada." },
        { label: "Autoridad de categoría más fuerte", description: "Contenido experto que posee consultas de categorías y evaluación." },
        { label: "Mejor demanda calificada", description: "El contenido alcanza a los compradores en las etapas de descubrimiento, comparación y prueba." },
        { label: "Mejor preparación de búsqueda IA", description: "Contenido de producto estructurado para superficies de respuestas IA." },
        { label: "Mejor conversión de prueba", description: "Rutas claras de búsqueda a registro y prueba." },
      ],
      faqs: [
        { q: "¿Pueden ayudar con contenido de comparación y alternativa?", a: "Sí. El contenido honesto « vs » y alternativa es fundamental para el SEO SaaS — lo construimos para capturar la intención de evaluación sin engañar a los compradores." },
        { q: "¿Optimizan la documentación técnica?", a: "Sí. Optimizamos docs y contenido de integración para consultas de desarrolladores e integración — un segmento importante de demanda SaaS." },
        { q: "¿Cómo gestionan la competencia de categoría?", a: "Construimos contenido de categoría profundo y experto y señales de autoridad que compiten con sitios de listas y competidores en calidad." },
        { q: "¿Abordan la búsqueda IA para SaaS?", a: "Sí. Las superficies IA recomiendan cada vez más herramientas — estructuramos el contenido de producto y comparación para que sea citable." },
        { q: "¿Garantizan aumentos de pruebas?", a: "No. Nos enfocamos en visibilidad duradera, autoridad y demanda calificada que podemos influir y medir — no garantías de pruebas." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO SaaS.",
        description:
          "Ve exactamente dónde está tu visibilidad de categorías, comparación y producto — y obtén un plan de 90 días para ganar demanda SaaS.",
        auditLabel: "Tu auditoría SaaS incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (categorías, comparación, integración)",
          "Brecha competitiva",
          "Brecha de autoridad de contenido",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["travel-seo", "ecommerce-seo", "education-seo"],
    },

    "ecommerce-seo": {
      slug: "ecommerce-seo",
      icon: "ecommerce",
      name: "SEO E-commerce",
      eyebrow: "E-commerce",
      h1: "SEO E-commerce para arquitectura de categorías, páginas de productos y demanda de intención de compra.",
      metaTitle: "Servicios SEO E-commerce para Categorías, Productos e Ingresos",
      metaDescription:
        "SEO E-commerce para arquitectura de categorías, páginas de productos, navegación facetada, contenido de intención de compra, enlaces internos y demanda de búsqueda de merchandising.",
      heroDescription:
        "El SEO e-commerce se juzga por ingresos, no por tráfico. Taskcover construye arquitectura de categorías, sistemas de páginas de productos y contenido de intención de compra que captura y convierte demanda transaccional.",
      marketContext:
        "Los compradores e-commerce buscan categorías, comparan productos, leen reseñas y esperan datos de productos estructurados. Las SERPs son competitivas, la navegación facetada crea desafíos de indexación, y los marketplaces capturan demanda significativa.",
      buyerSearchBehavior:
        "La demanda e-commerce se centra en consultas de categorías, búsquedas específicas de productos, intención de comparación y consultas transaccionales (« comprar »). Cada tipo necesita arquitectura, contenido y datos estructurados diferentes.",
      searchWorkflow: {
        title: "Cómo buscan los compradores e-commerce",
        description:
          "El recorrido e-commerce va de navegación de categorías a comparación de productos y luego a compra — cada etapa recompensa la arquitectura y el contenido.",
        steps: [
          { stage: "Navegación", label: "Descubrimiento de categorías y productos", description: "Los compradores navegan categorías y productos — las páginas de categorías bien estructuradas ganan." },
          { stage: "Comparación", label: "Comparación de productos y características", description: "Los compradores comparan productos y características — las páginas de productos estructuradas ganan." },
          { stage: "Validación", label: "Verificaciones de reseñas y calificaciones", description: "Los compradores validan con reseñas y calificaciones antes de comprar." },
          { stage: "Transacción", label: "Búsquedas de intención de compra", description: "Los compradores buscan con intención transaccional — el contenido y páginas de intención de compra ganan." },
          { stage: "Descubrimiento+", label: "Investigación de guías y hubs", description: "Los compradores investigan vía guías y hubs — el contenido que apoya el descubrimiento gana." },
        ],
      },
      painPoints: {
        title: "Dónde las tiendas e-commerce pierden demanda de búsqueda.",
        description:
          "El SEO e-commerce falla cuando la arquitectura y los datos de productos son débiles. Estos son los puntos de fricción que cuestan ingresos.",
        items: [
          { label: "Brechas de arquitectura de categorías", detail: "Las categorías no están mapeadas a la intención de compra — las plantillas genéricas nunca convierten.", severity: "high" },
          { label: "Páginas de productos finas", detail: "Las páginas de productos son finas o duplicadas entre variantes — perdiendo visibilidad y confianza.", severity: "high" },
          { label: "Riesgo de navegación facetada", detail: "La navegación facetada crea inflación de indexación y diluye la autoridad a través de miles de URLs de bajo valor.", severity: "high" },
          { label: "Debilidad de enlazado interno", detail: "Mal enlazado entre categorías, productos y hubs — la demanda no fluye hacia la conversión.", severity: "medium" },
          { label: "Ausencia de contenido de intención de compra", detail: "Faltan guías y hubs que capturan demanda de descubrimiento.", severity: "medium" },
          { label: "Pérdida de demanda a marketplaces", detail: "La demanda de intención de compra se fuga a marketplaces — los datos estructurados y la arquitectura deben competir.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las tiendas e-commerce pueden ganar.",
        items: [
          "Mapear la arquitectura de categorías a cómo los compradores buscan y compran",
          "Construir páginas de productos únicas y estructuradas que convierten",
          "Controlar la navegación facetada para consolidar autoridad",
          "Crear hubs de contenido de intención de compra que capturan descubrimiento",
          "Fortalecer el enlazado interno del contenido a los productos",
          "Competir con marketplaces en datos estructurados y profundidad de producto",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO e-commerce orientado a ingresos.",
        description:
          "Conectamos lo técnico, el contenido, la arquitectura y la conversión en un sistema diseñado para ingresos e-commerce.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y rendimiento para grandes catálogos de productos." },
          { label: "Arquitectura de categorías", description: "Estructura que mapea categorías a cómo las personas buscan y compran." },
          { label: "Sistema de páginas de productos", description: "Plantillas para páginas de productos únicas, indexables y listas para convertir." },
          { label: "Control de navegación facetada", description: "Reglas de indexación que consolidan autoridad a través de facetas." },
          { label: "Contenido de intención de compra", description: "Guías y hubs que capturan y canalizan la demanda de descubrimiento." },
          { label: "Rutas de conversión", description: "Enlazado interno y CRO de la demanda de búsqueda a la venta." },
        ],
      },
      recommendedServices: ["ecommerce-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      fitSummary: {
        title: "Cómo se integra el e-commerce en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Demanda de intención de compra y conversión" },
          { label: "Tipo de demanda de búsqueda", value: "Categoría, producto, comparación, transaccional" },
          { label: "Requisito de confianza", value: "Reseñas, datos estructurados, confianza de fulfillment" },
          { label: "Trayectoria de crecimiento", value: "Limpieza de arquitectura → captura de ingresos" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["ecommerce-seo", "technical-seo", "seo-audit"] },
          { label: "Demanda", slugs: ["ppc-management"] },
          { label: "Autoridad", slugs: ["content-marketing"] },
          { label: "Escala", slugs: [] },
        ],
      },
      contentStrategy: {
        title: "Contenido que genera ingresos e-commerce.",
        description:
          "El contenido e-commerce debe apoyar el descubrimiento y la conversión de productos. Construimos guías de compra y hubs que canalizan la demanda hacia los productos.",
        pillars: [
          "Contenido de categorías que captura la intención de navegación y descubrimiento",
          "Guías de compra y hubs que apoyan decisiones de productos",
          "Contenido de páginas de productos único, estructurado y listo para convertir",
          "Contenido de comparación que captura consultas de evaluación",
          "Enlazado interno que canaliza la demanda de contenido hacia los productos",
        ],
      },
      authorityStrategy: {
        title: "Autoridad mediante profundidad de producto y estructura.",
        description:
          "La autoridad e-commerce viene de datos de productos estructurados, reseñas y profundidad de contenido — no de esquemas de enlaces.",
        tactics: [
          "Datos de productos estructurados que ayudan a Google e IA a mostrar productos",
          "Estrategia de reseñas que construye confianza de producto",
          "Profundidad de contenido que señala autoridad de categoría",
          "Contenido de producto y guía citable para superficies IA",
        ],
      },
      trustSignals:
        "Reseñas, datos estructurados, confianza de cumplimiento y profundidad de producto que validan decisiones de compra en búsqueda y superficies IA.",
      outcomes: [
        { label: "Más demanda de intención de compra", description: "Visibilidad en los términos de categorías y productos que generan ingresos." },
        { label: "Indexación más limpia", description: "Las páginas correctas indexadas; facetas controladas y autoridad consolidada." },
        { label: "Páginas de productos más fuertes", description: "Contenido de producto único, estructurado y listo para convertir." },
        { label: "Mejores rutas de conversión", description: "Demanda canalizada del contenido hacia la compra." },
        { label: "Mejor cobertura de superficies IA", description: "Los datos de productos estructurados ayudan a las superficies IA a citar y mostrar productos." },
      ],
      faqs: [
        { q: "¿Pueden manejar grandes catálogos de productos?", a: "Sí. Diseñamos reglas de navegación facetada y plantillas escalables que mantienen los grandes catálogos indexables y de alta calidad." },
        { q: "¿Optimizan plantillas de páginas de productos?", a: "Sí. Definimos plantillas para páginas de productos únicas, indexables y orientadas a la conversión." },
        { q: "¿Cómo abordan la navegación facetada?", a: "Diseñamos reglas de indexación que controlan las facetas y consolidan la autoridad — previniendo la inflación de indexación." },
        { q: "¿Pueden competir con marketplaces?", a: "Nuestro enfoque es tu propia tienda. Construimos datos estructurados y profundidad de producto que te ayuda a competir por demanda de intención de compra." },
        { q: "¿El SEO e-commerce se mide por ingresos?", a: "Sí. Vinculamos el trabajo a demanda calificada e ingresos, no solo a tráfico." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO E-commerce.",
        description:
          "Ve exactamente dónde está tu visibilidad de categorías, productos e ingresos — y obtén un plan de 90 días para capturar demanda de intención de compra.",
        auditLabel: "Tu auditoría e-commerce incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (categorías, productos, transaccional)",
          "Brecha competitiva",
          "Brecha de contenido y arquitectura",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["saas-seo", "travel-seo", "franchise-local-seo"],
    },

    "franchise-local-seo": {
      slug: "franchise-local-seo",
      icon: "franchise",
      name: "SEO Franquicia y Multi-ubicación",
      eyebrow: "Franquicia y Multi-ubicación",
      h1: "SEO Franquicia para consistencia de ubicaciones, autoridad local y visibilidad multi-mercado.",
      metaTitle: "Servicios SEO Franquicia y Multi-ubicación para Consistencia Local",
      metaDescription:
        "SEO franquicia y multi-ubicación para consistencia de ubicaciones, páginas locales, ficha de Google, reseñas, citas NAP, riesgo de duplicación y reporting multi-mercado.",
      heroDescription:
        "Las marcas multi-ubicación y franquicia necesitan visibilidad local consistente a escala. Taskcover construye arquitectura de ubicación, estrategia de ficha de Google y sistemas de reseñas que ganan el paquete local y los mapas de cada ubicación.",
      marketContext:
        "La demanda de franquicia y multi-ubicación se decide en paquetes locales, en mapas y a través de reseñas específicas de cada ubicación. La consistencia entre ubicaciones — mientras se permanece específico — es el desafío central.",
      buyerSearchBehavior:
        "La demanda de franquicia se centra en consultas cerca de mí, búsquedas de servicios específicas de ubicación y descubrimiento basado en mapas. Cada ubicación necesita su propia autoridad y presencia locales.",
      searchWorkflow: {
        title: "Cómo buscan los compradores de franquicia y multi-ubicación",
        description:
          "El recorrido de franquicia es intrínsecamente local — cada ubicación debe ganar su propio paquete, mapas y reseñas.",
        steps: [
          { stage: "Local", label: "Búsquedas cerca de mí y por ubicación", description: "Los compradores buscan términos cerca de mí y específicos de ubicación — la ficha de Google y las páginas locales ganan." },
          { stage: "Mapa", label: "Descubrimiento basado en mapas", description: "Los compradores descubren ubicaciones vía mapas — la presencia y precisión en mapas ganan." },
          { stage: "Comparación", label: "Comparación de ubicaciones y servicios", description: "Los compradores comparan ubicaciones y servicios — las páginas de ubicación estructuradas ganan." },
          { stage: "Validación", label: "Verificaciones de reseñas y calificaciones", description: "Los compradores validan con reseñas específicas de cada ubicación antes de visitar." },
          { stage: "Visita", label: "Intención de dirección y contacto", description: "Los compradores buscan direcciones y contacto — datos NAP y de ubicación precisos ganan." },
        ],
      },
      painPoints: {
        title: "Dónde las marcas de franquicia y multi-ubicación pierden demanda de búsqueda.",
        description:
          "El SEO de franquicia falla cuando las ubicaciones son inconsistentes o duplicadas. Estos son los puntos de fricción que cuestan demanda local.",
        items: [
          { label: "Brechas de consistencia de ubicaciones", detail: "La ficha de Google, las páginas y las citas son inconsistentes entre ubicaciones — erosionando la confianza y visibilidad locales.", severity: "high" },
          { label: "Duplicación de páginas locales", detail: "Las páginas de ubicación están duplicadas o son finas — fallando en capturar intención específica de ubicación y arriesgando problemas de páginas de entrada.", severity: "high" },
          { label: "Inconsistencia de señales de reseñas", detail: "Las reseñas se ganan lentamente y se gestionan raramente entre ubicaciones — debilitando la confianza local.", severity: "medium" },
          { label: "Errores NAP y de citas", detail: "Las inconsistencias de nombre, dirección y teléfono entre directorios confunden las señales locales.", severity: "medium" },
          { label: "Brechas de reporting multi-mercado", detail: "Falta visibilidad de rendimiento por ubicación — haciendo la priorización imposible.", severity: "medium" },
          { label: "Déficits de autoridad local", detail: "Las ubicaciones individuales carecen de la autoridad local necesaria para ganar sus propios paquetes.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Dónde las marcas de franquicia y multi-ubicación pueden ganar.",
        items: [
          "Construir páginas de ubicación consistentes y únicas a escala",
          "Ganar el paquete local de cada ubicación con optimización de ficha de Google",
          "Fortalecer la estrategia de reseñas en todas las ubicaciones",
          "Corregir la consistencia NAP y de citas entre directorios",
          "Construir autoridad local de cada ubicación",
          "Obtener visibilidad de rendimiento multi-mercado por ubicación",
        ],
      },
      taskcoverSolution: {
        title: "Un modelo operativo SEO local escalable.",
        description:
          "Conectamos la arquitectura de ubicación, la ficha de Google, las reseñas, las citas y el reporting en un sistema que escala entre ubicaciones mientras permanece específico.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y arquitectura para catálogos de ubicaciones y servicios." },
          { label: "Arquitectura de ubicación", description: "Páginas de ubicación y área de servicio escalables y únicas con schema." },
          { label: "Optimización de ficha de Google", description: "Categorías, servicios, publicaciones y gestión consistente entre ubicaciones." },
          { label: "Estrategia de reseñas", description: "Ganar reseñas éticamente y responder a escala entre ubicaciones." },
          { label: "Consistencia de citas", description: "Limpieza NAP y gestión de citas entre directorios." },
          { label: "Reporting multi-ubicación", description: "Visibilidad de rendimiento por ubicación y mercado." },
        ],
      },
      recommendedServices: ["local-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      fitSummary: {
        title: "Cómo se integran la franquicia y multi-localización en el sistema Taskcover",
        rows: [
          { label: "Necesidad principal de crecimiento", value: "Autoridad local consistente a escala" },
          { label: "Tipo de demanda de búsqueda", value: "Cerca de mí, ubicación, zona de servicio, mapa" },
          { label: "Requisito de confianza", value: "Reseñas, consistencia NAP, precisión GBP" },
          { label: "Trayectoria de crecimiento", value: "Consistencia de ubicaciones → victorias por local" },
        ],
      },
      bundleMap: {
        title: "Paquete recomendado por rol",
        groups: [
          { label: "Cimiento", slugs: ["local-seo", "technical-seo", "seo-audit"] },
          { label: "Demanda", slugs: ["ppc-management"] },
          { label: "Autoridad", slugs: ["content-marketing"] },
          { label: "Escala", slugs: [] },
        ],
      },
      contentStrategy: {
        title: "Contenido que escala entre ubicaciones.",
        description:
          "El contenido de franquicia debe ser escalable pero específico. Construimos contenido de ubicación y área de servicio que evita la duplicación mientras captura la intención local.",
        pillars: [
          "Páginas de ubicación únicas que capturan intención específica de ubicación",
          "Contenido de área de servicio para demanda cerca de mí y regional",
          "Contenido de confianza y comunidad local que construye autoridad de ubicación",
          "Contenido de reseñas y reputación que valida decisiones de ubicación",
          "Enlazado interno multi-ubicación que fortalece las páginas locales",
        ],
      },
      authorityStrategy: {
        title: "Autoridad local a escala.",
        description:
          "La autoridad de franquicia viene de relevancia local, reseñas y citas — no de esquemas de enlaces genéricos.",
        tactics: [
          "Consistencia de citas locales y NAP entre directorios",
          "Estrategia de reseñas que construye confianza local en cada ubicación",
          "RP digitales locales y presencia comunitaria",
          "Autoridad específica de cada ubicación que gana paquetes locales individuales",
        ],
      },
      trustSignals:
        "Reseñas de ubicación, NAP consistente, precisión de ficha de Google y autoridad local que validan decisiones de franquicia en búsqueda y mapas.",
      outcomes: [
        { label: "Presencia de paquete local más fuerte", description: "Más visibilidad en mapas y resultados locales por ubicación." },
        { label: "Páginas de ubicación escalables", description: "Páginas únicas y útiles sin riesgo de páginas de entrada." },
        { label: "Mejores señales de reputación", description: "Más reseñas y mejor gestionadas entre ubicaciones." },
        { label: "Reporting local claro", description: "Visibilidad de rendimiento por ubicación y mercado." },
        { label: "Conversión local más fuerte", description: "El tráfico de mapas y paquete llega a llamadas, formularios y visitas." },
      ],
      faqs: [
        { q: "¿Pueden manejar SEO de franquicia y multi-ubicación a escala?", a: "Sí. Construimos arquitecturas escalables con páginas de ubicación únicas y útiles que evitan problemas de páginas de entrada." },
        { q: "¿Gestionan la ficha de Google entre ubicaciones?", a: "Sí. Proporcionamos guía de optimización y gestión de la ficha de Google entre todas las ubicaciones para consistencia." },
        { q: "¿Cómo evitan la duplicación de páginas locales?", a: "Diseñamos páginas de plantilla pero únicas con contenido local genuino — evitando la duplicación fina que crea riesgo de páginas de entrada." },
        { q: "¿Gestionan la limpieza NAP y de citas?", a: "Sí. La consistencia de citas y la limpieza NAP son fundamentales para el SEO local multi-ubicación." },
        { q: "¿Cómo reportan entre ubicaciones?", a: "Proporcionamos reporting multi-ubicación que muestra paquete, mapas y rendimiento por ubicación y mercado." },
      ],
      finalCta: {
        title: "Obtén una Auditoría de Crecimiento SEO Franquicia y Multi-ubicación.",
        description:
          "Ve exactamente dónde está tu consistencia de ubicaciones, autoridad local y visibilidad multi-mercado — y obtén un plan de 90 días.",
        auditLabel: "Tu auditoría de franquicia incluye:",
        auditItems: [
          "Resumen técnico",
          "Mapa de demanda de búsqueda (local, área de servicio)",
          "Brecha de consistencia de ubicaciones",
          "Brecha de autoridad de contenido",
          "Verificación de preparación IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["healthcare-seo", "legal-immigration-seo", "ecommerce-seo"],
    },
  },

  ui: {
    breadcrumbHome: "Inicio",
    breadcrumbIndustries: "Sectores",
    heroCtaPrimary: "Auditoría SEO gratuita",
    heroCtaSecondary: "Reservar llamada",
    heroFigcaption: "Ilustrativo — los datos verificados de clientes solo se añaden con permiso.",
    searchBehaviorEyebrow: "Comportamiento de búsqueda",
    searchBehaviorIntentMap: "Mapa de intención",
    painPointsEyebrow: "Fricción del mercado",
    painPointsScanner: "Escáner de riesgo",
    painPointsRiskLevel: "Nivel de riesgo",
    solutionEyebrow: "La solución Taskcover",
    solutionModel: "Modelo operativo",
    servicesEyebrow: "Servicios recomendados",
    servicesTitle: "Los módulos que se ajustan a este sector.",
    servicesDesc: "Módulos de servicios conectados — no una lista genérica — adaptados a cómo este sector busca y convierte.",
    servicesModule: "Módulo",
    servicesFitSummary: "Resumen de ajuste sectorial",
    servicesBundleMap: "Mapa de paquete",
    servicesBundleFoundation: "Cimiento",
    servicesBundleDemand: "Demanda",
    servicesBundleAuthority: "Autoridad",
    servicesBundleScale: "Escala",
    contentAuthorityEyebrow: "Plan de contenido y autoridad",
    contentAuthorityGrowthSystem: "Sistema de crecimiento",
    outcomesEyebrow: "Resultados de negocio",
    outcomesDesc: "Categorías de resultados — sin métricas fabricadas. Los resultados verificados solo se añaden con datos atribuibles.",
    faqEyebrow: "FAQ",
    faqTitle: "Preguntas sobre {industry}, respondidas.",
    ctaEyebrow: "Inicia tu sistema de crecimiento sectorial",
    ctaAuditPreview: "Vista previa de auditoría",
    ctaIllustrative: "Ilustrativo — cada auditoría se adapta a tu mercado y objetivos.",
    selectorViewIndustry: "Ver",
    selectorPriority: "Sector prioritario",
    comparisonIndustry: "Sector",
    bundlesIncludes: "Incluye",
    relatedEyebrow: "Sectores relacionados",
    relatedTitle: "Explora sectores relacionados.",
    exploreIndustry: "Explorar sector",
    outcome: "Resultado",
  },
};