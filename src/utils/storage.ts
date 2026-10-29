import { IslandPassport, ResidentState, GalleryPhoto } from '../types';
import { DAILY_TASKS_DEFAULTS } from '../data/events';

const STORAGE_KEYS = {
  PASSPORT: 'acnh_hub_passport',
  RESIDENTS: 'acnh_hub_residents',
  CAUGHT: 'acnh_hub_caught_critters',
  DONATED: 'acnh_hub_donated_critters',
  PHOTOS: 'acnh_hub_photos',
  DAILY_TASKS: 'acnh_hub_daily_tasks',
  DAILY_DATE: 'acnh_hub_daily_date',
  ONBOARDING_DONE: 'acnh_hub_onboarding_completed',
  SOUND_ENABLED: 'acnh_hub_sound_enabled'
};

export const DEFAULT_PASSPORT: IslandPassport = {
  islandName: 'Isla Nublar',
  islandRep: 'Aldeano',
  titleFirst: 'Isleño',
  titleSecond: 'Soñador',
  hemisphere: 'Norte',
  nativeFruit: 'Cereza',
  nativeFlower: 'Rosas',
  dreamAddress: 'DA-4829-1029-3841',
  creatorCode: 'MA-9120-4412-8802',
  starRating: 5,
  themeColor: 'beige',
  avatarUrl: '',
  motto: 'Donde los sueños huelen a brisa marina y bayas.',
  stamps: ['5 Estrellas', 'Concierto de K.K.', 'Museo Activo', 'Pescador Maestro'],
  foundedDate: '20 de Marzo de 2024'
};

export const INITIAL_RESIDENTS: ResidentState[] = [
  { villagerId: 'raymond', friendshipLevel: 5, hasPhoto: true, notes: 'Le encanta el traje elegante negro.', talkedToday: true, giftedToday: false },
  { villagerId: 'marshal', friendshipLevel: 6, hasPhoto: true, notes: 'Mejor amigo. Toma café Kilimanjaro.', talkedToday: true, giftedToday: true },
  { villagerId: 'shino', friendshipLevel: 4, hasPhoto: false, notes: 'Llegó en octubre. Regalarle kimonos.', talkedToday: false, giftedToday: false },
  { villagerId: 'judy', friendshipLevel: 5, hasPhoto: true, notes: 'Le gustan los colores pastel.', talkedToday: false, giftedToday: false },
  { villagerId: 'sasha', friendshipLevel: 3, hasPhoto: false, notes: 'Le fascinan los suéteres de punto.', talkedToday: true, giftedToday: false },
  { villagerId: 'fauna', friendshipLevel: 6, hasPhoto: true, notes: 'Siempre muy dulce y atenta.', talkedToday: true, giftedToday: true },
  { villagerId: 'beau', friendshipLevel: 4, hasPhoto: false, notes: 'Perezoso adorable, le encanta comer.', talkedToday: false, giftedToday: false },
  { villagerId: 'audie', friendshipLevel: 3, hasPhoto: false, notes: 'Quiere ser cantante internacional.', talkedToday: false, giftedToday: false },
  { villagerId: 'marina', friendshipLevel: 5, hasPhoto: true, notes: 'Canta en la plaza todos los días.', talkedToday: true, giftedToday: false },
  { villagerId: 'roald', friendshipLevel: 4, hasPhoto: false, notes: 'Siempre corriendo por la playa.', talkedToday: false, giftedToday: false }
];

export const INITIAL_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo_1',
    title: 'Atardecer en el Muelle Secreto',
    category: 'Paisajes',
    url: '/src/assets/images/acnh_cozy_island_1793285877118.jpg',
    date: '2026-10-24',
    description: 'Pescando con calma mientras el sol dorado baña las aguas de la costa.',
    isFavorite: true,
    taggedVillagers: ['Boliche', 'Mitzi']
  },
  {
    id: 'photo_2',
    title: 'Rincón de Lectura Botánico',
    category: 'Interiores',
    url: '/src/assets/images/island_passport_bg_1793285877411.jpg',
    date: '2026-10-18',
    description: 'Mi rincón acogedor de papelería, plantas de monstera y aroma a café.',
    isFavorite: true,
    taggedVillagers: ['Munchi']
  }
];

export function getStoredPassport(): IslandPassport {
  if (typeof window === 'undefined') return DEFAULT_PASSPORT;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PASSPORT);
    return data ? JSON.parse(data) : DEFAULT_PASSPORT;
  } catch {
    return DEFAULT_PASSPORT;
  }
}

export function saveStoredPassport(passport: IslandPassport) {
  try {
    localStorage.setItem(STORAGE_KEYS.PASSPORT, JSON.stringify(passport));
  } catch {}
}

export function getStoredResidents(): ResidentState[] {
  if (typeof window === 'undefined') return INITIAL_RESIDENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
    return data ? JSON.parse(data) : INITIAL_RESIDENTS;
  } catch {
    return INITIAL_RESIDENTS;
  }
}

export function saveStoredResidents(residents: ResidentState[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
  } catch {}
}

export function getStoredCritterProgress(): { caught: string[]; donated: string[] } {
  const defaultCaught = ['common_butterfly', 'yellow_butterfly', 'pale_chub', 'crucian_carp', 'red_snapper', 'wasp'];
  const defaultDonated = ['common_butterfly', 'pale_chub', 'wasp'];

  if (typeof window === 'undefined') return { caught: defaultCaught, donated: defaultDonated };
  try {
    const caught = localStorage.getItem(STORAGE_KEYS.CAUGHT);
    const donated = localStorage.getItem(STORAGE_KEYS.DONATED);
    return {
      caught: caught ? JSON.parse(caught) : defaultCaught,
      donated: donated ? JSON.parse(donated) : defaultDonated
    };
  } catch {
    return { caught: defaultCaught, donated: defaultDonated };
  }
}

export function saveStoredCritterProgress(caught: string[], donated: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CAUGHT, JSON.stringify(caught));
    localStorage.setItem(STORAGE_KEYS.DONATED, JSON.stringify(donated));
  } catch {}
}

export function getStoredPhotos(): GalleryPhoto[] {
  if (typeof window === 'undefined') return INITIAL_PHOTOS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return data ? JSON.parse(data) : INITIAL_PHOTOS;
  } catch {
    return INITIAL_PHOTOS;
  }
}

export function saveStoredPhotos(photos: GalleryPhoto[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch {}
}

export function getStoredDailyTasks(): { id: string; label: string; done: boolean; icon: string }[] {
  if (typeof window === 'undefined') return DAILY_TASKS_DEFAULTS;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem(STORAGE_KEYS.DAILY_DATE);
    const savedTasks = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);

    if (savedDate !== today || !savedTasks) {
      // Auto daily reset for new calendar day
      localStorage.setItem(STORAGE_KEYS.DAILY_DATE, today);
      localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(DAILY_TASKS_DEFAULTS));
      return DAILY_TASKS_DEFAULTS;
    }
    return JSON.parse(savedTasks);
  } catch {
    return DAILY_TASKS_DEFAULTS;
  }
}

export function saveStoredDailyTasks(tasks: typeof DAILY_TASKS_DEFAULTS) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.DAILY_DATE, today);
    localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(tasks));
  } catch {}
}

export function getHasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
}

export function setHasCompletedOnboarding(val: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, val ? 'true' : 'false');
  } catch {}
}
