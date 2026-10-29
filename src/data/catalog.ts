import { ArtWork, FurnitureItem } from '../types';

export const ARTWORKS_DATA: ArtWork[] = [
  {
    id: 'famous_painting',
    nameSpanish: 'Cuadro detallado',
    realName: 'Mona Lisa (La Gioconda)',
    author: 'Leonardo da Vinci',
    fakeTell: 'En la falsificación, las cejas de la Gioconda están claramente arqueadas hacia arriba en un gesto de ceño fruncido o sorprendido. En el cuadro auténtico, casi no tiene cejas visibles.',
    hasFake: true
  },
  {
    id: 'serene_painting',
    nameSpanish: 'Cuadro apacible',
    realName: 'La dama del armiño',
    author: 'Leonardo da Vinci',
    fakeTell: 'En la falsificación, el armiño que sostiene en brazos es de pelaje gris oscuro o azulado con manchas. En el auténtico, el armiño es de color blanco inmaculado.',
    hasFake: true
  },
  {
    id: 'wistful_painting',
    nameSpanish: 'Cuadro holandés',
    realName: 'La joven de la perla',
    author: 'Johannes Vermeer',
    fakeTell: 'En la falsificación, el pendiente que lleva la joven es una estrella en lugar de una perla esférica (o tiene los ojos cerrados en algunas versiones). En el auténtico, lleva un pendiente de perla redondo.',
    hasFake: true
  },
  {
    id: 'quaint_painting',
    nameSpanish: 'Cuadro clásico',
    realName: 'La lechera',
    author: 'Johannes Vermeer',
    fakeTell: 'En la falsificación, cae un chorro de leche muy grueso y abundante de la jarra. En el original auténtico, el chorro de leche es un hilo fino y delicado.',
    hasFake: true
  },
  {
    id: 'dynamic_painting',
    nameSpanish: 'Cuadro ola',
    realName: 'La gran ola de Kanagawa',
    author: 'Katsushika Hokusai',
    fakeTell: '¡Siempre es auténtico! Este cuadro nunca tiene falsificación en la tienda de Ladino.',
    hasFake: false
  },
  {
    id: 'calm_painting',
    nameSpanish: 'Cuadro bucólico',
    realName: 'Tarde de domingo en la isla de la Grande Jatte',
    author: 'Georges Seurat',
    fakeTell: '¡Siempre es auténtico! No existe falsificación en Animal Crossing: New Horizons.',
    hasFake: false
  },
  {
    id: 'scary_painting',
    nameSpanish: 'Cuadro sobrecogedor',
    realName: 'Otani Oniji III como el sirviente Edobei',
    author: 'Toshusai Sharaku',
    fakeTell: 'En la falsificación, las cejas apuntan hacia abajo en un gesto triste o preocupado. En el auténtico, las cejas son puntiagudas y arqueadas en una expresión amenazante.',
    hasFake: true
  },
  {
    id: 'gallant_statue',
    nameSpanish: 'Estatua triunfante',
    realName: 'David',
    author: 'Miguel Ángel',
    fakeTell: 'En la falsificación, David sostiene un libro bajo el brazo derecho. En la estatua auténtica, no lleva ningún libro.',
    hasFake: true
  },
  {
    id: 'robust_statue',
    nameSpanish: 'Estatua atlética',
    realName: 'El Discóbolo',
    author: 'Mirón',
    fakeTell: 'En la falsificación, el lanzador de disco lleva un reloj de pulsera moderno en su muñeca derecha. En la auténtica, no tiene reloj.',
    hasFake: true
  },
  {
    id: 'valiant_statue',
    nameSpanish: 'Estatua alada',
    realName: 'Victoria alada de Samotracia',
    author: 'Desconocido',
    fakeTell: 'En la falsificación, la pierna izquierda está adelantada en lugar de la pierna derecha. En la auténtica, es la pierna derecha la que da el paso.',
    hasFake: true
  },
  {
    id: 'ancient_statue',
    nameSpanish: 'Estatua primitiva',
    realName: 'Dogū del periodo Jōmon',
    author: 'Desconocido',
    fakeTell: 'En la falsificación, tiene antenas saliendo de los lados de su cabeza y de noche emite una luz azul extraterrestre flotando al interactuar. La auténtica no tiene antenas.',
    hasFake: true
  }
];

