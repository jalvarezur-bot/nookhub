export type Personality = 
  | 'Lazy' 
  | 'Jock' 
  | 'Cranky' 
  | 'Smug' 
  | 'Normal' 
  | 'Peppy' 
  | 'Snooty' 
  | 'Sisterly';

export type PersonalitySpanish = 
  | 'Perezoso' 
  | 'Atlético' 
  | 'Gruñón' 
  | 'Esnob' 
  | 'Normal' 
  | 'Alegre' 
  | 'Altanera' 
  | 'Dulce/Uchi';

export type Species = 
  | 'Cat' | 'Dog' | 'Wolf' | 'Rabbit' | 'Squirrel' | 'Deer' | 'Duck' | 'Cub' 
  | 'Bear' | 'Frog' | 'Octopus' | 'Horse' | 'Koala' | 'Eagle' | 'Penguin' 
  | 'Hamster' | 'Mouse' | 'Sheep' | 'Goat' | 'Bird' | 'Elephant' | 'Rhino' 
  | 'Alligator' | 'Anteater' | 'Bull' | 'Cow' | 'Gorilla' | 'Monkey' 
  | 'Ostrich' | 'Pig' | 'Tiger' | 'Lion' | 'Hippo' | 'Kangaroo' | 'Special';

export type Hobby = 'Educación' | 'Moda' | 'Fitness' | 'Música' | 'Naturaleza' | 'Juego';

export interface Villager {
  id: string;
  name: string;
  nameSpanish: string;
  species: Species;
  speciesSpanish: string;
  gender: 'Macho' | 'Hembra';
  personality: Personality;
  personalitySpanish: PersonalitySpanish;
  birthday: {
    month: number; // 1-12
    day: number;   // 1-31
    display: string;
  };
  zodiac: string;
  catchphrase: string;
  catchphraseSpanish: string;
  hobby: Hobby;
  favoriteColors: string[];
  favoriteStyles: string[];
  coffee: {
    beans: string;
    milk: string;
    sugar: string;
  };
  quote: string;
  quoteSpanish: string;
  avatarColor: string;
  imageUrl?: string;
  isSpecial?: boolean;
}

export type CritterCategory = 'fish' | 'bug' | 'sea';

export interface Critter {
  id: string;
  name: string;
  nameSpanish: string;
  category: CritterCategory;
  price: number;
  flickCjPrice: number;
  location: string;
  shadow?: string;
  speed?: string;
  time: string;
  timeHours: number[]; // e.g. [4, 5, 6, ..., 19] or all 24
  monthsNorth: number[]; // [1..12]
  monthsSouth: number[]; // [1..12]
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy raro';
}

export interface IslandPassport {
  islandName: string;
  islandRep: string;
  titleFirst: string;
  titleSecond: string;
  hemisphere: 'Norte' | 'Sur';
  nativeFruit: 'Manzana' | 'Cereza' | 'Naranja' | 'Melocotón' | 'Pera';
  nativeFlower: 'Cosmos' | 'Jacintos' | 'Lirios' | 'Crisantemos' | 'Pensamientos' | 'Rosas' | 'Tulipanes' | 'Anémonas';
  dreamAddress: string;
  creatorCode: string;
  starRating: number;
  themeColor: 'beige' | 'green' | 'teal' | 'terracotta' | 'wood';
  avatarUrl: string;
  motto: string;
  stamps: string[];
  foundedDate: string;
}

export interface ResidentState {
  villagerId: string;
  friendshipLevel: number; // 1 to 6
  hasPhoto: boolean;
  notes: string;
  talkedToday: boolean;
  giftedToday: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Paisajes' | 'Vecinos' | 'Eventos' | 'Interiores' | 'General';
  url: string;
  date: string;
  description: string;
  isFavorite: boolean;
  taggedVillagers?: string[];
}

export interface SpecialEvent {
  id: string;
  title: string;
  character: string;
  schedule: string;
  description: string;
  month?: number;
  day?: number;
  isSeasonal: boolean;
  category: 'visitante' | 'torneo' | 'temporada' | 'festivo';
}

export interface ArtWork {
  id: string;
  nameSpanish: string;
  realName: string;
  author: string;
  fakeTell: string;
  hasFake: boolean;
}

export interface FurnitureItem {
  id: string;
  name: string;
  series: string;
  category: string;
  price: number;
  diy: boolean;
  materials?: string;
}
