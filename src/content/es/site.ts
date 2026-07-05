/**
 * Spanish site UI strings.
 * Keeps the same keys as the English canonical file. URLs stay English.
 */

import type { SiteContent } from "../en/site";

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Agencia de crecimiento en búsqueda para Google, búsqueda con IA e ingresos.",
    marketsLine: "Atendemos a clientes en Estados Unidos, Canadá y Australia.",
  },
  navigation: [
    { label: "Servicios", href: "/services" },
    { label: "Sectores", href: "/industries" },
    { label: "Mercados", href: "/markets" },
    { label: "Proyectos", href: "/work" },
    { label: "Pruebas", href: "/proof" },
    { label: "Acerca de", href: "/about" },
    { label: "Análisis", href: "/insights" },
  ],
  primaryCta: { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
  secondaryCta: { label: "Reservar llamada", href: "/book-a-call" },
  footer: {
    groups: [
      {
        title: "Servicios",
        links: [
          { label: "Estrategia SEO", href: "/services/seo-agency" },
          { label: "SEO técnico", href: "/services/technical-seo" },
          { label: "Optimización para búsqueda con IA", href: "/services/ai-search-optimization" },
          { label: "Marketing de contenidos", href: "/services/content-marketing" },
          { label: "RP digitales y enlazado", href: "/services/digital-pr-link-building" },
          { label: "Gestión de PPC", href: "/services/ppc-management" },
          { label: "SEO local", href: "/services/local-seo" },
          { label: "SEO para e-commerce", href: "/services/ecommerce-seo" },
          { label: "SEO internacional", href: "/services/international-seo" },
          { label: "Auditoría SEO", href: "/services/seo-audit" },
          { label: "Servicio de mentoría SEO", href: "/services/seo-mentor-service" },
        ],
      },
      {
        title: "Sectores",
        links: [
          { label: "SEO para Viajes", href: "/industries/travel-seo" },
          { label: "SEO para Educación", href: "/industries/education-seo" },
          { label: "SEO para Salud", href: "/industries/healthcare-seo" },
          { label: "SEO Legal e Inmigración", href: "/industries/legal-immigration-seo" },
          { label: "SEO para SaaS", href: "/industries/saas-seo" },
          { label: "SEO para E-commerce", href: "/industries/ecommerce-seo" },
          { label: "SEO para Franquicias y Local", href: "/industries/franchise-local-seo" },
        ],
      },
      {
        title: "Mercados",
        links: [
          { label: "Agencia SEO Estados Unidos", href: "/markets/usa-seo-agency" },
          { label: "Agencia SEO Canadá", href: "/markets/canada-seo-agency" },
          { label: "Agencia SEO Australia", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Proyectos",
        links: [
          { label: "Proyectos", href: "/work" },
          { label: "Casos de estudio", href: "/work/case-studies" },
          { label: "Auditorías de muestra", href: "/work/sample-audits" },
          { label: "Marcos de crecimiento", href: "/work/search-growth-frameworks" },
          { label: "Resultados de clientes", href: "/work/client-results" },
        ],
      },
      {
        title: "Pruebas",
        links: [
          { label: "Pruebas", href: "/proof" },
          { label: "Experiencia de marca", href: "/proof/brand-experience" },
          { label: "Presencia en medios", href: "/proof/media-features" },
          { label: "Reseñas de clientes", href: "/proof/client-reviews" },
          { label: "Reseñas en video", href: "/proof/video-reviews" },
          { label: "Portavoz", href: "/proof/spokesperson" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Análisis", href: "/insights" },
          { label: "Guias SEO", href: "/insights/seo-guides" },
          { label: "Busqueda IA", href: "/insights/ai-search" },
          { label: "SEO tecnico", href: "/insights/technical-seo" },
          { label: "Autoridad contenido", href: "/insights/content-authority" },
          { label: "SEO Mentor", href: "/insights/seo-mentor" },
          { label: "Auditoría SEO gratuita", href: "/free-seo-audit" },
          { label: "Reservar llamada", href: "/book-a-call" },
          { label: "Contacto", href: "/contact" },
          { label: "Acerca de", href: "/about" },
          { label: "Metodologia", href: "/methodology" },
          { label: "Como trabajamos", href: "/how-we-work" },
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
      "La experiencia seleccionada del equipo y los socios incluye marcas globales y socios. Los nombres de marca se mencionan únicamente a título ilustrativo y no implican respaldo a menos que se indique explícitamente.",
    rights: "Todos los derechos reservados.",
  },
  ui: {
    bookCallLabel: "Reservar llamada",
    exploreService: "Explorar servicio",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    auditPreview: "Vista previa de auditoría",
    reportFormat: "Formato del informe",
    auditIncludes: "La auditoría incluye",
    module: "Módulo",
    outcome: "Resultado",
    languageLabel: "Idioma",
    home: "Inicio",
    services: "Servicios",
  },
};
