import { SpecialEvent } from '../types';

export const SPECIAL_VISITORS = [
  {
    id: 'daisy_mae',
    name: 'Juliana (Daisy Mae)',
    schedule: 'Domingos de 5:00 a 12:00 del mediodía',
    purpose: 'Venta de nabos para el mercado especulativo de la bolsa de nabos de Tendo y Nendo.',
    tip: '¡Recuerda vender tus nabos antes del siguiente domingo a las 5:00 o se pudrirán!',
    icon: 'turnip'
  },
  {
    id: 'kk_slider',
    name: 'Totakeke (K.K. Slider)',
    schedule: 'Sábados a partir de las 18:00 (Plaza del Ayuntamiento)',
    purpose: 'Ofrece conciertos acústicos en vivo y regala la primera canción que le pidas directamente a tu inventario.',
    tip: 'Escribe el nombre exacto de canciones secretas como "Tota-Amor" o "Tota-Alcazaba" para desbloquearlas.',
    icon: 'music'
  },
  {
    id: 'redd',
    name: 'Ladino (Jolly Redd)',
    schedule: 'Días laborables aleatorios (Barco en la playa secreta norte)',
    purpose: 'Vende cuadros y estatuas (¡cuidado con las falsificaciones de Ladino!) y 2 muebles exclusivos.',
    tip: 'Revisa minuciosamente nuestra guía de arte en la app para nunca comprar una falsificación.',
    icon: 'ship'
  },
  {
    id: 'flick',
    name: 'Kamilo (Flick)',
    schedule: 'Días laborables aleatorios (de 5:00 a 5:00)',
    purpose: 'Compra todos los bichos a un 150% de su precio normal en Mini Nook y encarga maquetas si le llevas 3 del mismo espécimen.',
    tip: 'Guarda tarántulas, escorpiones y mariposas emperador en tu trastero hasta que aparezca.',
    icon: 'bug'
  },
  {
    id: 'cj',
    name: 'CJ',
    schedule: 'Días laborables aleatorios (Cerca de ríos o playas)',
    purpose: 'Tras superar su breve desafío de pesca, compra peces con un multiplicador x1.5 y crea maquetas de peces con 3 ejemplares.',
    tip: 'Acumula peces caros como celacantos, truchas doradas y tiburones para ganar cientos de miles de bayas.',
    icon: 'fish'
  },
  {
    id: 'celeste',
    name: 'Estela (Celeste)',
    schedule: 'Noches despejadas con lluvia de estrellas (19:00 a 4:00)',
    purpose: 'Te entrega proyectos DIY astronómicos, varitas mágicas y recetas temáticas de constelaciones del zodiaco.',
    tip: 'Pide deseos mirando al cielo sin herramientas equipadas al presionar \'A\' cuando caiga una estrella.',
    icon: 'star'
  },
  {
    id: 'gulliver',
    name: 'Gulliver / Gullivarrr',
    schedule: 'Días laborables aleatorios en la costa de arena',
    purpose: 'Despiértalo hablándole varias veces; busca las 5 piezas del comunicador enterradas (o bucea para su teléfono pirata) y recibirás tesoros exóticos al día siguiente.',
    tip: 'Al día siguiente revisa también el cajón de reciclaje del ayuntamiento: ¡habrá piezas oxidadas para el robot gigante!',
    icon: 'anchor'
  },
  {
    id: 'leif',
    name: 'Gandulio (Leif)',
    schedule: 'Días laborables en la plaza del ayuntamiento',
    purpose: 'Vende brotes de arbustos de temporada, semillas de flores que no venden los mapaches y compra malas hierbas al doble de precio.',
    tip: 'Plantar arbustos de temporada asegura que florezcan justo en el mes actual.',
    icon: 'leaf'
  },
  {
    id: 'saharah',
    name: 'Alcatifa (Saharah)',
    schedule: 'Días laborables paseando por la isla',
    purpose: 'Vende alfombras de tamaños pequeño, mediano y grande, además de papeles de pared y suelos con animación misteriosa.',
    tip: 'Canjea 5 cupones de alfombra para obtener un misterio extra sin gastar bayas.',
    icon: 'carpet'
  }
];

