import fs from 'fs';

async function generateVillagers() {
  console.log('Fetching official ACNH canonical villagers dataset...');
  const res = await fetch('https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/data/Villagers.json');
  const rawList = await res.json();

  const speciesMap = {
    'Alligator': 'Cocodrilo',
    'Anteater': 'Oso hormiguero',
    'Bear': 'Oso',
    'Bird': 'Pájaro',
    'Bull': 'Toro',
    'Cat': 'Gato',
    'Chicken': 'Pollo',
    'Cow': 'Vaca',
    'Cub': 'Osito',
    'Deer': 'Ciervo',
    'Dog': 'Perro',
    'Duck': 'Pato',
    'Eagle': 'Águila',
    'Elephant': 'Elefante',
    'Frog': 'Rana',
    'Goat': 'Cabra',
    'Gorilla': 'Gorila',
    'Hamster': 'Hámster',
    'Hippo': 'Hipopótamo',
    'Horse': 'Caballo',
    'Kangaroo': 'Canguro',
    'Koala': 'Koala',
    'Lion': 'León',
    'Monkey': 'Mono',
    'Mouse': 'Ratón',
    'Octopus': 'Pulpo',
    'Ostrich': 'Avestruz',
    'Penguin': 'Pingüino',
    'Pig': 'Cerdo',
    'Rabbit': 'Conejo',
    'Rhino': 'Rinoceronte',
    'Sheep': 'Oveja',
    'Squirrel': 'Ardilla',
    'Tiger': 'Tigre',
    'Wolf': 'Lobo'
  };

  const personalityMap = {
    'Lazy': 'Perezoso',
    'Jock': 'Atlético',
    'Cranky': 'Gruñón',
    'Smug': 'Esnob',
    'Normal': 'Normal',
    'Peppy': 'Alegre',
    'Snooty': 'Altanera',
    'Sisterly': 'Dulce/Uchi',
    'Big sister': 'Dulce/Uchi',
    'Uchi': 'Dulce/Uchi'
  };

  const hobbyMap = {
    'Nature': 'Naturaleza',
    'Play': 'Juego',
    'Music': 'Música',
    'Fashion': 'Moda',
    'Education': 'Educación',
    'Fitness': 'Fitness'
  };

  const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function getZodiac(m, d) {
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Aries';
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Tauro';
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Géminis';
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Cáncer';
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Leo';
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Virgo';
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Libra';
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Escorpio';
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'Sagitario';
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Capricornio';
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Acuario';
    return 'Piscis';
  }

  const colorMap = {
    'Aqua': 'Celeste', 'Beige': 'Beige', 'Black': 'Negro', 'Blue': 'Azul',
    'Brown': 'Marrón', 'Colorful': 'Colorido', 'Gray': 'Gris', 'Green': 'Verde',
    'Orange': 'Naranja', 'Pink': 'Rosa', 'Purple': 'Morado', 'Red': 'Rojo',
    'White': 'Blanco', 'Yellow': 'Amarillo'
  };

  const styleMap = {
    'Active': 'Activo', 'Cool': 'Genial', 'Cute': 'Lindo',
    'Elegant': 'Elegante', 'Gorgeous': 'Llamativo', 'Simple': 'Sencillo'
  };

  const defaultCoffeeBeans = ['Kilimanjaro', 'Blue Mountain', 'Mocha', 'Blend'];
  const defaultCoffeeMilk = ['Sin leche', 'Poco de leche', 'Normal', 'Mucha leche'];
  const defaultCoffeeSugar = ['Sin azúcar', '1 azúcar', '2 azúcares', '3 azúcares'];

  const processed = rawList.map((item) => {
    const bParts = (item.birthday || '1/1').split('/').map(Number);
    const m = bParts[0] || 1;
    const d = bParts[1] || 1;

    const spanishName = item.translations?.eUes || item.translations?.uSes || item.name;
    const spanishCatchphrase = item.catchphrases?.eUes || item.catchphrases?.uSes || item.catchphrase || 'hola';

    const p = item.personality === 'Big sister' || item.personality === 'Uchi' ? 'Sisterly' : item.personality;
    const pSpanish = personalityMap[p] || 'Normal';

    const sp = item.species || 'Cat';
    const spSpanish = speciesMap[sp] || sp;

    const colors = (item.colors || []).map((c) => colorMap[c] || c);
    const styles = (item.styles || []).map((s) => styleMap[s] || s);

    // Roost coffee
    const hash = item.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const coffeeBean = defaultCoffeeBeans[hash % defaultCoffeeBeans.length];
    const coffeeMilk = defaultCoffeeMilk[(hash >> 2) % defaultCoffeeMilk.length];
    const coffeeSugar = defaultCoffeeSugar[(hash >> 4) % defaultCoffeeSugar.length];

    // Official Nintendo ACNH icon
    const iconUrl = item.iconImage || `https://acnhcdn.com/latest/NpcIcon/${item.filename}.png`;

    return {
      id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: item.name,
      nameSpanish: spanishName,
      species: sp,
      speciesSpanish: spSpanish,
      gender: item.gender === 'Female' ? 'Hembra' : 'Macho',
      personality: p,
      personalitySpanish: pSpanish,
      birthday: {
        month: m,
        day: d,
        display: `${d} de ${monthNames[m]}`
      },
      zodiac: getZodiac(m, d),
      catchphrase: item.catchphrase || '',
      catchphraseSpanish: spanishCatchphrase,
      hobby: hobbyMap[item.hobby] || 'Juego',
      favoriteColors: colors.length > 0 ? colors : ['Colorido', 'Blanco'],
      favoriteStyles: styles.length > 0 ? styles : ['Sencillo', 'Lindo'],
      coffee: {
        beans: coffeeBean,
        milk: coffeeMilk,
        sugar: coffeeSugar
      },
      quote: item.favoriteSaying || 'Life is sweet.',
      quoteSpanish: item.favoriteSaying || 'La vida es bella.',
      avatarColor: item.bubbleColor || '#489D6C',
      imageUrl: iconUrl
    };
  });

  const specialNPCs = [
    {
      id: 'tom_nook',
      name: 'Tom Nook',
      nameSpanish: 'Tom Nook',
      species: 'Special',
      speciesSpanish: 'Tanuki',
      gender: 'Macho',
      personality: 'Cranky',
      personalitySpanish: 'Normal',
      birthday: { month: 5, day: 30, display: '30 de Mayo' },
      zodiac: 'Géminis',
      catchphrase: 'yes, yes',
      catchphraseSpanish: 'sí, sí',
      hobby: 'Educación',
      favoriteColors: ['Verde', 'Marrón'],
      favoriteStyles: ['Formal', 'Elegante'],
      coffee: { beans: 'Kilimanjaro', milk: 'Mucha leche', sugar: '1 azúcar' },
      quote: 'Real estate is the foundation of every thriving island paradise.',
      quoteSpanish: 'Los bienes raíces son los cimientos de cualquier paraíso insular.',
      avatarColor: '#7B341E',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/tan00.png',
      isSpecial: true
    },
    {
      id: 'isabelle',
      name: 'Isabelle',
      nameSpanish: 'Canela',
      species: 'Special',
      speciesSpanish: 'Perro (Shih Tzu)',
      gender: 'Hembra',
      personality: 'Normal',
      personalitySpanish: 'Normal',
      birthday: { month: 12, day: 20, display: '20 de Diciembre' },
      zodiac: 'Sagitario',
      catchphrase: 'such is life',
      catchphraseSpanish: '¡viva la isla!',
      hobby: 'Música',
      favoriteColors: ['Amarillo', 'Verde'],
      favoriteStyles: ['Sencillo', 'Llamativo'],
      coffee: { beans: 'Mocha', milk: 'Mucha leche', sugar: '3 azúcares' },
      quote: 'Good morning everyone! Remember to hydrate and water the flowers!',
      quoteSpanish: '¡Buenos días a todos! ¡Recuerden hidratarse y regar las flores!',
      avatarColor: '#ECC94B',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/szo00.png',
      isSpecial: true
    },
    {
      id: 'kk_slider',
      name: 'K.K. Slider',
      nameSpanish: 'Totakeke',
      species: 'Special',
      speciesSpanish: 'Perro',
      gender: 'Macho',
      personality: 'Smug',
      personalitySpanish: 'Esnob',
      birthday: { month: 8, day: 23, display: '23 de Agosto' },
      zodiac: 'Virgo',
      catchphrase: 'que pasa',
      catchphraseSpanish: 'guau',
      hobby: 'Música',
      favoriteColors: ['Blanco', 'Negro'],
      favoriteStyles: ['Sencillo', 'Elegante'],
      coffee: { beans: 'Blue Mountain', milk: 'Sin leche', sugar: 'Sin azúcar' },
      quote: 'Music should be free, like the breeze through the palm trees.',
      quoteSpanish: 'La música debería ser libre, como la brisa entre las palmeras.',
      avatarColor: '#CBD5E0',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/tkk00.png',
      isSpecial: true
    },
    {
      id: 'blathers',
      name: 'Blathers',
      nameSpanish: 'Sócrates',
      species: 'Special',
      speciesSpanish: 'Búho',
      gender: 'Macho',
      personality: 'Cranky',
      personalitySpanish: 'Normal',
      birthday: { month: 9, day: 24, display: '24 de Septiembre' },
      zodiac: 'Libra',
      catchphrase: 'who',
      catchphraseSpanish: 'hoo',
      hobby: 'Educación',
      favoriteColors: ['Marrón', 'Verde'],
      favoriteStyles: ['Elegante', 'Formal'],
      coffee: { beans: 'Blend', milk: 'Sin leche', sugar: 'Sin azúcar' },
      quote: 'A magnificent specimen! Although... bugs still make my feathers stand.',
      quoteSpanish: '¡Un espécimen colosal! Aunque... los bichos aún me erizan el plumaje.',
      avatarColor: '#744210',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/owl00.png',
      isSpecial: true
    },
    {
      id: 'celeste',
      name: 'Celeste',
      nameSpanish: 'Estela',
      species: 'Special',
      speciesSpanish: 'Búho',
      gender: 'Hembra',
      personality: 'Normal',
      personalitySpanish: 'Normal',
      birthday: { month: 9, day: 7, display: '7 de Septiembre' },
      zodiac: 'Virgo',
      catchphrase: 'hoot',
      catchphraseSpanish: 'estrellas',
      hobby: 'Educación',
      favoriteColors: ['Rosa', 'Rojo'],
      favoriteStyles: ['Elegante', 'Llamativo'],
      coffee: { beans: 'Blue Mountain', milk: 'Normal', sugar: '2 azúcares' },
      quote: 'Every shooting star carries a wish across the universe.',
      quoteSpanish: 'Cada estrella fugaz transporta un deseo a través del universo.',
      avatarColor: '#9B2C2C',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/owl01.png',
      isSpecial: true
    },
    {
      id: 'brewster',
      name: 'Brewster',
      nameSpanish: 'Fígaro',
      species: 'Special',
      speciesSpanish: 'Palomo',
      gender: 'Macho',
      personality: 'Cranky',
      personalitySpanish: 'Normal',
      birthday: { month: 10, day: 15, display: '15 de Octubre' },
      zodiac: 'Libra',
      catchphrase: 'coo',
      catchphraseSpanish: 'cu-rru',
      hobby: 'Educación',
      favoriteColors: ['Verde', 'Marrón'],
      favoriteStyles: ['Elegante', 'Formal'],
      coffee: { beans: 'Blend', milk: 'Poco de leche de paloma', sugar: 'Sin azúcar' },
      quote: 'Coo... Perfect temperature: 80 degrees. Sip it while it\'s warm.',
      quoteSpanish: 'Cu-rru... Temperatura perfecta: 80 grados. Disfrútalo bien caliente.',
      avatarColor: '#276749',
      imageUrl: 'https://acnhcdn.com/latest/NpcIcon/pkn00.png',
      isSpecial: true
    }
  ];

  const all = [...processed, ...specialNPCs];

  fs.writeFileSync('src/data/all_villagers.json', JSON.stringify(all, null, 2));
  console.log(`COMPLETED: Exported ${all.length} canonical villagers and special characters!`);
}

generateVillagers().catch(console.error);
