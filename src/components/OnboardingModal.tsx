import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { IslandPassport, ResidentState, Villager } from '../types';
import { VILLAGERS_DATA } from '../data/villagers';
import { playSound } from '../utils/audio';
import { VillagerAvatar } from './VillagerAvatar';
import { Check, ArrowRight, ArrowLeft, Sparkles, Search, X, Users, Heart } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedPassport: IslandPassport, initialResidents?: ResidentState[]) => void;
  currentPassport: IslandPassport;
  soundEnabled: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currentPassport,
  soundEnabled
}) => {
  const [step, setStep] = useState<number>(1);
  const [repName, setRepName] = useState(currentPassport.islandRep || 'Aldeano');
  const [islandName, setIslandName] = useState(currentPassport.islandName || 'Isla Nublar');
  const [hemisphere, setHemisphere] = useState<'Norte' | 'Sur'>(currentPassport.hemisphere || 'Norte');
  const [fruit, setFruit] = useState<IslandPassport['nativeFruit']>(currentPassport.nativeFruit || 'Cereza');
  const [flower, setFlower] = useState<IslandPassport['nativeFlower']>(currentPassport.nativeFlower || 'Rosas');

  // Multi-villager selection for onboarding: any villagers from the full database!
  const [selectedVillagers, setSelectedVillagers] = useState<string[]>(['raymond', 'marshal']);
  const [villagerSearch, setVillagerSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [personalityFilter, setPersonalityFilter] = useState('all');

  if (!isOpen) return null;

  const fruits: { name: IslandPassport['nativeFruit']; emoji: string; desc: string }[] = [
    { name: 'Manzana', emoji: '🍎', desc: 'Clásica y jugosa' },
    { name: 'Cereza', emoji: '🍒', desc: 'Dulce y silvestre' },
    { name: 'Naranja', emoji: '🍊', desc: 'Cítrica y refrescante' },
    { name: 'Melocotón', emoji: '🍑', desc: 'Suave y perfumada' },
    { name: 'Pera', emoji: '🍐', desc: 'Crujiente y delicada' }
  ];

  const flowers: { name: IslandPassport['nativeFlower']; emoji: string }[] = [
    { name: 'Rosas', emoji: '🌹' },
    { name: 'Tulipanes', emoji: '🌷' },
    { name: 'Cosmos', emoji: '🌸' },
    { name: 'Lirios', emoji: '🪷' },
    { name: 'Jacintos', emoji: '💐' },
    { name: 'Crisantemos', emoji: '🌼' },
    { name: 'Pensamientos', emoji: '🌺' },
    { name: 'Anémonas', emoji: '💮' }
  ];

  const handleNext = () => {
    if (soundEnabled) playSound('pop');
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    if (soundEnabled) playSound('pop');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleToggleVillager = (vId: string) => {
    if (soundEnabled) playSound('pop');
    if (selectedVillagers.includes(vId)) {
      setSelectedVillagers(selectedVillagers.filter((id) => id !== vId));
    } else {
      if (selectedVillagers.length >= 10) {
        alert('Una isla puede albergar un máximo de 10 vecinos residentes.');
        return;
      }
      setSelectedVillagers([...selectedVillagers, vId]);
    }
  };

  const handleFinish = () => {
    if (soundEnabled) playSound('fanfare');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const updatedPassport: IslandPassport = {
      ...currentPassport,
      islandRep: repName.trim() || 'Aldeano',
      islandName: islandName.trim() || 'Isla Nublar',
      hemisphere,
      nativeFruit: fruit,
      nativeFlower: flower,
      stamps: Array.from(new Set([...currentPassport.stamps, 'Viajero Nook Inc.', 'Pasaporte Registrado']))
    };

    const newResidents: ResidentState[] = selectedVillagers.map((vId, idx) => ({
      villagerId: vId,
      friendshipLevel: idx < 2 ? 3 : 2,
      hasPhoto: false,
      notes: idx < 2 ? 'Vecino fundador' : 'Residente insular',
      talkedToday: false,
      giftedToday: false
    }));

    onComplete(updatedPassport, newResidents);
  };

  // Filter villagers for step 4
  const availableVillagers = VILLAGERS_DATA.filter((v) => !v.isSpecial).filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(villagerSearch.toLowerCase()) ||
      v.nameSpanish.toLowerCase().includes(villagerSearch.toLowerCase()) ||
      v.speciesSpanish.toLowerCase().includes(villagerSearch.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || v.speciesSpanish === speciesFilter;
    const matchesPersonality = personalityFilter === 'all' || v.personality === personalityFilter;
    return matchesSearch && matchesSpecies && matchesPersonality;
  });

  const uniqueSpecies = Array.from(
    new Set(VILLAGERS_DATA.filter((v) => !v.isSpecial).map((v) => v.speciesSpanish))
  ).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#F0E8DC] border-b border-[#E4D8C8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#489D6C] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
              N
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6F64]">Nook Inc. Gateway</p>
              <h2 className="text-base font-bold text-[#3C342C]">Registro del Plan de Asentamiento</h2>
            </div>
          </div>
          <span className="text-xs font-medium text-[#7A6F64] tabular-nums">Paso {step} de 5</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#3C342C]">
          {/* STEP 1: Island & Rep Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]/80 text-sm leading-relaxed text-[#5C534A]">
                <p>
                  ¡Te damos la bienvenida al mostrador de facturación del Plan de Asentamiento en Islas Desiertas de Nook Inc.!
                </p>
                <p className="mt-2 text-xs text-[#7A6F64]">
                  Antes de despegar en el hidroavión de Dodo Airlines hacia tu nuevo hogar insular, necesitamos registrar los datos oficiales de tu expediente.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                  Nombre del Representante Insular (Tu personaje)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-sm font-semibold text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                  placeholder="Ej: Sofía, Lucas, Alex..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                  Nombre de tu Isla Desierta
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={islandName}
                  onChange={(e) => setIslandName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-sm font-semibold text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                  placeholder="Ej: Paraíso, Kokomo, Bellota..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Hemisphere Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]/80 text-xs text-[#5C534A]">
                <span className="font-semibold text-[#3C342C]">¿Por qué importa el hemisferio?</span> El hemisferio determina las estaciones del año y el calendario de aparición exacto de los peces, insectos y criaturas marinas en tu Capturopedia.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setHemisphere('Norte');
                    if (soundEnabled) playSound('pop');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    hemisphere === 'Norte'
                      ? 'bg-[#E2F0E7] border-[#489D6C] ring-2 ring-[#489D6C]/20'
                      : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#D2C4B1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-[#3C342C]">Hemisferio Norte</span>
                    {hemisphere === 'Norte' && <Check className="w-4 h-4 text-[#489D6C]" />}
                  </div>
                  <p className="text-xs text-[#7A6F64] leading-relaxed">
                    Primavera (Mar-May), Verano (Jun-Ago), Otoño (Sep-Nov), Invierno (Dic-Feb). Ideal para España, México, EE.UU., etc.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHemisphere('Sur');
                    if (soundEnabled) playSound('pop');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    hemisphere === 'Sur'
                      ? 'bg-[#E2F0E7] border-[#489D6C] ring-2 ring-[#489D6C]/20'
                      : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#D2C4B1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-[#3C342C]">Hemisferio Sur</span>
                    {hemisphere === 'Sur' && <Check className="w-4 h-4 text-[#489D6C]" />}
                  </div>
                  <p className="text-xs text-[#7A6F64] leading-relaxed">
                    Estaciones invertidas: Verano en Diciembre y nieve en Julio. Ideal para Argentina, Chile, Uruguay, Australia, etc.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Native Fruit & Flower */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-2">
                  Fruta Nativa de tu Isla
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fruits.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => {
                        setFruit(f.name);
                        if (soundEnabled) playSound('pop');
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
                        fruit === f.name
                          ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C] font-semibold'
                          : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#D2C4B1] text-[#5C534A]'
                      }`}
                    >
                      <span className="text-2xl">{f.emoji}</span>
                      <div>
                        <div className="text-xs font-bold">{f.name}</div>
                        <div className="text-[10px] text-[#7A6F64]">{f.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-2">
                  Flor Nativa de los Acantilados
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {flowers.map((fl) => (
                    <button
                      key={fl.name}
                      type="button"
                      onClick={() => {
                        setFlower(fl.name);
                        if (soundEnabled) playSound('pop');
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                        flower === fl.name
                          ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C] font-semibold'
                          : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#D2C4B1] text-[#5C534A]'
                      }`}
                    >
                      <span className="text-xl">{fl.emoji}</span>
                      <span className="text-xs font-medium">{fl.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Choose ALL starting villagers with full database search! */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]/80 text-xs text-[#5C534A]">
                <div>
                  <span className="font-semibold text-[#3C342C]">Selección Libre de Vecinos:</span>
                  <p className="text-[#7A6F64] text-[11px] mt-0.5">
                    Puedes elegir desde 1 hasta tus 10 vecinos iniciales entre todas las especies y personalidades reales de Animal Crossing.
                  </p>
                </div>
                <div className="px-3 py-1 bg-[#E2F0E7] text-[#489D6C] font-bold rounded-lg text-xs shrink-0 self-start sm:self-center">
                  {selectedVillagers.length} / 10 Vecinos
                </div>
              </div>

              {/* Selected Villagers Chips */}
              {selectedVillagers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7A6F64] tracking-wider">
                    Vecinos que vivirán en tu isla:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVillagers.map((vId) => {
                      const v = VILLAGERS_DATA.find((item) => item.id === vId);
                      if (!v) return null;
                      return (
                        <div
                          key={vId}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#FAF6F0] border border-[#BDDCB8] text-[#3C342C] shadow-xs"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: v.avatarColor }}
                          />
                          <span className="font-semibold">{v.nameSpanish}</span>
                          <span className="text-[10px] text-[#7A6F64]">({v.speciesSpanish})</span>
                          <button
                            type="button"
                            onClick={() => handleToggleVillager(vId)}
                            className="ml-1 text-[#7A6F64] hover:text-[#C86343] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search & Filters */}
              <div className="space-y-2 pt-2 border-t border-[#E4D8C8]/80">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#7A6F64] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={villagerSearch}
                    onChange={(e) => setVillagerSearch(e.target.value)}
                    placeholder="Buscar entre todos los vecinos (ej: Narciso, Munchi, Judy, Shino, Gato, Ciervo)..."
                    className="w-full pl-9 pr-4 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden"
                  >
                    <option value="all">Todas las especies</option>
                    {uniqueSpecies.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <select
                    value={personalityFilter}
                    onChange={(e) => setPersonalityFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden"
                  >
                    <option value="all">Todas las personalidades</option>
                    <option value="Smug">Esnob (Smug)</option>
                    <option value="Lazy">Perezoso (Lazy)</option>
                    <option value="Normal">Normal</option>
                    <option value="Peppy">Alegre (Peppy)</option>
                    <option value="Jock">Atlético (Jock)</option>
                    <option value="Snooty">Altanera (Snooty)</option>
                    <option value="Cranky">Gruñón (Cranky)</option>
                    <option value="Sisterly">Dulce/Uchi (Sisterly)</option>
                  </select>
                </div>
              </div>

              {/* Villagers Grid */}
              <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
                {availableVillagers.map((v) => {
                  const isSelected = selectedVillagers.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleToggleVillager(v.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C]'
                          : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#D2C4B1] text-[#5C534A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <VillagerAvatar villager={v} size="sm" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate text-[#3C342C]">{v.nameSpanish}</p>
                          <p className="text-[10px] text-[#7A6F64] truncate">
                            {v.name} · {v.speciesSpanish} · {v.personalitySpanish}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#489D6C] border-[#489D6C] text-white'
                            : 'border-[#D2C4B1] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Summary & Passport Generation */}
          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E2F0E7] text-[#489D6C] flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#3C342C]">¡Todo listo para emitir tu Pasaporte!</h3>
              <p className="text-xs text-[#7A6F64] max-w-md mx-auto">
                Tu vuelo hacia <strong className="text-[#3C342C]">{islandName}</strong> está listo para el despegue. Hemos configurado tus preferencias y {selectedVillagers.length} vecinos en tu isla.
              </p>

              <div className="p-4 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#7A6F64]">Representante:</span>
                  <span className="font-semibold text-[#3C342C]">{repName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64]">Isla:</span>
                  <span className="font-semibold text-[#3C342C]">{islandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64]">Hemisferio:</span>
                  <span className="font-semibold text-[#3C342C]">Hemisferio {hemisphere}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64]">Fruta / Flor nativa:</span>
                  <span className="font-semibold text-[#3C342C]">{fruit} · {flower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64]">Vecinos asignados:</span>
                  <span className="font-semibold text-[#489D6C]">{selectedVillagers.length} residentes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#F0E8DC] border-t border-[#E4D8C8] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#5C534A] hover:text-[#3C342C] hover:bg-[#E4D8C8]/60 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>¡Comenzar mi Aventura!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
