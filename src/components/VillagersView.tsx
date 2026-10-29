import React, { useState } from 'react';
import { ResidentState, Villager } from '../types';
import { VILLAGERS_DATA } from '../data/villagers';
import { playSound } from '../utils/audio';
import { VillagerAvatar } from './VillagerAvatar';
import { Heart, Gift, MessageCircle, Star, Search, Plus, Trash2, Coffee, Sparkles, X, Check } from 'lucide-react';

interface VillagersViewProps {
  residents: ResidentState[];
  onUpdateResidents: (residents: ResidentState[]) => void;
  soundEnabled: boolean;
  onOpenWikiDetail: (villager: Villager) => void;
}

export const VillagersView: React.FC<VillagersViewProps> = ({
  residents,
  onUpdateResidents,
  soundEnabled,
  onOpenWikiDetail
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [personalityFilter, setPersonalityFilter] = useState<string>('all');
  const [editingNotesIndex, setEditingNotesIndex] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // 10 canonical resident slots in ACNH
  const totalSlots = 10;
  const currentSlots: (ResidentState | null)[] = Array.from({ length: totalSlots }, (_, i) => residents[i] || null);

  const getVillagerById = (id: string): Villager | undefined => {
    return VILLAGERS_DATA.find((v) => v.id === id);
  };

  const handleHeartClick = (index: number, newLevel: number) => {
    if (soundEnabled) playSound('bell');
    const updated = [...residents];
    if (updated[index]) {
      updated[index] = { ...updated[index], friendshipLevel: newLevel };
      if (newLevel >= 5) {
        updated[index].hasPhoto = true;
      }
      onUpdateResidents(updated);
    }
  };

  const togglePhoto = (index: number) => {
    if (soundEnabled) playSound('stamp');
    const updated = [...residents];
    if (updated[index]) {
      updated[index] = { ...updated[index], hasPhoto: !updated[index].hasPhoto };
      onUpdateResidents(updated);
    }
  };

  const toggleTalked = (index: number) => {
    if (soundEnabled) playSound('pop');
    const updated = [...residents];
    if (updated[index]) {
      updated[index] = { ...updated[index], talkedToday: !updated[index].talkedToday };
      onUpdateResidents(updated);
    }
  };

  const toggleGifted = (index: number) => {
    if (soundEnabled) playSound('pop');
    const updated = [...residents];
    if (updated[index]) {
      updated[index] = { ...updated[index], giftedToday: !updated[index].giftedToday };
      onUpdateResidents(updated);
    }
  };

  const handleRemoveResident = (index: number) => {
    if (soundEnabled) playSound('pop');
    const updated = residents.filter((_, i) => i !== index);
    onUpdateResidents(updated);
  };

  const handleSelectVillager = (villagerId: string) => {
    if (selectedSlotIndex === null) return;
    if (soundEnabled) playSound('fanfare');

    const updated = [...residents];
    const newResident: ResidentState = {
      villagerId,
      friendshipLevel: 1,
      hasPhoto: false,
      notes: '',
      talkedToday: false,
      giftedToday: false
    };

    if (selectedSlotIndex < updated.length) {
      updated[selectedSlotIndex] = newResident;
    } else {
      updated.push(newResident);
    }

    onUpdateResidents(updated);
    setSelectedSlotIndex(null);
    setSearchQuery('');
  };

  const handleSaveNotes = (index: number) => {
    if (soundEnabled) playSound('pop');
    const updated = [...residents];
    if (updated[index]) {
      updated[index] = { ...updated[index], notes: tempNotes };
      onUpdateResidents(updated);
    }
    setEditingNotesIndex(null);
  };

  // Filtered villagers for selection modal (only standard villagers, not special NPCs)
  const availableVillagers = VILLAGERS_DATA.filter((v) => !v.isSpecial).filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speciesSpanish.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPersonality = personalityFilter === 'all' || v.personality === personalityFilter;
    return matchesSearch && matchesPersonality;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Mis 10 Vecinos de la Isla</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Administra los 10 residentes de tu isla, monitorea su nivel de amistad y consulta su guía de regalos ideales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E4D8C8] text-xs font-semibold text-[#3C342C]">
            <span className="text-[#489D6C] font-bold">{residents.length}</span> / 10 Habitantes
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E4D8C8] text-xs font-semibold text-[#3C342C]">
            <span className="text-[#C86343] font-bold">
              {residents.filter((r) => r.hasPhoto).length}
            </span> / 10 Fotos Obtenidas
          </div>
        </div>
      </div>

      {/* Grid of 10 Resident Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {currentSlots.map((res, index) => {
          if (!res) {
            return (
              <div
                key={`empty-${index}`}
                onClick={() => {
                  if (soundEnabled) playSound('pop');
                  setSelectedSlotIndex(index);
                }}
                className="h-64 rounded-2xl border-2 border-dashed border-[#D2C4B1] bg-[#FAF6F0]/50 hover:bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E4D8C8]/60 group-hover:bg-[#489D6C] group-hover:text-[#FAF6F0] text-[#7A6F64] flex items-center justify-center transition-colors mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#3C342C]">Parcela Vacante #{index + 1}</h3>
                <p className="text-xs text-[#7A6F64] mt-1 max-w-xs">
                  Haz clic para invitar a un nuevo aldeano a mudarse a tu isla ({VILLAGERS_DATA.length - 6} personajes disponibles).
                </p>
              </div>
            );
          }

          const villager = getVillagerById(res.villagerId);
          if (!villager) return null;

          return (
            <div
              key={res.villagerId}
              className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D2C4B1] transition-colors"
            >
              {/* Resident Card Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {/* Avatar Icon */}
                  <div
                    onClick={() => onOpenWikiDetail(villager)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    title="Ver ficha completa en Aldeanopedia"
                  >
                    <VillagerAvatar villager={villager} size="xl" showSpeciesBadge={true} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        onClick={() => onOpenWikiDetail(villager)}
                        className="text-base font-bold text-[#3C342C] hover:text-[#489D6C] cursor-pointer transition-colors"
                      >
                        {villager.nameSpanish}
                      </h2>
                      <span className="text-xs text-[#7A6F64]">({villager.name})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#7A6F64] mt-0.5">
                      <span>{villager.personalitySpanish}</span>
                      <span aria-hidden="true">·</span>
                      <span>{villager.birthday.display}</span>
                    </div>
                  </div>
                </div>

                {/* Photo status button & remove button */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => togglePhoto(index)}
                    title={res.hasPhoto ? '¡Foto enmarcada obtenida!' : 'Marcar foto como conseguida'}
                    className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      res.hasPhoto
                        ? 'bg-[#E2F0E7] border-[#489D6C] text-[#489D6C]'
                        : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#A89C8F] hover:text-[#3C342C]'
                    }`}
                  >
                    🖼️
                  </button>

                  <button
                    onClick={() => handleRemoveResident(index)}
                    title="Despedir de la isla / Desocupar parcela"
                    className="p-2 text-[#A89C8F] hover:text-[#C86343] hover:bg-[#F0E8DC] rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Friendship Hearts (Level 1-6) */}
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#7A6F64] uppercase tracking-wider text-[10px]">
                    Nivel de Amistad: Nivel {res.friendshipLevel}
                  </span>
                  <span className="text-[11px] font-semibold text-[#489D6C]">
                    {res.friendshipLevel === 6 ? 'Mejores Amigos' : res.friendshipLevel >= 5 ? 'Foto Obtenida' : `Nivel ${res.friendshipLevel}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleHeartClick(index, level)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      title={`Fijar nivel de amistad en ${level}`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          level <= res.friendshipLevel
                            ? 'text-[#C86343] fill-[#C86343]'
                            : 'text-[#D2C4B1]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Interaction Trackers (Hablado & Regalo) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => toggleTalked(index)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    res.talkedToday
                      ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C] font-semibold'
                      : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#489D6C]" />
                    <span>Hablado hoy</span>
                  </span>
                  {res.talkedToday && <Check className="w-3.5 h-3.5 text-[#489D6C]" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleGifted(index)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    res.giftedToday
                      ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C] font-semibold'
                      : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#C86343]" />
                    <span>Regalo hoy</span>
                  </span>
                  {res.giftedToday && <Check className="w-3.5 h-3.5 text-[#489D6C]" />}
                </button>
              </div>

              {/* Guía Rápida de Regalos Ideales */}
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-[11px] space-y-1.5 text-[#5C534A]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3C342C]">Gustos favoritos:</span>
                  <span className="text-[#489D6C] font-medium">
                    Colores: {villager.favoriteColors.join(', ')}
                  </span>
                </div>
                <div className="text-[11px] text-[#7A6F64]">
                  Estilos: <span className="text-[#3C342C]">{villager.favoriteStyles.join(' y ')}</span> · Café: <span className="text-[#3C342C]">{villager.coffee.beans}</span>
                </div>
                <div className="text-[10px] text-[#A89C8F] italic pt-1 border-t border-[#E4D8C8]/60">
                  Tip de amistad: Envolver con papel de regalo 2 frutas no nativas o 1 fósil tasado asegura los puntos máximos (+3 pts).
                </div>
              </div>

              {/* Notes */}
              <div>
                {editingNotesIndex === index ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Escribe notas sobre su saludo, ropa regalada..."
                      className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C] h-16"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesIndex(null)}
                        className="px-2.5 py-1 text-xs text-[#7A6F64] hover:text-[#3C342C] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveNotes(index)}
                        className="px-3 py-1 bg-[#489D6C] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingNotesIndex(index);
                      setTempNotes(res.notes || '');
                    }}
                    className="text-xs text-[#7A6F64] hover:text-[#3C342C] cursor-pointer bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2 rounded-lg border border-[#E4D8C8]/60 transition-colors"
                  >
                    {res.notes ? (
                      <span>📝 {res.notes}</span>
                    ) : (
                      <span className="italic text-[#A89C8F]">+ Añadir notas privadas para este vecino...</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECT VILLAGER MODAL */}
      {selectedSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F0E8DC] border-b border-[#E4D8C8] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#3C342C]">Invitar Vecino a la Parcela</h3>
                <p className="text-xs text-[#7A6F64]">Selecciona un habitante de la base de datos oficial</p>
              </div>
              <button
                onClick={() => setSelectedSlotIndex(null)}
                className="p-1.5 text-[#7A6F64] hover:text-[#3C342C] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filters */}
            <div className="p-4 bg-[#FAF6F0] border-b border-[#E4D8C8] flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7A6F64] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o especie (ej: Raymond, Gato, Judy)..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                />
              </div>

              <select
                value={personalityFilter}
                onChange={(e) => setPersonalityFilter(e.target.value)}
                className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
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

            {/* Villager Grid List */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {availableVillagers.map((v) => {
                const isAlreadyResident = residents.some((r) => r.villagerId === v.id);
                return (
                  <button
                    key={v.id}
                    disabled={isAlreadyResident}
                    onClick={() => handleSelectVillager(v.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      isAlreadyResident
                        ? 'opacity-50 bg-[#F0E8DC] border-transparent cursor-not-allowed'
                        : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#489D6C] hover:bg-[#E2F0E7]/40 cursor-pointer'
                    }`}
                  >
                    <VillagerAvatar villager={v} size="md" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#3C342C] truncate">{v.nameSpanish}</span>
                        <span className="text-[10px] text-[#7A6F64]">{v.birthday.display}</span>
                      </div>
                      <div className="text-[11px] text-[#7A6F64] truncate">
                        {v.speciesSpanish} · {v.personalitySpanish}
                      </div>
                      {isAlreadyResident && (
                        <span className="text-[10px] text-[#C86343] font-semibold">Ya vive en la isla</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
