export interface ProjectKTask {
  id: string;
  phase: number;
  phaseTitle: string;
  phaseDescription: string;
  title: string;
  description: string;
  gameNpc: 'Tom Nook' | 'Canela' | 'Tendo y Nendo' | 'Sócrates';
  requirementDetail: string;
  isabelletip?: string;
  pointsContribution?: string;
}

export const PROJECT_K_TASKS: ProjectKTask[] = [
  // FASE 1: Asentamiento y Servicios Básicos
  {
    id: 'pk_tent_debt',
    phase: 1,
    phaseTitle: 'Fase 1: Asentamiento y Servicios Básicos',
    phaseDescription: 'Consolida tu isla pagando la cuota inicial y estableciendo los comercios fundamentales.',
    title: 'Pagar la cuota inicial de la carpa (5,000 Millas Nook)',
    description: 'Cancela tu deuda de viaje con Tom Nook canjeando 5,000 Millas Nook obtenidas con actividades diarias.',
    gameNpc: 'Tom Nook',
    requirementDetail: '5,000 Millas Nook entregadas en la carpa de Gestión Vecinal.',
    pointsContribution: 'Requisito previo obligatorio'
  },
  {
    id: 'pk_first_house',
    phase: 1,
    phaseTitle: 'Fase 1: Asentamiento y Servicios Básicos',
    phaseDescription: 'Consolida tu isla pagando la cuota inicial y estableciendo los comercios fundamentales.',
    title: 'Construir tu primera casa propia',
    description: 'Solicita a Tom Nook construir una casa de madera sólida para reemplazar la tienda de campaña (primera hipoteca de 98,000 bayas).',
    gameNpc: 'Tom Nook',
    requirementDetail: 'Permite acceder al trastero del hogar y habilita nuevas misiones de la isla.',
    pointsContribution: 'Requisito previo obligatorio'
  },
  {
    id: 'pk_nooks_cranny',
    phase: 1,
    phaseTitle: 'Fase 1: Asentamiento y Servicios Básicos',
    phaseDescription: 'Consolida tu isla pagando la cuota inicial y estableciendo los comercios fundamentales.',
    title: 'Construir la tienda MiniNook',
    description: 'Dona a Tendo y Nendo los materiales necesarios para abrir la tienda permanente de la isla.',
    gameNpc: 'Tendo y Nendo',
    requirementDetail: '30 madera normal, 30 madera blanda, 30 madera rígida y 30 pepitas de hierro.',
    pointsContribution: 'Desbloquea compraventa de muebles, semillas de flores y herramientas.'
  },
  {
    id: 'pk_museum',
    phase: 1,
    phaseTitle: 'Fase 1: Asentamiento y Servicios Básicos',
    phaseDescription: 'Consolida tu isla pagando la cuota inicial y estableciendo los comercios fundamentales.',
    title: 'Inaugurar el Museo de Sócrates',
    description: 'Dona 15 criaturas (peces, bichos o fósiles) a Sócrates en su carpa provisional para inaugurar el edificio del Museo.',
    gameNpc: 'Sócrates',
    requirementDetail: '15 especímenes donados y edificio del museo construido.',
    pointsContribution: 'Aumenta notablemente el valor cultural de la isla.'
  },
  {
    id: 'pk_three_plots',
    phase: 1,
    phaseTitle: 'Fase 1: Asentamiento y Servicios Básicos',
    phaseDescription: 'Consolida tu isla pagando la cuota inicial y estableciendo los comercios fundamentales.',
    title: 'Construir el primer puente colgante y preparar 3 parcelas',
    description: 'Tom Nook te entregará el kit de puente y los planos para amueblar los solares 3, 4 y 5 con 3 muebles de interior y 3 de exterior cada uno.',
    gameNpc: 'Tom Nook',
    requirementDetail: '1 puente construido + 3 casas completamente amuebladas para los 3 nuevos residentes.',
    pointsContribution: 'Lleva la población de la isla a 5 aldeanos.'
  },

  // FASE 2: Gestión Vecinal y Población
  {
    id: 'pk_town_hall',
    phase: 2,
    phaseTitle: 'Fase 2: Centro de Gestión Vecinal y Acampada',
    phaseDescription: 'Llega Canela a la isla y Tom Nook lanza oficialmente el "Proyecto K".',
    title: 'Ampliación del Centro de Gestión Vecinal (Llegada de Canela)',
    description: 'Una vez que se mudan los 3 nuevos aldeanos, la carpa se cierra por un día para construir el moderno Ayuntamiento.',
    gameNpc: 'Canela',
    requirementDetail: 'Edificio de Gestión Vecinal inaugurado con mostrador de Canela y Tom Nook.',
    pointsContribution: 'Desbloquea el Proyecto K y las Evaluaciones de la Isla.'
  },
  {
    id: 'pk_project_k_announce',
    phase: 2,
    phaseTitle: 'Fase 2: Centro de Gestión Vecinal y Acampada',
    phaseDescription: 'Llega Canela a la isla y Tom Nook lanza oficialmente el "Proyecto K".',
    title: 'Hablar con Tom Nook sobre el "Proyecto K"',
    description: 'Tom Nook te presentará su sueño: invitar al famoso cantante canino Totakeke (K.K. Slider) a dar un concierto en la plaza.',
    gameNpc: 'Tom Nook',
    requirementDetail: 'Conversar con Tom Nook en el mostrador para activar formalmente la meta.',
    pointsContribution: 'Activación de la meta principal del juego.'
  },
  {
    id: 'pk_campsite',
    phase: 2,
    phaseTitle: 'Fase 2: Centro de Gestión Vecinal y Acampada',
    phaseDescription: 'Llega Canela a la isla y Tom Nook lanza oficialmente el "Proyecto K".',
    title: 'Construir la Zona de Acampada (Campsite)',
    description: 'Coloca la zona de acampada con 15 piezas de cada tipo de madera y 15 pepitas de hierro para atraer viajeros turistas.',
    gameNpc: 'Tom Nook',
    requirementDetail: '15 madera, 15 madera blanda, 15 madera rígida, 15 pepitas de hierro.',
    pointsContribution: 'Permite recibir campistas foráneos.'
  },
  {
    id: 'pk_first_camper',
    phase: 2,
    phaseTitle: 'Fase 2: Centro de Gestión Vecinal y Acampada',
    phaseDescription: 'Llega Canela a la isla y Tom Nook lanza oficialmente el "Proyecto K".',
    title: 'Invitar al primer campista a mudarse (Obligatorio)',
    description: 'El primer visitante de la acampada (siempre de personalidad Esnob) debe ser invitado obligatoriamente a mudarse a tu isla.',
    gameNpc: 'Canela',
    requirementDetail: 'Comprar una parcela de terreno a Tom Nook por 10,000 bayas para ubicar su casa.',
    pointsContribution: 'Sexto aldeano residente en la isla.'
  },
  {
    id: 'pk_expand_residents',
    phase: 2,
    phaseTitle: 'Fase 2: Centro de Gestión Vecinal y Acampada',
    phaseDescription: 'Llega Canela a la isla y Tom Nook lanza oficialmente el "Proyecto K".',
    title: 'Alcanzar al menos 7 u 8 aldeanos residentes',
    description: 'Vende más parcelas con Tom Nook e invita vecinos desde islas desiertas con Cupones Millas Nook.',
    gameNpc: 'Canela',
    requirementDetail: 'El juego requiere un mínimo de 7 aldeanos (se recomiendan 8-10) para tener suficiente puntaje de vida comunitaria.',
    isabelletip: '¡Una isla sin suficientes residentes no transmitirá la calidez que busca Totakeke!',
    pointsContribution: 'Vital para desbloquear la calificación de 3 estrellas.'
  },

  // FASE 3: Embellecimiento y Calificación de 3 Estrellas
  {
    id: 'pk_island_evaluations',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Desbloquear las Evaluaciones Insulares con Canela',
    description: 'Pregunta a Canela por la "Evaluación insular" en el mostrador del ayuntamiento para conocer la puntuación de estrellas.',
    gameNpc: 'Canela',
    requirementDetail: 'Disponible una vez instalado el primer campista.',
    pointsContribution: 'Monitoriza tu progreso de 1 a 5 estrellas en tiempo real.'
  },
  {
    id: 'pk_clean_weeds',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Limpiar maleza y retirar objetos del suelo',
    description: 'Arranca las malas hierbas de toda la isla y asegúrate de no dejar objetos soltados ("Drop") tirados por el suelo.',
    gameNpc: 'Canela',
    requirementDetail: 'Menos de 15 objetos tirados sueltos en el suelo para evitar la penalización por basura.',
    isabelletip: 'Los visitantes opinan que la isla se ve descuidada si hay demasiadas hierbas o cosas tiradas.',
    pointsContribution: 'Evita penalizaciones directas de estrellas.'
  },
  {
    id: 'pk_plant_flowers',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Plantar abundantes flores (mínimo 50 a 100 flores)',
    description: 'Siembra semillas compradas en MiniNook o traídas de islas desiertas. Riega para obtener brotes y flores adultas.',
    gameNpc: 'Canela',
    requirementDetail: 'Al menos 50 flores completamente florecidas suman 1 punto de Naturaleza por flor.',
    isabelletip: '¡Las flores llenan de color y alegría los paisajes de nuestra isla!',
    pointsContribution: '+50 a +100 puntos en el baremo de Naturaleza.'
  },
  {
    id: 'pk_plant_trees',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Equilibrar árboles (mantener entre 110 y 200 árboles)',
    description: 'Mantén una buena cantidad de árboles frutales, robles y cedros. ¡Ojo! No sobrepases los 220 árboles o Canela avisará que hay "demasiado follaje".',
    gameNpc: 'Canela',
    requirementDetail: '110 a 200 árboles adultos otorgan el puntaje óptimo de sombra y verdor.',
    isabelletip: 'Nuestra vegetación es hermosa, pero no debemos descuidar la visibilidad de los caminos.',
    pointsContribution: '+100 a +150 puntos de Naturaleza.'
  },
  {
    id: 'pk_fences',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Colocar cercas / vallas decorativas (mínimo 50 vallas)',
    description: 'Crea vallas de madera, piedra, hierro o bambú y colócalas delimitando jardines, plazas y viviendas.',
    gameNpc: 'Canela',
    requirementDetail: 'Al menos 50 piezas de cerca colocadas otorgan +10 puntos de Desarrollo.',
    isabelletip: 'Delimitar los terrenos con vallas aporta armonía y estructura a los barrios.',
    pointsContribution: '+10 a +20 puntos en el baremo de Desarrollo.'
  },
  {
    id: 'pk_outdoor_furniture',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Decorar con muebles de exterior (mínimo 20 a 30 muebles)',
    description: 'Coloca muebles de bricolaje (DIY) y muebles comprados con Millas Nook (farolas, bancos, fuentes, juegos infantiles) repartidos por la isla.',
    gameNpc: 'Canela',
    requirementDetail: 'Los muebles de bricolaje y de Millas otorgan un bono especial de desarrollo insular.',
    isabelletip: '¡A los visitantes les encanta ver zonas de descanso al aire libre creadas por los residentes!',
    pointsContribution: '+50 a +100 puntos de Desarrollo.'
  },
  {
    id: 'pk_bridges_inclines',
    phase: 3,
    phaseTitle: 'Fase 3: Embellecimiento y Calificación de 3 Estrellas (★★★)',
    phaseDescription: 'Consulta a Canela periódicamente y cumple los umbrales de Naturaleza y Desarrollo.',
    title: 'Construir infraestructuras (al menos 1-2 puentes y rampas adicionales)',
    description: 'Habla con Tom Nook sobre "Infraestructura" y financia la construcción de puentes sobre ríos y rampas hacia acantilados.',
    gameNpc: 'Tom Nook',
    requirementDetail: 'Cada puente y rampa construido suma +15 puntos de Desarrollo.',
    pointsContribution: '+30 a +45 puntos de Desarrollo.'
  },

  // FASE 4: El Concierto y Desbloqueos
  {
    id: 'pk_reach_three_stars',
    phase: 4,
    phaseTitle: 'Fase 4: El Gran Concierto y Desbloqueo de Obras Públicas',
    phaseDescription: 'La recompensa final por completar el Proyecto K.',
    title: 'Obtener la Calificación de 3 Estrellas (★★★)',
    description: 'Habla con Canela. Si has cumplido los umbrales, leerá una reseña de 5 estrellas firmada anónimamente por "K."',
    gameNpc: 'Canela',
    requirementDetail: 'Umbral oficial: al menos 160 puntos de Desarrollo y 270 puntos de Naturaleza.',
    isabelletip: '¡Canela se sorprenderá al leer la carta de K. alabando la belleza de tu isla!',
    pointsContribution: 'Desbloqueo inmediato del evento de Totakeke.'
  },
  {
    id: 'pk_tom_nook_call',
    phase: 4,
    phaseTitle: 'Fase 4: El Gran Concierto y Desbloqueo de Obras Públicas',
    phaseDescription: 'La recompensa final por completar el Proyecto K.',
    title: 'Tom Nook contacta a Totakeke en vivo',
    description: 'Tom Nook interrumpe emocionado la conversación y realiza una llamada telefónica a Totakeke para invitarlo formalmente a la isla.',
    gameNpc: 'Tom Nook',
    requirementDetail: 'Totakeke acepta encantado la invitación de Tom Nook.',
    pointsContribution: 'Fijación de la fecha del concierto.'
  },
  {
    id: 'pk_concert_credits',
    phase: 4,
    phaseTitle: 'Fase 4: El Gran Concierto y Desbloqueo de Obras Públicas',
    phaseDescription: 'La recompensa final por completar el Proyecto K.',
    title: 'Celebrar el Concierto de K.K. Slider y rodar los créditos',
    description: 'A la mañana siguiente, todos los aldeanos se reúnen en la plaza. Totakeke interpreta en directo "Welcome Horizons" ("Nuevos Horizontes").',
    gameNpc: 'Canela',
    requirementDetail: 'Asistir al concierto inaugural frente al Centro de Gestión Vecinal.',
    pointsContribution: 'Final de la historia principal del juego.'
  },
  {
    id: 'pk_island_designer_app',
    phase: 4,
    phaseTitle: 'Fase 4: El Gran Concierto y Desbloqueo de Obras Públicas',
    phaseDescription: 'La recompensa final por completar el Proyecto K.',
    title: '¡Desbloquear la App Obras Públicas (Island Designer)!',
    description: 'Al terminar los créditos, Tom Nook te entrega la aplicación de terraformación para crear ríos, modificar acantilados y colocar caminos de piedra, madera y ladrillo.',
    gameNpc: 'Tom Nook',
    requirementDetail: 'Disponible inmediatamente después del concierto en tu NookPhone.',
    pointsContribution: '¡Libertad total de diseño insular y conciertos todos los sábados a las 18:00 hrs!'
  }
];

export const PROJECT_K_STORAGE_KEY = 'acnh_hub_project_k_tasks';

export function getStoredProjectKTasks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PROJECT_K_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredProjectKTasks(completedTaskIds: string[]) {
  try {
    localStorage.setItem(PROJECT_K_STORAGE_KEY, JSON.stringify(completedTaskIds));
  } catch {}
}