export const FURNITURE_HIGHLIGHTS: FurnitureItem[] = [
  { id: 'ironwood_kitchenette', name: 'Cocina de madera de hierro', series: 'Madera de hierro', category: 'Cocina', price: 12000, diy: true, materials: '4 Madera, 3 Pepitas de hierro, 1 Fregadero de madera de hierro, 1 Tabla de cortar' },
  { id: 'ironwood_dresser', name: 'Cómoda de madera de hierro', series: 'Madera de hierro', category: 'Almacenamiento', price: 8400, diy: true, materials: '7 Madera, 4 Pepitas de hierro' },
  { id: 'cherry_blossom_bonsai', name: 'Bonsái de cerezo en flor', series: 'Cerezo en flor', category: 'Decoración', price: 9500, diy: true, materials: '6 Pétalos de cerezo, 2 Madera dura, 3 Malas hierbas, 3 Arcilla' },
  { id: 'bamboo_partition', name: 'Biógrafo de bambú', series: 'Bambú', category: 'Separador', price: 3200, diy: true, materials: '7 Bambú, 6 Piedras' },
  { id: 'crescent_moon_chair', name: 'Silla luna creciente', series: 'Celeste / Espacial', category: 'Asientos', price: 24000, diy: true, materials: '7 Fragmentos de estrella, 1 Fragmento gigante' },
  { id: 'nova_light', name: 'Lámpara nova', series: 'Celeste / Espacial', category: 'Iluminación', price: 16000, diy: true, materials: '5 Fragmentos de estrella' },
  { id: 'antique_bed', name: 'Cama antigua de caoba', series: 'Antigua / Rococó', category: 'Camas', price: 28000, diy: false },
  { id: 'antique_wardrobe', name: 'Armario antiguo de caoba', series: 'Antigua / Rococó', category: 'Armarios', price: 37000, diy: false },
  { id: 'imperial_dining_table', name: 'Mesa de comedor imperial', series: 'Imperial', category: 'Mesas', price: 73000, diy: false },
  { id: 'mermaid_bed', name: 'Cama de sirena', series: 'Sirena (Pascal)', category: 'Camas', price: 18000, diy: true, materials: '2 Perlas, 2 Conchas gigantes, 5 Arena' },
  { id: 'rattan_armchair', name: 'Sillón de ratán', series: 'Ratán', category: 'Asientos', price: 3200, diy: false },
  { id: 'spooky_tower', name: 'Torre de calabazas de Halloween', series: 'Halloween (Soponcio)', category: 'Exterior', price: 4500, diy: true, materials: '3 Calabazas naranjas, 3 Maderas' }
];

export const KK_SONGS = [
  { id: 'kk_bubblegum', title: 'Tota-Bubblegum', mood: 'Alegre / Pegadiza', isSecret: false, description: 'El éxito de pop más icónico de la saga, cantado por Chrissy y Francine.' },
  { id: 'kk_cruisin', title: 'Tota-Cruisin', mood: 'Relajante / R&B nocturno', isSecret: false, description: 'Ritmo suave de hip hop lounge con bajo marcado, ideal para salas de estar modernas.' },
  { id: 'kk_drivin', title: 'Tota-Drivin\'', mood: 'Secreta / Enérgica', isSecret: true, description: 'Canción secreta. Debes pedirle a Totakeke escribiendo exactamente "Tota-Drivin\'".' },
  { id: 'kk_animal_city', title: 'Tota-Animal City', mood: 'Secreta / Nostálgica', isSecret: true, description: 'Homenaje a Animal Crossing: Let\'s Go to the City. Canción secreta pedida por nombre.' },
  { id: 'kk_farewell', title: 'Tota-Despedida', mood: 'Secreta / Melancólica', isSecret: true, description: 'Canción secreta acústica de despedida que conmueve a todos los aldeanos.' },
  { id: 'kk_disco', title: 'Tota-Disco', mood: 'Festiva / Baile', isSecret: false, description: 'Música funky retro de pista de baile de los años 70.' },
  { id: 'kk_synth', title: 'Tota-Sintetizador', mood: 'Electrónica / Chill', isSecret: false, description: 'Melodía espacial con sintetizadores retro-futuristas.' }
];
