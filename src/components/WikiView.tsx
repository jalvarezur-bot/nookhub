import React, { useState, useMemo } from 'react';
import { Villager } from '../types';
import { VILLAGERS_DATA } from '../data/villagers';
import { playSound } from '../utils/audio';
import { VillagerAvatar } from './VillagerAvatar';
import { Search, Sparkles, Coffee, Gift, Heart, Calendar, BookOpen, X, Filter } from 'lucide-react';

interface WikiViewProps {
  soundEnabled: boolean;
  selectedVillagerFromProp?: Villager | null;
  onClearPropSelection?: () => void;
}

export const WikiView: React.FC<WikiViewProps> = ({
  soundEnabled,
  selectedVillagerFromProp,
  onClearPropSelection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [personalityFilter, setPersonalityFilter] = useState<string>('all');
  const [hobbyFilter, setHobbyFilter] = useState<string>('all');
  const [selectedVillager, setSelectedVillager] = useState<Villager | null>(selectedVillagerFromProp || null);

  // Sync prop selection if provided
  React.useEffect(() => {
    if (selectedVillagerFromProp) {
      setSelectedVillager(selectedVillagerFromProp);
    }
  }, [selectedVillagerFromProp]);

  const uniqueSpecies = useMemo(() => {
    const set = new Set<string>();
    VILLAGERS_DATA.forEach((v) => set.add(v.speciesSpanish));
    return Array.from(set).sort();
  }, []);

  const filteredVillagers = useMemo(() => {
    return VILLAGERS_DATA.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.catchphraseSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.speciesSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.zodiac.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = speciesFilter === 'all' || v.speciesSpanish === speciesFilter;
      const matchesPersonality = personalityFilter === 'all' || v.personality === personalityFilter;
      const matchesHobby = hobbyFilter === 'all' || v.hobby === hobbyFilter;

      return matchesSearch && matchesSpecies && matchesPersonality && matchesHobby;
    });
  }, [searchQuery, speciesFilter, personalityFilter, hobbyFilter]);

  // Personality schedule notes
  const getPersonalitySchedule = (p: Villager['personality']) => {
    switch (p) {
      case 'Lazy':
        return { wake: '8:00 AM', sleep: '11:00 PM', desc: 'Le apasiona la comida, la tranquilidad y hablar con los bichitos del suelo.' };
      case 'Jock':
        return { wake: '6:30 AM', sleep: '12:30 AM', desc: 'Madrugador extremo, siempre hablando de rutinas de pesas, cardio y sudor.' };
      case 'Cranky':
        return { wake: '9:00 AM', sleep: '3:30 AM', desc: 'Se acuesta muy tarde, tiene voz profunda y actúa como un abuelo cascarrabias entrañable.' };
      case 'Smug':
        return { wake: '7:00 AM', sleep: '2:00 AM', desc: 'Caballeroso, refinado, apasionado por la moda, la música y el buen café.' };
      case 'Normal':
        return { wake: '6:00 AM', sleep: '12:00 AM', desc: 'Amable, pacífica, le encanta leer libros de botánica y cocinar repostería.' };
      case 'Peppy':
        return { wake: '7:00 AM', sleep: '1:30 AM', desc: 'Hiperactiva y soñadora, con aspiraciones constantes de ser una superestrella del pop.' };
      case 'Snooty':
        return { wake: '8:30 AM', sleep: '2:30 AM', desc: 'Glamurosa, sofisticada, apasionada por la cosmética, el arte y el chismorreo selecto.' };
      case 'Sisterly':
        return { wake: '9:30 AM', sleep: '3:00 AM', desc: 'Protectora y rebelde, te cuidará y te regalará medicinas si te pican las avispas.' };
      default:
        return { wake: '8:00 AM', sleep: '12:00 AM', desc: 'Personaje especial con funciones insulares.' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Aldeanopedia & Archivo de Personajes</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Enciclopedia completa y verificada con gustos exactos, recetas de café de Fígaro, personalidades y cumpleaños.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E4D8C8] text-xs font-semibold text-[#3C342C]">
          <span className="text-[#489D6C] font-bold">{filteredVillagers.length}</span> Personajes mostrados
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl p-4 space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#7A6F64] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, frase, especie o signo del zodiaco..."
            className="w-full pl-9 pr-4 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Species */}
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          >
            <option value="all">Todas las especies</option>
            {uniqueSpecies.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Personality */}
          <select
            value={personalityFilter}
            onChange={(e) => setPersonalityFilter(e.target.value)}
            className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
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

          {/* Hobby */}
          <select
            value={hobbyFilter}
            onChange={(e) => setHobbyFilter(e.target.value)}
            className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          >
            <option value="all">Todas las aficiones / hobbies</option>
            <option value="Educación">Educación 📚</option>
            <option value="Moda">Moda 👗</option>
            <option value="Fitness">Fitness 🏋️</option>
            <option value="Música">Música 🎵</option>
            <option value="Naturaleza">Naturaleza 🌿</option>
            <option value="Juego">Juego 🎮</option>
          </select>
        </div>
      </div>

      {/* Villagers Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVillagers.map((v) => (
          <div
            key={v.id}
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setSelectedVillager(v);
            }}
            className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-4 shadow-xs hover:border-[#489D6C] hover:bg-[#FAF6F0] transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-3">
              <VillagerAvatar villager={v} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#3C342C] truncate">{v.nameSpanish}</h3>
                  <span className="text-[10px] text-[#7A6F64] shrink-0">{v.birthday.display}</span>
                </div>
                <p className="text-[11px] text-[#7A6F64] truncate">
                  {v.name} · {v.speciesSpanish}
                </p>
                <p className="text-[10px] text-[#489D6C] font-semibold mt-0.5">
                  {v.personalitySpanish} · {v.hobby}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/60 text-[11px] text-[#5C534A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6F64] text-[10px]">Muletilla:</span>
                <span className="italic font-medium text-[#3C342C]">"{v.catchphraseSpanish}"</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6F64] text-[10px]">Colores:</span>
                <span className="font-medium text-[#3C342C]">{v.favoriteColors.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVillagers.length === 0 && (
        <div className="p-12 text-center bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl">
          <p className="text-sm font-semibold text-[#3C342C]">No se encontró ningún personaje con esos filtros.</p>
          <p className="text-xs text-[#7A6F64] mt-1">Prueba restableciendo los filtros o buscando otro término.</p>
        </div>
      )}

      {/* VILLAGER FULL ENCYCLOPEDIC MODAL */}
      {selectedVillager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-xl w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F0E8DC] border-b border-[#E4D8C8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VillagerAvatar villager={selectedVillager} size="xl" />
                <div>
                  <h3 className="text-lg font-bold text-[#3C342C]">
                    {selectedVillager.nameSpanish}{' '}
                    <span className="text-xs font-normal text-[#7A6F64]">({selectedVillager.name})</span>
                  </h3>
                  <p className="text-xs text-[#7A6F64]">
                    {selectedVillager.speciesSpanish} · {selectedVillager.gender} · {selectedVillager.personalitySpanish}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedVillager(null);
                  if (onClearPropSelection) onClearPropSelection();
                }}
                className="p-1.5 text-[#7A6F64] hover:text-[#3C342C] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#3C342C]">
              {/* Official Photo Quote */}
              <div className="p-3.5 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] italic text-[#5C534A] flex items-start gap-2.5">
                <span className="text-base">💬</span>
                <div>
                  <p className="font-medium">"{selectedVillager.quoteSpanish}"</p>
                  <p className="text-[10px] text-[#7A6F64] not-italic mt-1">
                    Cita grabada al reverso de su foto enmarcada oficial.
                  </p>
                </div>
              </div>

              {/* Identity & Astro Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                  <span className="text-[10px] uppercase font-bold text-[#7A6F64] block">Cumpleaños</span>
                  <p className="font-semibold text-[#3C342C] mt-0.5">{selectedVillager.birthday.display}</p>
                </div>
                <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                  <span className="text-[10px] uppercase font-bold text-[#7A6F64] block">Zodiaco</span>
                  <p className="font-semibold text-[#3C342C] mt-0.5">{selectedVillager.zodiac}</p>
                </div>
                <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                  <span className="text-[10px] uppercase font-bold text-[#7A6F64] block">Muletilla</span>
                  <p className="font-semibold text-[#489D6C] mt-0.5">"{selectedVillager.catchphraseSpanish}"</p>
                </div>
              </div>

              {/* Roost Coffee Preferences */}
              <div className="p-4 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] space-y-2">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#825E3E]" />
                  <span className="font-bold text-[#3C342C] text-xs">Pedido de Café en El Alpiste con Fígaro</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px]">
                  <div className="p-2 bg-[#FAF6F0] rounded-lg border border-[#E4D8C8]/60">
                    <span className="text-[10px] text-[#7A6F64] block">Granos</span>
                    <span className="font-semibold text-[#3C342C]">{selectedVillager.coffee.beans}</span>
                  </div>
                  <div className="p-2 bg-[#FAF6F0] rounded-lg border border-[#E4D8C8]/60">
                    <span className="text-[10px] text-[#7A6F64] block">Leche</span>
                    <span className="font-semibold text-[#3C342C]">{selectedVillager.coffee.milk}</span>
                  </div>
                  <div className="p-2 bg-[#FAF6F0] rounded-lg border border-[#E4D8C8]/60">
                    <span className="text-[10px] text-[#7A6F64] block">Azúcar</span>
                    <span className="font-semibold text-[#3C342C]">{selectedVillager.coffee.sugar}</span>
                  </div>
                </div>
              </div>

              {/* Fashion, Style & Gift Guide */}
              <div className="p-4 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#C86343]" />
                  <span className="font-bold text-[#3C342C] text-xs">Guía de Regalos y Puntos de Amistad</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#5C534A] leading-relaxed">
                  <p>
                    <strong className="text-[#3C342C]">Colores preferidos:</strong> {selectedVillager.favoriteColors.join(', ')}
                  </p>
                  <p>
                    <strong className="text-[#3C342C]">Estilos de vestimenta:</strong> {selectedVillager.favoriteStyles.join(' y ')}
                  </p>
                  <div className="p-2.5 bg-[#E2F0E7] text-[#2F6746] rounded-lg mt-2 text-[10px]">
                    <strong>Consejo para obtener su foto enmarcada:</strong> Regálale 2 frutas exóticas (no nativas de tu isla) envueltas en papel de regalo de Hermanas Manitas, o una pieza de ropa que combine sus colores y estilos.
                  </div>
                </div>
              </div>

              {/* Behavior & Schedule */}
              {(() => {
                const sched = getPersonalitySchedule(selectedVillager.personality);
                return (
                  <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-[11px] space-y-1 text-[#5C534A]">
                    <span className="font-bold text-[#3C342C] block">Horario y Comportamiento Insular:</span>
                    <p>
                      Despierta a las <strong className="text-[#3C342C]">{sched.wake}</strong> y se duerme a las <strong className="text-[#3C342C]">{sched.sleep}</strong>.
                    </p>
                    <p className="text-[#7A6F64] mt-0.5">{sched.desc}</p>
                  </div>
                );
              })()}
            </div>

            <div className="px-6 py-3.5 bg-[#F0E8DC] border-t border-[#E4D8C8] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedVillager(null);
                  if (onClearPropSelection) onClearPropSelection();
                }}
                className="px-5 py-2 bg-[#3C342C] text-[#FAF6F0] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
