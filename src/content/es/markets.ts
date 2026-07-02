/**
 * Spanish markets content — hub + all 3 markets + UI strings.
 *
 * Traducción profesional, no literal. Los slugs permanecen en inglés.
 * Sin métricas, testimonios, premios u oficinas inventadas.
 */

import type { MarketsContent } from "@/content/markets.types";

export const markets: MarketsContent = {
  hub: {
    eyebrow: "Mercados",
    h1: "Sistemas de búsqueda regionales para EE. UU., Canadá y Australia.",
    positioning:
      "Un sistema de crecimiento de búsqueda conectado, ajustado a cómo cada mercado busca, confía y compra.",
    description:
      "Cada mercado tiene una competencia SERP, señales de confianza, demanda local, matices lingüísticos y comportamientos de búsqueda IA distintos. Taskcover adapta la estrategia, el contenido, lo técnico, la autoridad y el PPC al mercado en el que compites — sin duplicar un plan genérico en todas partes.",
    primaryCta: { label: "Auditoría SEO gratis", href: "/free-seo-audit" },
    secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
    heroFigcaption:
      "Comando del mercado de búsqueda global — demanda, confianza y madurez IA por región.",
    selectorSection: {
      eyebrow: "Mapa de inteligencia regional",
      title: "Elige el mercado en el que compites.",
      description:
        "Cada panel resume el comportamiento de búsqueda, la presión competitiva y los palancas donde Taskcover genera más valor.",
    },
    comparisonSection: {
      eyebrow: "Comparación de mercados",
      title: "Ningún mercado busca de la misma manera.",
      description:
        "La intensidad de competencia, la importancia del SEO local, la necesidad bilingüe y la oportunidad de búsqueda IA varían fuertemente entre EE. UU., Canadá y Australia. Esta matriz muestra dónde cada mercado recompensa un enfoque distinto.",
      dimensions: [
        { key: "competition", label: "Intensidad de competencia" },
        { key: "local", label: "Importancia del SEO local" },
        { key: "national", label: "Oportunidad de SEO nacional" },
        { key: "multilingual", label: "Necesidad bilingüe / multilingüe" },
        { key: "ppc", label: "Captura de demanda PPC" },
        { key: "trust", label: "Sensibilidad de confianza" },
        { key: "ai", label: "Oportunidad de búsqueda IA" },
      ],
    },
    growthSystemsSection: {
      eyebrow: "Sistemas de crecimiento por mercado",
      title: "Un sistema de crecimiento recomendado por mercado.",
      description:
        "Cada mercado conecta una mezcla distinta de servicios, industrias y prioridades en un solo sistema operativo — no la misma pila copiada y pegada en todas las regiones.",
      groups: [
        {
          slug: "usa-seo-agency",
          label: "Sistema de crecimiento EE. UU.",
          description:
            "Cobertura nacional + local + multi-ubicación, captura de demanda PPC, autoridad SaaS y eCommerce, y visibilidad de búsqueda IA.",
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
          label: "Sistema de crecimiento Canadá",
          description:
            "Búsqueda bilingüe inglés/francés, SEO internacional, autoridad de educación e inmigración, y claridad de entidad para IA.",
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
          label: "Sistema de crecimiento Australia",
          description:
            "Nichos de servicio de alto valor, competencia local + nacional, eCommerce y franquicia, y captura PPC para SERPs comerciales.",
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
      eyebrow: "Obtén una auditoría específica de tu mercado",
      title: "Mira cómo te posicionas en tu mercado.",
      description:
        "Obtén una auditoría de crecimiento SEO específica del mercado: panorama de búsqueda, instantánea técnica, brecha de visibilidad competitiva, oportunidad de contenido y autoridad, madurez de búsqueda IA y una hoja de ruta de 90 días.",
      auditItems: [
        "Revisión del panorama de búsqueda del mercado",
        "Instantánea técnica",
        "Brecha de visibilidad competitiva",
        "Oportunidad de contenido y autoridad",
        "Madurez de búsqueda IA",
        "Hoja de ruta de 90 días",
      ],
    },
  },

  markets: {
    "usa-seo-agency": {
      slug: "usa-seo-agency",
      icon: "usa",
      name: "EE. UU.",
      regionLabel: "América del Norte",
      eyebrow: "Agencia SEO EE. UU.",
      h1: "SEO para el mercado de búsqueda más competitivo del mundo.",
      metaTitle: "Agencia SEO EE. UU. para Google, búsqueda IA y crecimiento",
      metaDescription:
        "Servicios de agencia SEO EE. UU. para SERPs nacionales y locales muy competitivas. SEO técnico, autoridad de contenido, madurez de búsqueda IA, captura PPC y crecimiento multi-ubicación — sin falsas garantías de ranking.",
      heroDescription:
        "Estados Unidos es el mercado de búsqueda más grande y competitivo que Taskcover atiende. Las SERPs nacionales están saturadas, los packs locales deciden la demanda de alta intención y los AI Overviews están transformando cómo investigan los compradores. Construimos sistemas SEO estadounidenses que conectan autoridad nacional, precisión local y madurez IA en un solo motor de crecimiento.",
      marketContext:
        "La demanda de búsqueda estadounidense es amplia, rápida e intensamente competitiva. Los compradores esperan marcas en lo más alto de Google, presentes en respuestas IA y creíbles mediante validación de terceros confiable. Las marcas multi-ubicación y franquicia enfrentan la complejidad de escalar presencia local sin crear páginas de doorway.",
      searchLandscape: {
        title: "El panorama de búsqueda estadounidense premia la autoridad y la profundidad.",
        description:
          "Las SERPs nacionales están dominadas por editores establecidos, marketplaces y marcas con grandes presupuestos. Los packs locales deciden la demanda de alta intención. Los AI Overviews cada vez resumen más consultas comerciales e informativas — favoreciendo contenido estructurado y citable.",
        facets: [
          { label: "SERPs nacionales", detail: "Saturadas, orientadas a autoridad; términos de categoría y comparación muy disputados." },
          { label: "Packs locales", detail: "Deciden la demanda de alta intención en ciudades, áreas metropolitanas y de servicio." },
          { label: "AI Overviews", detail: "Resumen consultas comerciales y de investigación; premian contenido estructurado y claro." },
          { label: "PPC comercial", detail: "Subastas publicitarias competitivas; la captura de pago suele ser necesaria." },
        ],
      },
      buyerBehavior: {
        title: "Los compradores estadounidenses investigan mucho antes de convertir.",
        description:
          "Los compradores estadounidenses comparan opciones en Google, herramientas IA, reseñas y marketplaces. La confianza se construye mediante señales de autoridad, contenido experto y validación de terceros — no puntos de contacto únicos.",
        stages: [
          { stage: "Conciencia", label: "Búsqueda de categoría", description: "Los compradores buscan términos amplios de categoría y comparación en Google y herramientas IA." },
          { stage: "Consideración", label: "Comparación", description: "Las listas cortas se forman mediante reseñas, contenido experto y menciones de terceros." },
          { stage: "Validación", label: "Verificaciones de confianza", description: "Credenciales, evidencia y señales de autoridad validan la decisión." },
          { stage: "Conversión", label: "Decisión", description: "Consultas locales o comerciales de alta intención convierten vía páginas de destino y llamadas." },
        ],
      },
      localSeoAngle: {
        title: "El SEO local es donde suele ocurrir el ingreso estadounidense.",
        description:
          "La demanda de ciudad, área metropolitana y zona de servicio se decide en el pack local y en Google Business Profile. Las marcas multi-ubicación y franquicia necesitan arquitecturas de ubicación escalables y únicas — no páginas duplicadas delgadas.",
      },
      nationalSeoAngle: {
        title: "El SEO nacional es un concurso de autoridad.",
        description:
          "Las SERPs nacionales de categoría y comparación premian la autoridad temática, los datos estructurados y el contenido citable. Competir significa construir un sistema real de contenido y autoridad, no palabras clave aisladas.",
      },
      aiSearchOpportunity: {
        title: "La búsqueda IA avanza más rápido en EE. UU.",
        description:
          "Los AI Overviews y las respuestas LLM son ampliamente utilizados por compradores estadounidenses. El contenido estructurado, la claridad de entidad y la validación de terceros aumentan las probabilidades de ser citado — nadie puede garantizar citas específicas.",
      },
      multilingualAngle: {
        title: "Oportunidad del mercado hispano e idioma español.",
        description:
          "Taskcover admite contenido en español, lo que puede ayudar a servir audiencias hispanas estadounidenses. No sobreestimamos la experiencia del mercado hispano o la presencia local; construimos contenido y arquitectura listos para español con cuidado.",
      },
      marketChallenges: {
        title: "Dónde vive la fricción SEO estadounidense.",
        description:
          "Las partes más difíciles de la búsqueda estadounidense son la saturación, la velocidad de cambio y la brecha entre tráfico e ingresos. Estos son los puntos de fricción que escaneamos primero.",
        items: [
          { label: "Saturación de SERPs nacionales", detail: "Editores establecidos y marcas con grandes presupuestos dominan términos de categoría.", severity: "high" },
          { label: "Competencia del pack local", detail: "Demanda de alta intención decidida por GBP, reseñas y señales de ubicación.", severity: "high" },
          { label: "Duplicación multi-ubicación", detail: "Las marcas de franquicia arriesgan páginas doorway y datos inconsistentes.", severity: "medium" },
          { label: "Desplazamiento por AI Overview", detail: "Los resúmenes pueden reducir los clics hacia resultados clásicos.", severity: "medium" },
          { label: "Brecha de confianza", detail: "El tráfico sin señales de autoridad rara vez convierte en EE. UU.", severity: "high" },
        ],
      },
      taskcoverApproach: {
        title: "Un sistema operativo regional para la búsqueda estadounidense.",
        description:
          "Conectamos autoridad nacional, precisión local, madurez IA y captura PPC en un solo sistema — para que lo orgánico y lo de pago se refuercen mutuamente en lugar de competir.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación, arquitectura y Core Web Vitals ajustados para grandes catálogos y sitios multi-ubicación estadounidenses." },
          { label: "Autoridad nacional", description: "Clusters temáticos, contenido experto y datos estructurados para SERPs nacionales competitivas." },
          { label: "Precisión local", description: "Páginas de ubicación y zona de servicio únicas y escalables que evitan el comportamiento doorway." },
          { label: "Madurez IA", description: "Claridad de entidad y contenido citable para AI Overviews y respuestas LLM." },
          { label: "Captura PPC", description: "Captura de demanda para SERPs comerciales competitivas donde lo orgánico evoluciona lentamente." },
        ],
      },
      recommendedIndustries: [
        { slug: "saas-seo", reason: "Las SERPs de categoría y comparación son el núcleo de la demanda SaaS estadounidense.", fit: 5 },
        { slug: "ecommerce-seo", reason: "Marketplaces y catálogos competitivos y amplios de alta intención de compra.", fit: 5 },
        { slug: "healthcare-seo", reason: "Demanda local y nacional regulada de alta confianza.", fit: 4 },
        { slug: "legal-immigration-seo", reason: "Intención de tipo de caso y jurisdicción con fuertes necesidades de confianza.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Escalamiento multi-ubicación y franquicia a través de áreas metropolitanas estadounidenses.", fit: 5 },
      ],
      fitSummary: {
        title: "Por qué estas industrias encajan en el mercado estadounidense",
        rows: [
          { label: "Forma de demanda", value: "Categoría nacional + competencia intensa del pack local." },
          { label: "Nivel de confianza", value: "Alto — contenido experto, reseñas y señales de autoridad." },
          { label: "Exposición IA", value: "Fuerte — AI Overviews ampliamente utilizados por compradores estadounidenses." },
          { label: "Escala", value: "Grandes catálogos, multi-ubicación y complejidad de franquicia." },
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
        title: "La pila de crecimiento EE. UU.",
        description:
          "Un sistema conectado para competir en SERPs nacionales saturadas mientras se gana a nivel local y se captura demanda comercial con PPC.",
        groups: [
          { label: "Fundación", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Autoridad", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local y escala", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Captura de demanda", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenido + autoridad para credibilidad estadounidense.",
        description:
          "La búsqueda estadounidense premia los clusters de contenido liderados por expertos y la validación de terceros. Construimos autoridad temática y activos citables que respaldan tanto a Google como a las superficies IA.",
        clusters: [
          "Construir pilares de categoría y comparación alrededor de la intención del comprador.",
          "Crear contenido estructurado y experto que la IA pueda resumir.",
          "Conectar clusters con páginas de conversión con enlazado interno sólido.",
        ],
        authority: [
          "Obtener menciones relevantes en publicaciones que los compradores estadounidenses confían.",
          "Posicionar portavoces para comentarios de experto.",
          "Construir activos citables que los modelos IA prefieren referenciar.",
        ],
      },
      ppcOpportunity: {
        title: "El PPC captura demanda que lo orgánico no puede alcanzar lo suficientemente rápido.",
        description:
          "En SERPs comerciales estadounidenses saturadas, la búsqueda de pago captura demanda cualificada mientras lo orgánico evoluciona. Alineamos el PPC con el mismo mapa de intención que el SEO para que se refuercen mutuamente.",
      },
      trustSignals:
        "No usamos testimonios falsos ni métricas de casos inventadas. Construimos autoridad real mediante contenido experto, datos estructurados y menciones relevantes de terceros.",
      outcomes: [
        { label: "Cobertura nacional más clara", description: "SERPs de categoría y comparación abordadas con autoridad temática." },
        { label: "Visibilidad local más fuerte", description: "Páginas de ubicación únicas y escalables sin riesgo de doorway." },
        { label: "Mejor demanda cualificada", description: "Contenido basado en intención y PPC llegan a los compradores antes." },
        { label: "Señales de confianza más fuertes", description: "Contenido experto y menciones relevantes construyen credibilidad." },
        { label: "Mejor madurez IA", description: "Contenido estructurado y entidades claras para superficies IA." },
        { label: "Priorización más clara", description: "Trabajo ordenado por impacto en ingresos, no solo por volumen de búsqueda." },
      ],
      faqs: [
        { q: "¿Taskcover tiene su sede en EE. UU.?", a: "Taskcover atiende a clientes en EE. UU. No reclamamos una sede estadounidense ni oficinas físicas a menos que se confirme. Nuestro trabajo se construye en torno al comportamiento de búsqueda, la demanda y las señales de confianza estadounidenses." },
        { q: "¿Garantizan rankings en EE. UU.?", a: "No. Nos centramos en visibilidad duradera, autoridad y resultados de ingresos que podemos influir y medir realmente — no garantías de ranking." },
        { q: "¿Pueden apoyar contenido en español para EE. UU.?", a: "Sí. Taskcover admite contenido en español, lo que puede ayudar a servir audiencias hispanas estadounidenses. No sobreestimamos la experiencia del mercado hispano o la presencia local." },
        { q: "¿Gestionan SEO multi-ubicación y franquicia en EE. UU.?", a: "Sí. Construimos arquitecturas de ubicación y zona de servicio únicas y escalables que evitan el comportamiento doorway y mantienen los datos consistentes." },
        { q: "¿La búsqueda IA está incluida para EE. UU.?", a: "Sí. Los compradores estadounidenses usan mucho los AI Overviews, por lo que el contenido estructurado, la claridad de entidad y la autoridad citable se integran desde el principio." },
      ],
      finalCta: {
        title: "Obtén una auditoría de crecimiento SEO EE. UU.",
        description:
          "Mira dónde te encuentras en SERPs nacionales, packs locales, AI Overviews y captura de demanda PPC — con una hoja de ruta priorizada de 90 días.",
        auditLabel: "La auditoría de crecimiento SEO EE. UU. incluye",
        auditItems: [
          "Revisión del panorama (nacional + local + IA)",
          "Brecha de visibilidad competitiva",
          "Instantánea técnica",
          "Oportunidad de contenido y autoridad",
          "Madurez de búsqueda IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["canada-seo-agency", "australia-seo-agency"],
    },

    "canada-seo-agency": {
      slug: "canada-seo-agency",
      icon: "canada",
      name: "Canadá",
      regionLabel: "América del Norte",
      eyebrow: "Agencia SEO Canadá",
      h1: "SEO bilingüe, provincial y basado en confianza para Canadá.",
      metaTitle: "Agencia SEO Canadá para búsqueda inglés/francés e IA",
      metaDescription:
        "Servicios de agencia SEO Canadá para búsqueda bilingüe inglés/francés, visibilidad local y nacional, educación, inmigración, salud y franquicia. SEO internacional, localización y madurez IA — sin falsas garantías.",
      heroDescription:
        "Canadá es un mercado de búsqueda bilingüe y provincial. La demanda en inglés y francés se comporta de manera diferente, Quebec tiene sus propios patrones de búsqueda y confianza, y los compradores esperan contenido claro, creíble y localmente relevante. Construimos sistemas SEO canadienses que respetan el idioma, la región y la confianza — sin sobreestimar la experiencia legal o de cumplimiento específica de Quebec.",
      marketContext:
        "La demanda de búsqueda canadiense se divide entre inglés y francés, con matices provinciales en Quebec y grandes áreas metropolitanas. Educación, inmigración/legal, salud y servicios profesionales son sectores de alta confianza donde la autoridad y la claridad importan más que el volumen.",
      searchLandscape: {
        title: "El panorama de búsqueda canadiense es bilingüe y regional.",
        description:
          "Google domina, pero las SERPs en francés en Quebec se comportan de manera diferente a las SERPs en inglés en el resto de Canadá. El SEO internacional, hreflang y la lógica de localización deciden si la página correcta gana el público adecuado.",
        facets: [
          { label: "SERPs inglés", detail: "Demanda nacional más amplia, similar a los patrones estadounidenses pero menos saturada." },
          { label: "Francés (Quebec)", detail: "Idioma, cultura y patrones de confianza distintos; no solo traducción." },
          { label: "Packs locales", detail: "Demanda de ciudad y provincial a través de grandes áreas metropolitanas." },
          { label: "Superficies IA", detail: "En crecimiento; premian la claridad de entidad y contenido bilingüe bien estructurado." },
        ],
      },
      buyerBehavior: {
        title: "Los compradores canadienses esperan relevancia local y confianza.",
        description:
          "Los compradores buscan en su idioma preferido, esperan contenido regionalmente relevante y validan mediante señales de autoridad. Los compradores de inmigración, educación y salud son especialmente sensibles a la confianza.",
        stages: [
          { stage: "Conciencia", label: "Búsqueda por idioma", description: "Los compradores buscan en inglés o francés, esperando contenido relevante y bien redactado." },
          { stage: "Consideración", label: "Matiz provincial", description: "La región, el estatus migratorio y los proveedores locales dan forma a las listas cortas." },
          { stage: "Validación", label: "Verificaciones de autoridad", description: "Credenciales, contenido experto y señales de confianza locales validan las decisiones." },
          { stage: "Conversión", label: "Admisión local", description: "Llamadas, formularios y consultas generan conversión en sectores de alta confianza." },
        ],
      },
      localSeoAngle: {
        title: "El SEO local abarca provincias y áreas metropolitanas.",
        description:
          "La demanda local canadiense se distribuye a través de grandes áreas metropolitanas y provincias. GBP, citas y datos de ubicación consistentes importan — especialmente para marcas de franquicia y multi-ubicación que operan bilingües.",
      },
      nationalSeoAngle: {
        title: "El SEO nacional debe respetar el idioma.",
        description:
          "La demanda nacional en inglés y francés requiere contenido distinto, no traducciones duplicadas. Un buen hreflang y arquitectura de locale evitan que la página incorrecta se posicione para el público equivocado.",
      },
      aiSearchOpportunity: {
        title: "La IA premia la claridad de entidad en Canadá.",
        description:
          "Los AI Overviews y respuestas LLM canadienses favorecen contenido bilingüe, estructurado y claro. Los activos citables y las entidades de marca consistentes mejoran las probabilidades de ser referenciado.",
      },
      multilingualAngle: {
        title: "La búsqueda bilingüe inglés/francés es central en Canadá.",
        description:
          "Taskcover admite contenido en francés, lo que puede ayudar a servir audiencias canadienses y de Quebec. No sobreestimamos la experiencia legal o de cumplimiento específica de Quebec; construimos arquitectura de localización y contenido francés bien redactado con cuidado.",
      },
      marketChallenges: {
        title: "Dónde vive la fricción SEO canadiense.",
        description:
          "Las partes más difíciles de la búsqueda canadiense son la corrección bilingüe, el matiz provincial y la evitación de la canibalización de contenido duplicado entre inglés y francés.",
        items: [
          { label: "Duplicación bilingüe", detail: "Las páginas traducidas se canibalizan sin un buen hreflang.", severity: "high" },
          { label: "Matiz de Quebec", detail: "La demanda francófona es cultural, no solo traducción.", severity: "medium" },
          { label: "Fragmentación provincial", detail: "La demanda y los competidores varían fuertemente por provincia y área metropolitana.", severity: "medium" },
          { label: "Brechas de confianza", detail: "Los compradores de educación, inmigración y salud son muy sensibles a la confianza.", severity: "high" },
          { label: "Claridad de entidad", detail: "Las superficies IA luchan con entidades de marca bilingües inconsistentes.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "Un sistema operativo regional para la búsqueda canadiense.",
        description:
          "Conectamos SEO internacional, contenido bilingüe, precisión local y claridad de entidad IA para que la demanda en inglés y francés se atienda correctamente — no se duplique.",
        layers: [
          { label: "Arquitectura internacional", description: "Estructura de locale y hreflang para que la página correcta gane el público adecuado." },
          { label: "Contenido bilingüe", description: "Contenido en inglés y francés bien redactado, no traducción automática." },
          { label: "Precisión local", description: "SEO local provincial y metropolitano con datos consistentes." },
          { label: "Claridad de entidad", description: "Entidades de marca bilingües consistentes para superficies IA." },
          { label: "Construcción de confianza", description: "Contenido experto y señales de autoridad canadienses relevantes." },
        ],
      },
      recommendedIndustries: [
        { slug: "education-seo", reason: "Demanda de alta confianza y ciclo largo central en la búsqueda canadiense.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "Intención de tipo de caso y jurisdicción con fuertes necesidades de confianza.", fit: 5 },
        { slug: "healthcare-seo", reason: "Demanda local y nacional basada en confianza.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Escalamiento de franquicia multi-ubicación y bilingüe.", fit: 4 },
        { slug: "ecommerce-seo", reason: "Intención de compra nacional y transfronteriza en crecimiento.", fit: 3 },
      ],
      fitSummary: {
        title: "Por qué estas industrias encajan en el mercado canadiense",
        rows: [
          { label: "Forma de demanda", value: "Bilingüe, provincial y basada en confianza." },
          { label: "Nivel de confianza", value: "Muy alto en educación, inmigración y salud." },
          { label: "Exposición IA", value: "En crecimiento — la claridad de entidad y la estructura bilingüe importan." },
          { label: "Escala", value: "Complejidad nacional + provincial + bilingüe." },
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
        title: "La pila de crecimiento Canadá",
        description:
          "Un sistema construido alrededor de la corrección bilingüe, la arquitectura internacional y los sectores de alta confianza.",
        groups: [
          { label: "Fundación", slugs: ["international-seo", "technical-seo", "seo-audit"] },
          { label: "Autoridad", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local y escala", slugs: ["local-seo"] },
          { label: "Asesoría", slugs: ["seo-mentor-service"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenido + autoridad para confianza canadiense.",
        description:
          "Los compradores canadienses premian el contenido bilingüe liderado por expertos y señales de autoridad creíbles. Construimos clusters que funcionan en ambos idiomas y respaldan citas IA.",
        clusters: [
          "Crear pilares bilingües alrededor de la intención del comprador, no traducciones.",
          "Estructurar contenido para que las superficies IA puedan analizar entidades en ambos idiomas.",
          "Conectar clusters con rutas de conversión provinciales y locales.",
        ],
        authority: [
          "Obtener menciones relevantes en publicaciones y comunidades canadienses.",
          "Posicionar portavoces bilingües para comentarios de experto.",
          "Construir activos citables para audiencias anglófonas y francófonas.",
        ],
      },
      ppcOpportunity: {
        title: "El PPC respalda la captura de demanda a través de mercados lingüísticos.",
        description:
          "La búsqueda de pago puede capturar demanda cualificada en sectores canadienses competitivos mientras lo orgánico evoluciona, con campañas estructuradas alrededor del idioma y la región.",
      },
      trustSignals:
        "No usamos testimonios falsos ni métricas de casos inventadas. Construimos autoridad real mediante contenido experto bilingüe, datos estructurados y menciones canadienses relevantes.",
      outcomes: [
        { label: "Página correcta, público correcto", description: "Demanda en inglés y francés servida por la página localizada correcta." },
        { label: "Visibilidad provincial más fuerte", description: "Cobertura local y nacional que respeta la región." },
        { label: "Mejor demanda cualificada", description: "Contenido basado en confianza llega a compradores de alta intención." },
        { label: "Señales de confianza más fuertes", description: "Contenido experto y menciones relevantes construyen credibilidad." },
        { label: "Mejor madurez IA", description: "Entidades bilingües consistentes para superficies IA." },
        { label: "Priorización más clara", description: "Trabajo ordenado por valor de mercado e idioma." },
      ],
      faqs: [
        { q: "¿Taskcover tiene su sede en Canadá?", a: "Taskcover atiende a clientes en Canadá. No reclamamos una sede canadiense ni oficinas físicas a menos que se confirme. Nuestro trabajo se construye en torno al comportamiento de búsqueda canadiense, la demanda bilingüe y las señales de confianza." },
        { q: "¿Garantizan rankings en Canadá?", a: "No. Nos centramos en visibilidad duradera, autoridad y resultados de ingresos — no garantías de ranking." },
        { q: "¿Pueden redactar contenido en francés para Quebec?", a: "Taskcover admite contenido en francés, lo que puede ayudar a servir audiencias canadienses y de Quebec. No sobreestimamos la experiencia legal o de cumplimiento específica de Quebec." },
        { q: "¿Gestionan hreflang y SEO internacional?", a: "Sí. Una buena arquitectura de locale y hreflang son fundamentales para el trabajo canadiense para que las páginas en inglés y francés no se canibalicen." },
        { q: "¿La búsqueda IA está incluida para Canadá?", a: "Sí. La claridad de entidad y la estructura bilingüe se integran para que las superficies IA puedan referenciar tu marca con confianza." },
      ],
      finalCta: {
        title: "Obtén una auditoría de crecimiento SEO Canadá.",
        description:
          "Mira dónde te encuentras en la demanda en inglés y francés, SERPs provinciales y superficies IA — con una hoja de ruta priorizada de 90 días.",
        auditLabel: "La auditoría de crecimiento SEO Canadá incluye",
        auditItems: [
          "Revisión del panorama (inglés + francés + IA)",
          "Brecha de visibilidad competitiva",
          "Instantánea técnica",
          "Oportunidad de contenido y autoridad",
          "Madurez de búsqueda IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["usa-seo-agency", "australia-seo-agency"],
    },

    "australia-seo-agency": {
      slug: "australia-seo-agency",
      icon: "australia",
      name: "Australia",
      regionLabel: "Asia-Pacífico",
      eyebrow: "Agencia SEO Australia",
      h1: "SEO de alto valor y orientado a la conversión para Australia.",
      metaTitle: "Agencia SEO Australia para SERPs locales, nacionales y comerciales",
      metaDescription:
        "Servicios de agencia SEO Australia para nichos de servicio de alto valor, visibilidad local y nacional, eCommerce, franquicia y captura PPC. SEO técnico, autoridad de contenido y madurez IA — sin falsas garantías.",
      heroDescription:
        "Australia es un mercado de búsqueda de alto valor donde los nichos de servicio comerciales, la demanda local y la competencia nacional se encuentran. Los compradores esperan autoridad de contenido clara y rutas de conversión sólidas, y las SERPs comerciales competitivas a menudo requieren PPC para capturar demanda mientras lo orgánico evoluciona.",
      marketContext:
        "La demanda de búsqueda australiana se concentra en categorías de servicio de alto valor, eCommerce y franquicia/multi-ubicación. La confianza y la claridad de conversión importan; los compradores actúan rápido cuando el contenido es creíble y la ruta para convertir es clara.",
      searchLandscape: {
        title: "El panorama de búsqueda australiano es comercial y liderado por lo local.",
        description:
          "Las SERPs de servicio nacionales son competitivas y de alto valor, mientras que los packs locales deciden la demanda de ciudad y área metropolitana. Las marcas de eCommerce y franquicia compiten con marketplaces, y los AI Overviews cada vez resumen más consultas de servicio y producto.",
        facets: [
          { label: "SERPs comerciales", detail: "Términos de servicio de alto valor con fuerte competencia de pago." },
          { label: "Packs locales", detail: "Deciden la demanda de ciudad, área metropolitana y zona de servicio." },
          { label: "eCommerce", detail: "Competencia de catálogo nacional con marketplaces." },
          { label: "Superficies IA", detail: "Resumen consultas de servicio y producto; premian contenido estructurado." },
        ],
      },
      buyerBehavior: {
        title: "Los compradores australianos valoran la claridad y la credibilidad.",
        description:
          "Los compradores buscan proveedores de servicios, comparan opciones y convierten cuando la confianza y las rutas de conversión son claras. Los nichos de alto valor premian el contenido experto y una fuerte presencia local.",
        stages: [
          { stage: "Conciencia", label: "Búsqueda de servicio", description: "Los compradores buscan categorías de servicio y producto de alto valor." },
          { stage: "Consideración", label: "Comparación de proveedores", description: "Las listas cortas se forman mediante reseñas, autoridad y presencia local." },
          { stage: "Validación", label: "Verificaciones de confianza", description: "Credenciales y contenido experto validan la elección." },
          { stage: "Conversión", label: "Ruta clara", description: "Llamadas, formularios y reservas convierten cuando la ruta es fluida." },
        ],
      },
      localSeoAngle: {
        title: "El SEO local gana la demanda australiana de alto valor.",
        description:
          "La demanda de ciudad y área metropolitana en Australia es a menudo de alto valor. GBP, reseñas y páginas locales únicas deciden quién captura la intención local cualificada.",
      },
      nationalSeoAngle: {
        title: "El SEO nacional compite en autoridad y claridad.",
        description:
          "Las SERPs nacionales de servicio y eCommerce premian la autoridad temática, los datos estructurados y las rutas de conversión claras — no contenido genérico.",
      },
      aiSearchOpportunity: {
        title: "La búsqueda IA está creciendo en las categorías australianas.",
        description:
          "Los AI Overviews cada vez resumen más consultas de servicio y producto en Australia. El contenido estructurado y la claridad de entidad mejoran las probabilidades de cita — sin citas garantizadas.",
      },
      marketChallenges: {
        title: "Dónde vive la fricción SEO australiana.",
        description:
          "Las partes más difíciles de la búsqueda australiana son la competencia de alto valor, la brecha entre tráfico y conversiones y el escalamiento de presencia local sin duplicación.",
        items: [
          { label: "Costo de SERPs comerciales", detail: "Los términos de alto valor a menudo requieren captura PPC junto con lo orgánico.", severity: "high" },
          { label: "Presión del pack local", detail: "La demanda de ciudad y área metropolitana está muy disputada.", severity: "high" },
          { label: "Brechas de conversión", detail: "El tráfico llega pero las rutas para convertir son débiles.", severity: "medium" },
          { label: "Brechas de autoridad de contenido", detail: "El contenido genérico falla en nichos de servicio de alta confianza.", severity: "medium" },
          { label: "Duplicación multi-ubicación", detail: "Las marcas de franquicia arriesgan páginas locales delgadas y duplicadas.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "Un sistema operativo regional para la búsqueda australiana.",
        description:
          "Conectamos lo técnico, lo local, la autoridad de contenido, la madurez IA y la captura PPC para que la demanda de alto valor se gane y convierta — no solo se visite.",
        layers: [
          { label: "Fundación técnica", description: "Rastreo, indexación y rendimiento para catálogos y sitios multi-ubicación." },
          { label: "Autoridad de contenido", description: "Clusters expertos para categorías de servicio y producto de alto valor." },
          { label: "Precisión local", description: "Páginas locales únicas y escalables para demanda de ciudad y área metropolitana." },
          { label: "Madurez IA", description: "Contenido estructurado y entidades para superficies IA." },
          { label: "Captura PPC", description: "Captura de demanda para SERPs comerciales competitivas." },
        ],
      },
      recommendedIndustries: [
        { slug: "ecommerce-seo", reason: "Competencia de catálogo nacional con marketplaces.", fit: 5 },
        { slug: "saas-seo", reason: "Demanda de categoría y comparación en SaaS APAC.", fit: 4 },
        { slug: "healthcare-seo", reason: "Demanda local y nacional de bienestar de alta confianza.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Escalamiento multi-ubicación a través de áreas metropolitanas australianas.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "Demanda de servicio local de alto valor.", fit: 3 },
      ],
      fitSummary: {
        title: "Por qué estas industrias encajan en el mercado australiano",
        rows: [
          { label: "Forma de demanda", value: "Comercial de alto valor + liderada por lo local." },
          { label: "Nivel de confianza", value: "Alto en categorías de servicio y bienestar." },
          { label: "Exposición IA", value: "En crecimiento en consultas de servicio y producto." },
          { label: "Escala", value: "Complejidad nacional + metropolitana + franquicia." },
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
        title: "La pila de crecimiento Australia",
        description:
          "Un sistema para ganar demanda de alto valor, escalar presencia local y capturar SERPs comerciales con PPC.",
        groups: [
          { label: "Fundación", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Autoridad", slugs: ["content-marketing"] },
          { label: "Local y escala", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Captura de demanda", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Contenido + autoridad para credibilidad australiana.",
        description:
          "Los nichos australianos de alto valor premian el contenido experto, señales de autoridad claras y datos estructurados que respaldan tanto a Google como a las superficies IA.",
        clusters: [
          "Construir clusters de servicio y producto alrededor de la intención de alto valor.",
          "Estructurar contenido para que las superficies IA puedan resumir y citar.",
          "Conectar clusters con rutas de conversión claras.",
        ],
        authority: [
          "Obtener menciones relevantes en publicaciones y comunidades australianas.",
          "Posicionar portavoces para comentarios de experto en APAC.",
          "Construir activos citables para categorías de servicio y producto.",
        ],
      },
      ppcOpportunity: {
        title: "El PPC captura demanda comercial de alto valor.",
        description:
          "Las SERPs comerciales australianas son competitivas y de alto valor. La búsqueda de pago captura demanda cualificada mientras lo orgánico evoluciona, alineada con el mismo mapa de intención.",
      },
      trustSignals:
        "No usamos testimonios falsos ni métricas de casos inventadas. Construimos autoridad real mediante contenido experto, datos estructurados y menciones australianas relevantes.",
      outcomes: [
        { label: "Cobertura de mercado más clara", description: "Demanda nacional y local abordada coherentemente." },
        { label: "Visibilidad local más fuerte", description: "Presencia de ciudad y área metropolitana sin duplicación." },
        { label: "Mejor demanda cualificada", description: "El contenido experto llega a compradores de alto valor." },
        { label: "Señales de confianza más fuertes", description: "La autoridad y las menciones relevantes construyen credibilidad." },
        { label: "Mejor autoridad de contenido", description: "Los clusters temáticos evolucionan con el tiempo." },
        { label: "Mejor madurez IA", description: "Contenido estructurado para superficies IA." },
      ],
      faqs: [
        { q: "¿Taskcover tiene su sede en Australia?", a: "Taskcover atiende a clientes en Australia. No reclamamos una sede australiana ni oficinas físicas a menos que se confirme. Nuestro trabajo se construye en torno al comportamiento de búsqueda y las señales de confianza australianas." },
        { q: "¿Garantizan rankings en Australia?", a: "No. Nos centramos en visibilidad duradera, autoridad y resultados de ingresos — no garantías de ranking." },
        { q: "¿Pueden ayudar con el SEO local australiano?", a: "Sí. Construimos páginas locales únicas y escalables y estrategias GBP para la demanda de ciudad y área metropolitana en toda Australia." },
        { q: "¿El PPC está incluido para Australia?", a: "El PPC es parte del sistema de crecimiento australiano porque las SERPs comerciales son de alto valor y competitivas. Está alineado con los datos de intención orgánica." },
        { q: "¿Admiten eCommerce y franquicia en Australia?", a: "Sí. La arquitectura de categoría de eCommerce y el SEO local de franquicia/multi-ubicación son fundamentales para el mercado australiano." },
      ],
      finalCta: {
        title: "Obtén una auditoría de crecimiento SEO Australia.",
        description:
          "Mira dónde te encuentras en SERPs comerciales, packs locales, superficies IA y captura de demanda PPC — con una hoja de ruta priorizada de 90 días.",
        auditLabel: "La auditoría de crecimiento SEO Australia incluye",
        auditItems: [
          "Revisión del panorama (nacional + local + IA)",
          "Brecha de visibilidad competitiva",
          "Instantánea técnica",
          "Oportunidad de contenido y autoridad",
          "Madurez de búsqueda IA",
          "Hoja de ruta de 90 días",
        ],
      },
      related: ["usa-seo-agency", "canada-seo-agency"],
    },
  },

  ui: {
    breadcrumbHome: "Inicio",
    breadcrumbMarkets: "Mercados",
    heroCtaPrimary: "Auditoría SEO gratis",
    heroCtaSecondary: "Reservar llamada",
    searchLandscapeEyebrow: "Panorama de búsqueda",
    searchLandscapeRadar: "Mapa de inteligencia de mercado",
    buyerBehaviorEyebrow: "Comportamiento del comprador",
    buyerBehaviorIntentPath: "Recorrido de demanda",
    challengesEyebrow: "Desafíos del mercado",
    challengesScanner: "Escáner de fricción competitiva",
    challengesRiskLevel: "Nivel de riesgo",
    approachEyebrow: "Enfoque Taskcover",
    approachOperatingModel: "Sistema operativo regional",
    localSeoLabel: "SEO local",
    nationalSeoLabel: "SEO nacional",
    aiSearchLabel: "Búsqueda IA",
    ppcLabel: "PPC",
    multilingualLabel: "Multilingüe",
    industriesEyebrow: "Industrias recomendadas",
    industriesTitle: "Industrias que encajan en este mercado",
    industriesDesc: "Dónde este mercado premia el enfoque, según la forma de demanda, confianza y escala.",
    industriesFitSummary: "Resumen de encaje de mercado",
    industriesFitScale: "Encaje",
    servicesEyebrow: "Servicios recomendados",
    servicesTitle: "La pila de crecimiento de búsqueda para este mercado",
    servicesDesc: "Un conjunto conectado de servicios ajustado a cómo este mercado busca y convierte.",
    servicesGrowthStack: "Pila de crecimiento",
    contentAuthorityEyebrow: "Contenido y autoridad",
    contentAuthorityClusters: "Clusters de contenido",
    contentAuthorityLadder: "Escalera de autoridad",
    outcomesEyebrow: "Resultados",
    outcomesDesc: "Categorías de resultados que perseguimos — sin métricas inventadas.",
    faqEyebrow: "FAQ",
    faqTitle: "Preguntas de compra por mercado",
    ctaEyebrow: "Próximo paso",
    ctaAuditPreview: "Vista previa de la auditoría",
    ctaIllustrative: "Vista previa ilustrativa — sin métricas inventadas.",
    selectorViewMarket: "Ver",
    comparisonMarket: "Mercado",
    comparisonLevels: { low: "Bajo", medium: "Medio", high: "Alto", veryHigh: "Muy alto" },
    growthSystemsIncludes: "Incluye",
    relatedEyebrow: "Mercados relacionados",
    relatedTitle: "Explorar mercados relacionados",
    exploreMarket: "Explorar mercado",
    outcome: "Resultado",
    trustFootnote:
      "La experiencia seleccionada del equipo y socios cubre marcas, campañas y programas de búsqueda globales. Los nombres de marca se referencian solo contextualmente y no implican respaldo a menos que se indique explícitamente.",
  },
};