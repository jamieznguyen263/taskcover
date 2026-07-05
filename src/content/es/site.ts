/**
 * Spanish site UI strings.
 * Keeps the same keys as the English canonical file. URLs stay English.
 */

import type { SiteContent } from "../en/site";

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Agencia de crecimiento en busqueda para Google, busqueda con IA e ingresos.",
    marketsLine: "Atendemos a clientes en Estados Unidos, Canada y Australia.",
  },
  navigation: [
    { label: "Servicios", href: "/services" },
    { label: "Soluciones", href: "/industries" },
    { label: "Proyectos", href: "/work" },
    { label: "Analisis", href: "/insights" },
    { label: "Empresa", href: "/about" },
    { label: "Precios", href: "/pricing" },
  ],
  megaMenu: [
    {
      id: "services",
      label: "Servicios",
      description: "Elige la capacidad de crecimiento en busqueda que encaja con el problema comercial.",
      groups: [
        {
          title: "Servicios principales",
          links: [
            {
              label: "Estrategia SEO y auditoria",
              href: "/services/seo-agency",
              description: "Roadmaps, diagnostico, priorizacion y planificacion de crecimiento search.",
              chip: "Estrategia",
            },
            {
              label: "SEO tecnico",
              href: "/services/technical-seo",
              description: "Rastreo, indexacion, renderizado, velocidad y arquitectura del sitio.",
              chip: "Base",
            },
            {
              label: "Busqueda IA / GEO",
              href: "/services/ai-search-optimization",
              description: "Preparacion para superficies de respuesta, entidades, citas y calidad de fuentes.",
              chip: "IA",
            },
            {
              label: "Autoridad de contenido",
              href: "/services/content-marketing",
              description: "Sistemas de contenido experto conectados con intencion de ingresos.",
              chip: "Autoridad",
            },
          ],
        },
        {
          title: "Canales de crecimiento",
          links: [
            {
              label: "SEO local e internacional",
              href: "/services/international-seo",
              description: "Arquitectura multi-mercado, visibilidad local y expansion hreflang segura.",
              chip: "Mercados",
            },
            {
              label: "Gestion PPC",
              href: "/services/ppc-management",
              description: "Captura de demanda pagada alineada con inteligencia organica.",
              chip: "Paid",
            },
            {
              label: "Mentoria SEO",
              href: "/services/seo-mentor-service",
              description: "Asesoria, coaching para fundadores y desarrollo de capacidades del equipo.",
              chip: "Asesoria",
            },
          ],
        },
      ],
      cta: {
        label: "Empezar con una auditoria SEO gratuita",
        href: "/free-seo-audit",
        description: "Si no sabes que necesitas, empieza con un diagnostico priorizado.",
      },
    },
    {
      id: "solutions",
      label: "Soluciones",
      description: "Explora sistemas de crecimiento search por sector y mercado.",
      groups: [
        {
          title: "Por sector",
          links: [
            {
              label: "Viajes y hospitalidad",
              href: "/industries/travel-seo",
              description: "Demanda de destinos, hoteles, restaurantes y reservas.",
            },
            {
              label: "Educacion",
              href: "/industries/education-seo",
              description: "Trayectos de busqueda para programas, instituciones y matriculas.",
            },
            {
              label: "Salud y bienestar",
              href: "/industries/healthcare-seo",
              description: "Busqueda local de alta confianza y autoridad en salud.",
            },
            {
              label: "Legal e inmigracion",
              href: "/industries/legal-immigration-seo",
              description: "Reputacion, jurisdiccion y demanda de alta intencion.",
            },
            {
              label: "SaaS y tecnologia",
              href: "/industries/saas-seo",
              description: "Categorias, alternativas, integraciones y visibilidad IA.",
            },
            {
              label: "eCommerce",
              href: "/industries/ecommerce-seo",
              description: "Arquitectura search para categorias, productos y transacciones.",
            },
            {
              label: "Franquicias y multiples ubicaciones",
              href: "/industries/franchise-local-seo",
              description: "Sistemas locales a escala sin paginas doorway.",
            },
          ],
        },
        {
          title: "Por mercado",
          links: [
            {
              label: "Estados Unidos",
              href: "/markets/usa-seo-agency",
              description: "Competencia nacional, local, resenas, PPC y busqueda con IA.",
            },
            {
              label: "Canada",
              href: "/markets/canada-seo-agency",
              description: "Comportamiento de busqueda bilingue y provincial EN/FR.",
            },
            {
              label: "Australia",
              href: "/markets/australia-seo-agency",
              description: "Demanda metropolitana, local packs, reputacion y paid search.",
            },
            {
              label: "SEO internacional / busqueda multi-mercado",
              href: "/services/international-seo",
              description: "Arquitectura para crecer entre mercados sin contenido duplicado.",
            },
          ],
        },
      ],
    },
    {
      id: "work",
      label: "Proyectos",
      description: "Revisa casos verificados, entregables de muestra, estandares de prueba y referencias privadas.",
      groups: [
        {
          title: "Proyectos y prueba",
          links: [
            {
              label: "Hub de proyectos",
              href: "/work",
              description: "Como Taskcover convierte la metodologia en entregables.",
            },
            {
              label: "Casos de estudio",
              href: "/work/case-studies",
              description: "Casos publicos verificados de crecimiento search.",
            },
            {
              label: "Auditorias de muestra",
              href: "/work/sample-audits",
              description: "Entregables ilustrativos que muestran el metodo.",
            },
            {
              label: "Resultados de clientes",
              href: "/work/client-results",
              description: "Estandares de publicacion y manejo de resultados verificados.",
            },
            {
              label: "Sistema de prueba",
              href: "/proof",
              description: "Reglas de evidencia, autoridad y rutas de confianza.",
            },
            {
              label: "Marcos de crecimiento search",
              href: "/work/search-growth-frameworks",
              description: "Modelos operativos y marcos estrategicos.",
            },
          ],
        },
      ],
      cta: {
        label: "Solicitar una referencia privada",
        href: "/contact?intent=private-reference",
        description: "Las referencias privadas calificadas se gestionan caso por caso.",
      },
    },
    {
      id: "insights",
      label: "Analisis",
      description: "Lee guias practicas por tema de crecimiento search.",
      groups: [
        {
          title: "Categorias editoriales",
          links: [
            {
              label: "Guias SEO",
              href: "/insights/seo-guides",
              description: "Estrategia search, crecimiento de ingresos y SEO moderno.",
            },
            {
              label: "Busqueda IA y GEO",
              href: "/insights/ai-search",
              description: "Visibilidad IA, citas, superficies de respuesta y medicion.",
            },
            {
              label: "SEO tecnico",
              href: "/insights/technical-seo",
              description: "Rastreo, renderizado, rendimiento e indexacion.",
            },
            {
              label: "Autoridad de contenido",
              href: "/insights/content-authority",
              description: "Information gain, autoridad tematica y citas.",
            },
            {
              label: "SEO local e internacional",
              href: "/insights/local-international-seo",
              description: "Expansion de mercado, busqueda local y estructura multilingue.",
            },
            {
              label: "PPC e inteligencia search",
              href: "/insights/ppc-search-intelligence",
              description: "Alineacion de senales pagadas y organicas.",
            },
            {
              label: "Mentoria SEO",
              href: "/insights/seo-mentor",
              description: "Asesoria, formacion y liderazgo search.",
            },
          ],
        },
      ],
      cta: {
        label: "Explorar el hub de Analisis",
        href: "/insights",
        description: "Los articulos apoyan la pagina comercial correcta sin reemplazarla.",
      },
    },
    {
      id: "company",
      label: "Empresa",
      description: "Entiende el modelo operativo, los estandares de confianza y las rutas de contacto.",
      groups: [
        {
          title: "Empresa",
          links: [
            {
              label: "Acerca de",
              href: "/about",
              description: "Identidad, principios operativos y reglas de prueba.",
            },
            {
              label: "Metodologia",
              href: "/methodology",
              description: "Search Growth Operating System y enfoque de diagnostico.",
            },
            {
              label: "Como trabajamos",
              href: "/how-we-work",
              description: "Flujo de trabajo, entradas, aprobaciones y ritmo de colaboracion.",
            },
            {
              label: "Contacto",
              href: "/contact",
              description: "Rutas para ventas, medios, partners y solicitudes generales.",
            },
            {
              label: "Accesibilidad",
              href: "/accessibility",
              description: "Enfoque de accesibilidad y canal de comentarios.",
            },
            {
              label: "Solicitud de datos",
              href: "/data-request",
              description: "Ruta de privacidad y solicitudes de datos.",
            },
          ],
        },
      ],
    },
  ],
  primaryCta: { label: "Auditoria SEO gratuita", href: "/free-seo-audit" },
  secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
  footer: {
    groups: [
      {
        title: "Servicios",
        links: [
          { label: "Estrategia SEO", href: "/services/seo-agency" },
          { label: "SEO tecnico", href: "/services/technical-seo" },
          { label: "Optimizacion busqueda IA", href: "/services/ai-search-optimization" },
          { label: "Marketing de contenidos", href: "/services/content-marketing" },
          { label: "RP digitales y enlaces", href: "/services/digital-pr-link-building" },
          { label: "Gestion PPC", href: "/services/ppc-management" },
          { label: "SEO local", href: "/services/local-seo" },
          { label: "SEO para e-commerce", href: "/services/ecommerce-seo" },
          { label: "SEO internacional", href: "/services/international-seo" },
          { label: "Auditoria SEO", href: "/services/seo-audit" },
          { label: "Mentoria SEO", href: "/services/seo-mentor-service" },
        ],
      },
      {
        title: "Soluciones",
        links: [
          { label: "SEO para viajes", href: "/industries/travel-seo" },
          { label: "SEO para educacion", href: "/industries/education-seo" },
          { label: "SEO para salud", href: "/industries/healthcare-seo" },
          { label: "SEO legal e inmigracion", href: "/industries/legal-immigration-seo" },
          { label: "SEO para SaaS", href: "/industries/saas-seo" },
          { label: "SEO para e-commerce", href: "/industries/ecommerce-seo" },
          { label: "SEO para franquicias y local", href: "/industries/franchise-local-seo" },
          { label: "Agencia SEO Estados Unidos", href: "/markets/usa-seo-agency" },
          { label: "Agencia SEO Canada", href: "/markets/canada-seo-agency" },
          { label: "Agencia SEO Australia", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Proyectos",
        links: [
          { label: "Proyectos", href: "/work" },
          { label: "Casos de estudio", href: "/work/case-studies" },
          { label: "Auditorias de muestra", href: "/work/sample-audits" },
          { label: "Marcos de crecimiento search", href: "/work/search-growth-frameworks" },
          { label: "Resultados de clientes", href: "/work/client-results" },
          { label: "Pruebas", href: "/proof" },
          { label: "Referencia privada", href: "/contact?intent=private-reference" },
        ],
      },
      {
        title: "Analisis",
        links: [
          { label: "Guias SEO", href: "/insights/seo-guides" },
          { label: "Busqueda IA y GEO", href: "/insights/ai-search" },
          { label: "SEO tecnico", href: "/insights/technical-seo" },
          { label: "Autoridad de contenido", href: "/insights/content-authority" },
          { label: "SEO local e internacional", href: "/insights/local-international-seo" },
          { label: "PPC e inteligencia search", href: "/insights/ppc-search-intelligence" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Acerca de", href: "/about" },
          { label: "Metodologia", href: "/methodology" },
          { label: "Como trabajamos", href: "/how-we-work" },
          { label: "Precios", href: "/pricing" },
          { label: "Auditoria SEO gratuita", href: "/free-seo-audit" },
          { label: "Reservar llamada", href: "/book-a-call" },
          { label: "Contacto", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacidad", href: "/privacy-policy" },
          { label: "Politica de cookies", href: "/cookie-policy" },
          { label: "Preferencias de cookies", href: "/cookie-preferences" },
          { label: "Terminos", href: "/terms" },
          { label: "Accesibilidad", href: "/accessibility" },
          { label: "Solicitud de datos", href: "/data-request" },
        ],
      },
    ],
    footnote:
      "La experiencia seleccionada del equipo y los socios incluye marcas globales y partners. Los nombres de marca se mencionan solo como contexto y no implican respaldo salvo que se indique explicitamente.",
    rights: "Todos los derechos reservados.",
  },
  ui: {
    bookCallLabel: "Reservar llamada",
    exploreService: "Explorar servicio",
    openMenu: "Abrir menu",
    closeMenu: "Cerrar menu",
    auditPreview: "Vista previa de auditoria",
    reportFormat: "Formato del informe",
    auditIncludes: "La auditoria incluye",
    module: "Modulo",
    outcome: "Resultado",
    languageLabel: "Idioma",
    home: "Inicio",
    services: "Servicios",
    recommendedFirstStep: "Primer paso recomendado",
  },
};