export const CALENDAR_EVENTS: SpecialEvent[] = [
  {
    id: 'fishing_tourney',
    title: 'Torneo de Pesca de CJ',
    character: 'CJ',
    schedule: '2º sábado de Enero, Abril, Julio y Octubre',
    description: 'Compite atrapando tantos peces como puedas en 3 minutos. Acumula puntos para canjear por trofeos de oro, plata o bronce y muebles exclusivos.',
    isSeasonal: true,
    category: 'torneo'
  },
  {
    id: 'bug_off',
    title: 'Caza de Bichos de Kamilo',
    character: 'Kamilo',
    schedule: '4º sábado de Junio, Julio, Agosto y Septiembre',
    description: 'Captura bichos a contrarreloj en 3 minutos. Cada bicho suma puntos canjeables por artículos exclusivos de artesanía de insectos.',
    isSeasonal: true,
    category: 'torneo'
  },
  {
    id: 'cherry_blossom',
    title: 'Temporada de Cerezos en Flor',
    character: 'Todos los vecinos',
    schedule: '1 al 10 de Abril (Norte) / 1 al 10 de Octubre (Sur)',
    description: 'Los árboles no frutales se vuelven de un vibrante tono rosa. Atrapa pétalos de cerezo con la red para elaborar las codiciadas recetas de Sakura.',
    month: 4,
    day: 1,
    isSeasonal: true,
    category: 'temporada'
  },
  {
    id: 'fireworks',
    title: 'Festival de Fuegos Artificiales',
    character: 'Ladino y Canela',
    schedule: 'Todos los domingos de Agosto (19:00 a 24:00)',
    description: 'Espectáculo pirotécnico en el cielo nocturno con diseños personalizados. Ladino vende boletos de tómbola con chucherías, matasuegras y globos.',
    month: 8,
    day: 1,
    isSeasonal: true,
    category: 'festivo'
  },
  {
    id: 'halloween',
    title: 'Noche de Halloween con Soponcio',
    character: 'Soponcio (Jack)',
    schedule: '31 de Octubre (a partir de las 17:00)',
    description: 'Disfraza a tu personaje, reparte chuches a tus vecinos para evitar que te gasten bromas y entrega piruletas a Soponcio para obtener el set calabaza.',
    month: 10,
    day: 31,
    isSeasonal: true,
    category: 'festivo'
  },
  {
    id: 'mush_season',
    title: 'Temporada de Setas y Hojas de Otoño',
    character: 'Naturaleza',
    schedule: 'Mes de Noviembre (Norte) / Mes de Mayo (Sur)',
    description: 'Aparecen 5 tipos de setas cerca de los árboles para fabricar muebles de bosque mágico. Las hojas de arce caen para cazarlas con red.',
    month: 11,
    day: 1,
    isSeasonal: true,
    category: 'temporada'
  },
  {
    id: 'turkey_day',
    title: 'Día del Pavo (Banquete de Guindo)',
    character: 'Guindo (Franklin)',
    schedule: 'Cuarto jueves de Noviembre',
    description: 'Ayuda al chef Guindo reuniendo ingredientes secretos como calabazas, almejas y peces específicos para preparar 4 platos gourmet para la plaza.',
    month: 11,
    day: 26,
    isSeasonal: true,
    category: 'festivo'
  },
  {
    id: 'toy_day',
    title: 'Día del Juguete con Renato',
    character: 'Renato (Jingle)',
    schedule: '24 de Diciembre (Nochebuena)',
    description: 'Ponte el traje de Santa Claus y ayuda al reno Renato a repartir los sacos de regalos que tus vecinos te han estado pidiendo en secreto.',
    month: 12,
    day: 24,
    isSeasonal: true,
    category: 'festivo'
  },
  {
    id: 'new_year',
    title: 'Gran Fiesta de Nochevieja y Fin de Año',
    character: 'Tom Nook y Canela',
    schedule: '31 de Diciembre a las 23:00 con cuenta atrás',
    description: 'La plaza se ilumina con un reloj gigante, luces de neón y reparto de gorros de fiesta luminosos y sidra espumosa.',
    month: 12,
    day: 31,
    isSeasonal: true,
    category: 'festivo'
  }
];

export const DAILY_TASKS_DEFAULTS = [
  { id: 'fossils', label: 'Desenterrar y evaluar 4 fósiles con Sócrates', done: false, icon: 'shovel' },
  { id: 'bottle', label: 'Recoger la botella con mensaje y receta en la orilla', done: false, icon: 'message-square' },
  { id: 'money_tree', label: 'Desenterrar bolsa dorada y plantar 10,000 bayas para el árbol de dinero', done: false, icon: 'coins' },
  { id: 'rocks', label: 'Golpear las 6 rocas de la isla (hasta 8 recursos cada una)', done: false, icon: 'hammer' },
  { id: 'crafting', label: 'Visitar vecinos en su casa (3 turnos al día para recetas de bricolaje)', done: false, icon: 'home' },
  { id: 'nook_mile', label: 'Iniciar sesión en la terminal del Nook Stop para la racha de Millas Nook', done: false, icon: 'award' },
  { id: 'coffee', label: 'Tomar una taza de café en El Alpiste con Fígaro', done: false, icon: 'coffee' },
  { id: 'talk_residents', label: 'Hablar con tus 10 vecinos para subir amistad', done: false, icon: 'heart' }
];
