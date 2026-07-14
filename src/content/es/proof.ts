import type { ProofContent } from "@/content/proof.types";

export const proof: ProofContent = {
  ui: {
    home: "Inicio",
    proof: "Pruebas",
    verifiedPublic: "Público verificado",
    privateReference: "Referencia privada",
    sourceLinked: "Con fuente vinculada",
    permissioned: "Autorizado",
    disclosure: "Divulgación",
    evidenceType: "Tipo de evidencia",
    verificationStatus: "Estado de verificación",
    requestReference: "Solicitar una referencia privada",
    mediaInquiry: "Consulta de medios",
    reviewStandard: "Estándar de reseñas",
    publicEvidence: "Evidencia pública",
    confidentialEngagement: "Proyecto confidencial",
    bookStrategyCall: "Reservar llamada estratégica",
    noPublicEvidenceTitle: "No se publica evidencia pública hasta que esté verificada y autorizada.",
    noPublicEvidenceBody:
      "El registro puede aceptar reseñas, enlaces de medios, historias en video y perfiles más adelante. Hasta que un registro cumpla la regla de publicación, la página pública muestra el estándar en lugar del nombre.",
    publicEvidenceRule:
      "La publicación exige permiso público verificado, estado verificado y divulgación pública explícita.",
    privateReferenceLine:
      "Puede haber referencias privadas disponibles para proyectos calificados.",
    relatedProofChannels: "Canales de prueba relacionados",
    evidenceLedger: "Registro de evidencias",
    verificationWorkflow: "Flujo de verificación",
    source: "Fuente",
    status: "Estado",
    approvedExperienceContext:
      "Experiencia seleccionada del equipo y socios en marcas globales, campañas y programas de búsqueda.",
  },
  channelLinks: [
    {
      label: "Experiencia de marca",
      href: "/proof/brand-experience",
      description: "Contexto aprobado sobre experiencia del equipo y socios, sin implicar respaldo.",
    },
    {
      label: "Presencia en medios",
      href: "/proof/media-features",
      description: "Registro con fuentes para prensa y comentarios expertos cuando se permite la divulgación.",
    },
    {
      label: "Reseñas de clientes",
      href: "/proof/client-reviews",
      description: "Feedback verificado únicamente, con estado de permiso y reglas de divulgación pública.",
    },
    {
      label: "Reseñas en video",
      href: "/proof/video-reviews",
      description: "Biblioteca preparada para futuras historias de clientes y testimonios en video aprobados.",
    },
    {
      label: "Portavoz",
      href: "/proof/spokesperson",
      description: "Comentario experto a nivel agencia, con perfiles de portavoz verificables en el futuro.",
    },
  ],
  hub: {
    metaTitle: "Sistema de pruebas y autoridad",
    metaDescription:
      "Explora el marco de evidencia de Taskcover para experiencia de marca, reseñas de clientes, enlaces de medios, videos, referencias privadas y perfiles de portavoz.",
    eyebrow: "Pruebas + autoridad",
    h1: "Evidencia antes que afirmaciones.",
    intro:
      "Separamos experiencia, evidencia y afirmaciones para que los compradores sepan exactamente qué está verificado, qué es privado y qué aún no es público.",
    commandModules: [
      { label: "Evidencia pública", status: "Verificado", detail: "La prueba con nombre aparece solo cuando permiso y verificación están completos." },
      { label: "Referencias privadas", status: "Privado", detail: "Las referencias confidenciales se gestionan caso por caso y nunca se exponen públicamente." },
      { label: "Contexto de experiencia", status: "Divulgación segura", detail: "La experiencia de marca se describe como contexto, no como respaldo." },
      { label: "Preparación para medios", status: "Con fuente", detail: "Los enlaces de medios requieren publicación, fecha, fuente y texto aprobado." },
      { label: "Estándar de verificación", status: "Autorizado", detail: "Cada prueba pública debe pasar una barrera de evidencia por registro." },
    ],
    authority: {
      eyebrow: "Marco de autoridad",
      title: "Un sistema de confianza por capas, no prueba social decorativa.",
      description:
        "El modelo de autoridad de Taskcover separa contexto de experiencia, evidencia pública, referencias privadas, comentario en medios, evidencia en video, metodología de búsqueda y reportes transparentes.",
      layers: [
        { label: "Experiencia del equipo y socios", detail: "Exposición relevante a entornos de búsqueda y entrega." },
        { label: "Evidencia pública de clientes", detail: "Prueba con nombre solo después de verificación y permiso." },
        { label: "Referencias privadas", detail: "Presentaciones solo cuando encaje, consentimiento y confidencialidad lo permitan." },
        { label: "Comentario en medios", detail: "Enlaces publicados y contexto del tema cuando estén disponibles." },
        { label: "Evidencia en video", detail: "Identidad, contexto, texto final y activos fuente aprobados." },
        { label: "Metodología de búsqueda", detail: "Sistemas repetibles de estrategia, técnica, contenido, autoridad y reporting." },
        { label: "Reportes transparentes", detail: "Definiciones claras de lo afirmado, medido o reservado." },
      ],
    },
    experience: {
      eyebrow: "Contexto de experiencia seleccionada",
      title: "La experiencia puede ser útil sin convertirse en testimonio.",
      description:
        "Los nombres siguientes solo pueden mencionarse dentro del contexto aprobado y no deben usarse como reseñas, respaldo o prueba mediante logotipos.",
      brands: ["Agoda", "Skyscanner", "British Council", "Avis"],
      disclosure:
        "El contexto de experiencia no implica respaldo actual. La contribución individual y el alcance del proyecto pueden variar. Los detalles públicos se comparten solo cuando la divulgación está permitida.",
    },
    standards: {
      eyebrow: "Estándares de prueba",
      title: "Qué considera Taskcover evidencia publicable.",
      description:
        "La evidencia pasa por un flujo controlado antes de que cualquier nombre, cita, enlace, activo o historia sea público.",
      steps: [
        "Fuente recibida",
        "Identidad y contexto confirmados",
        "Permiso revisado",
        "Texto público aprobado",
        "Fuente vinculada",
        "Publicado",
      ],
    },
    channels: {
      eyebrow: "Canales de prueba",
      title: "Un mapa de evidencia que los compradores pueden revisar.",
      description:
        "Cada canal tiene sus propias reglas de divulgación, comportamiento sin evidencia pública y ruta futura de registro.",
    },
    privatePath: {
      eyebrow: "Ruta de referencia privada",
      title: "El trabajo confidencial sigue siendo confidencial salvo aprobación explícita.",
      description:
        "Algunos proyectos no pueden divulgarse públicamente. Taskcover puede evaluar si una referencia privada es adecuada para un proyecto calificado, pero la disponibilidad no se garantiza.",
      steps: [
        "Encaje del proyecto",
        "Revisión de confidencialidad",
        "Disponibilidad de referencia",
        "Confirmación de permiso",
        "Presentación privada cuando sea apropiado",
      ],
    },
    cta: {
      eyebrow: "Evaluar encaje",
      title: "Revise el estándar de prueba antes de evaluar el trabajo.",
      description:
        "Reserve una llamada estratégica o solicite una ruta de referencia privada. No se comparten nombres públicos si el registro de evidencia no lo permite.",
    },
  },
  pages: {
    "brand-experience": {
      slug: "brand-experience",
      label: "Experiencia de marca",
      metaTitle: "Contexto de experiencia de marca",
      metaDescription:
        "Conoce cómo Taskcover presenta experiencia seleccionada del equipo y socios de forma segura sin implicar respaldo ni relaciones directas con clientes.",
      eyebrow: "Experiencia de marca",
      h1: "Experiencia en entornos de búsqueda.",
      intro:
        "Esta página explica el contexto aprobado para experiencia seleccionada del equipo y socios sin convertir nombres de marca en respaldos, testimonios o prueba de contratación directa.",
    },
    "media-features": {
      slug: "media-features",
      label: "Presencia en medios",
      metaTitle: "Presencia en medios y comentario experto",
      metaDescription:
        "Explora el marco de medios de Taskcover para enlaces de prensa verificados, temas de comentario y estándares de respuesta editorial.",
      eyebrow: "Presencia en medios",
      h1: "Medios, comentario y experiencia en búsqueda.",
      intro:
        "Los enlaces de medios verificados se publican solo cuando existen una fuente real, contexto de publicación, fecha y permiso de divulgación pública.",
    },
    "client-reviews": {
      slug: "client-reviews",
      label: "Reseñas de clientes",
      metaTitle: "Reseñas de clientes verificadas",
      metaDescription:
        "Taskcover publica feedback de clientes solo cuando identidad, permiso, verificación y divulgación cumplen los estándares.",
      eyebrow: "Reseñas de clientes",
      h1: "Feedback verificado, no elogios anónimos.",
      intro:
        "Taskcover no inventa reseñas, iniciales, puntuaciones ni elogios anónimos. El feedback público debe estar autorizado, verificado y ser seguro para divulgación.",
    },
    "video-reviews": {
      slug: "video-reviews",
      label: "Reseñas en video",
      metaTitle: "Reseñas en video verificadas",
      metaDescription:
        "Marco de Taskcover para testimonios en video e historias de clientes aprobadas con identidad, contexto, activos fuente y permiso de publicación verificados.",
      eyebrow: "Reseñas en video",
      h1: "Evidencia en video con contexto.",
      intro:
        "Las historias públicas en video se agregan solo cuando los participantes aprueban su identidad, contexto y texto final publicado.",
    },
    spokesperson: {
      slug: "spokesperson",
      label: "Portavoz",
      metaTitle: "Comentario de portavoz sobre búsqueda e IA",
      metaDescription:
        "Taskcover ofrece comentario experto a nivel agencia sobre búsqueda y visibilidad con IA, con estructura futura para perfiles de portavoz verificados.",
      eyebrow: "Portavoz",
      h1: "Comentario experto para temas de búsqueda e IA.",
      intro:
        "Taskcover ofrece comentario experto a través de un representante aprobado de la agencia según el tema, la disponibilidad y el encaje editorial.",
    },
  },
  brandExperience: {
    nameplatesTitle: "Nombres aprobados",
    nameplatesDisclosure:
      "La experiencia puede incluir trabajo realizado por miembros del equipo o socios de entrega antes o junto con Taskcover. No debe asumirse que cada categoría aplica a cada marca nombrada.",
    sectorMapTitle: "Mapa de sector a capacidad",
    sectorMapDescription:
      "El valor de la exposición previa está en cómo informa el criterio de búsqueda en mercados complejos, no en mostrar un logotipo con énfasis.",
    sectors: [
      { sector: "Viajes y marketplaces", signals: ["demanda multimercado", "escala técnica", "profundidad de contenido"] },
      { sector: "Educación y programas públicos", signals: ["requisitos de confianza", "recorridos localizados", "arquitectura de información"] },
      { sector: "Movilidad y servicios al consumidor", signals: ["intención local", "fricción de conversión", "coordinación de campañas"] },
    ],
    contributionTitle: "Tipos de contribución",
    contributionDescription:
      "Estas áreas describen categorías posibles de experiencia. No son afirmaciones sobre cada organización nombrada.",
    contributions: [
      "Estrategia SEO",
      "Programas de contenido",
      "Revisión técnica",
      "Búsqueda internacional",
      "Campañas digitales",
      "Investigación y reporting",
      "Entrega apoyada por socios",
    ],
    challengesTitle: "Retos de búsqueda encontrados",
    challenges: [
      { label: "Visibilidad internacional", detail: "Equilibrar intención regional, idioma y arquitectura canónica." },
      { label: "Transferencia de autoridad", detail: "Convertir experiencia en sistemas de contenido, calidad de fuentes y activos enlazables." },
      { label: "Priorización técnica", detail: "Separar bloqueos SEO críticos del ruido de plataforma." },
      { label: "Claridad para stakeholders", detail: "Hacer recomendaciones comprensibles para marketing, producto y liderazgo." },
    ],
    methodologyTitle: "Metodología llevada a Taskcover",
    methodologyDescription:
      "La experiencia importa cuando mejora el sistema operativo que los compradores reciben hoy.",
    methodology: [
      { from: "Mercados complejos", to: "Arquitectura de búsqueda", detail: "Segmentar demanda por país, intención, idioma y etapa del comprador." },
      { from: "Grandes superficies de contenido", to: "Sistemas editoriales", detail: "Crear briefs, clusters y controles de calidad que escalen sin perder relevancia." },
      { from: "Entrega de campañas", to: "Disciplina de reporting", detail: "Conectar actividad con decisiones, riesgos, próximos pasos y contexto comercial." },
    ],
    policyTitle: "Política de divulgación y evidencia",
    policy: [
      "Los nombres de marca son contexto de experiencia en texto, salvo que existan activos públicos autorizados.",
      "Los nombres de marca no son fuentes de testimonios.",
      "El contexto de experiencia no implica respaldo actual.",
      "Los detalles públicos se comparten solo cuando la divulgación está permitida.",
    ],
  },
  mediaFeatures: {
    registryTitle: "Registro de medios verificado",
    registryEmpty:
      "Los enlaces de medios verificados se publican aquí cuando la divulgación pública está permitida.",
    topicMapTitle: "Mapa de temas de comentario",
    topicMapDescription:
      "Estos son temas que Taskcover puede evaluar por encaje editorial; no son afirmaciones de cobertura mediática previa.",
    topics: [
      "Cambios en Google Search",
      "Visibilidad en búsqueda con IA",
      "SEO técnico",
      "SEO internacional",
      "SEO multilingüe",
      "Relaciones públicas digitales",
      "Autoridad de contenido",
      "Búsqueda local",
      "Medición de búsqueda",
    ],
    workflowTitle: "Flujo de respuesta editorial",
    workflow: [
      "Consulta recibida",
      "Tema y plazo revisados",
      "Representante asignado",
      "Comentario redactado o entrevista agendada",
      "Fuente y cita aprobadas",
      "Enlace de publicación registrado al salir",
    ],
    standardsTitle: "Estándares de fuente y permiso",
    standards: [
      "No se muestra ningún logotipo de publicación sin activo público verificado.",
      "No se lista ningún enlace de prensa sin URL fuente real.",
      "Fechas, títulos, autores y temas deben coincidir con la fuente.",
      "Correcciones o enlaces vencidos se retiran del render público.",
    ],
    ctaTitle: "Solicitar comentario experto",
    ctaDescription:
      "Para consultas de medios, comparta el tema, fecha límite, formato y si la cita será pública.",
  },
  clientReviews: {
    registryTitle: "Registro público de reseñas",
    registryEmpty:
      "Las reseñas públicas de clientes aparecen solo después de verificar identidad, permiso, texto y divulgación.",
    dimensionsTitle: "Dimensiones de feedback",
    dimensions: [
      { label: "Claridad estratégica", detail: "Si prioridades y tradeoffs son comprensibles." },
      { label: "Comunicación", detail: "Con qué constancia se explican avances, riesgos y próximos pasos." },
      { label: "Priorización", detail: "Si el trabajo se ordena por impacto y factibilidad." },
      { label: "Profundidad técnica", detail: "Qué tan bien las auditorías separan problemas críticos del ruido." },
      { label: "Calidad del reporting", detail: "Si los reportes ayudan a decidir, no a presumir." },
      { label: "Transparencia de ejecución", detail: "Claridad sobre responsabilidades y dependencias." },
      { label: "Alineación de negocio", detail: "Si el trabajo de búsqueda se conecta con ingresos y mercado." },
    ],
    methodTitle: "Método de verificación",
    method: [
      "Confirmar identidad del reseñador y contexto de la organización.",
      "Confirmar permiso para visualización pública.",
      "Aprobar el texto final antes de publicar.",
      "Guardar fuente, estado, texto de divulgación y notas internas por separado.",
    ],
    privatePathTitle: "Ruta de referencia confidencial/privada",
    privatePath: [
      "Calificar el proyecto y la necesidad de referencia.",
      "Revisar restricciones de confidencialidad antes de cualquier presentación.",
      "Confirmar disposición de la referencia y contexto permitido.",
      "Compartir solo la ruta privada aprobada cuando corresponda.",
    ],
    evaluationTitle: "Qué pueden evaluar los clientes",
    evaluation: [
      "Calidad estratégica",
      "Recomendaciones técnicas",
      "Planificación de ejecución",
      "Cadencia de comunicación",
      "Claridad de reporting",
      "Criterio comercial",
    ],
  },
  videoReviews: {
    libraryTitle: "Biblioteca de videos verificada",
    libraryEmpty:
      "Los videos públicos aparecen solo tras aprobación del participante, validación de fuente y permiso de publicación.",
    usefulVideoTitle: "Qué debería cubrir una reseña en video útil",
    usefulVideo: [
      "El contexto del negocio y el reto original.",
      "El alcance del trabajo o colaboración.",
      "Qué cambió en decisiones, visibilidad o ejecución.",
      "Cualquier límite sobre lo que puede divulgarse públicamente.",
    ],
    workflowTitle: "Flujo de permiso e identidad",
    workflow: [
      "Identidad del participante confirmada",
      "Contexto de organización aprobado",
      "Derechos de grabación y miniatura revisados",
      "Texto final revisado",
      "URL de video y fecha de publicación verificadas",
    ],
    privateAvailabilityTitle: "Disponibilidad privada de video/referencia",
    privateAvailability:
      "Algunos materiales de video o referencia pueden seguir siendo privados. Las páginas públicas nunca exponen grabaciones, nombres, miniaturas ni enlaces privados.",
  },
  spokesperson: {
    areasTitle: "Áreas de comentario",
    areas: [
      "Cambios en Google Search",
      "Visibilidad en búsqueda con IA",
      "SEO técnico",
      "SEO internacional",
      "SEO multilingüe",
      "Relaciones públicas digitales",
      "Autoridad de contenido",
      "Búsqueda local",
      "Medición de búsqueda",
    ],
    formatsTitle: "Formatos de entrevista y contribución",
    formats: [
      "Cita escrita de experto",
      "Entrevista",
      "Conversación en podcast",
      "Contribución a webinar",
      "Revisión de artículo",
      "Briefing técnico",
      "Participación en panel",
    ],
    processTitle: "Proceso de respuesta editorial",
    process: [
      "Tema, audiencia y plazo revisados.",
      "Representante de agencia seleccionado por encaje y disponibilidad.",
      "Comentario aprobado preparado con contexto de fuente.",
      "Texto público y atribución revisados antes de uso.",
    ],
    profileTitle: "Área de perfil y verificación de portavoz",
    profileEmpty:
      "Actualmente no hay una identidad de portavoz público verificado publicada. Taskcover ofrece comentario experto mediante un representante aprobado de la agencia según el tema, disponibilidad y encaje editorial.",
    profileFields: [
      "Nombre",
      "Rol",
      "Foto",
      "Biografía",
      "Credenciales verificadas",
      "Temas aprobados",
      "Idiomas disponibles",
      "Enlaces fuente",
      "Estado de permiso público",
    ],
    ctaTitle: "Enviar consulta de medios",
    ctaDescription:
      "Comparta el medio, tema, fecha límite, formato y necesidades de atribución para que Taskcover evalúe el encaje.",
  },
};
