import React, { useState, useMemo } from 'react';
import { Critter, CritterCategory } from '../types';
import { CRITTERS_DATA } from '../data/critters';
import { playSound } from '../utils/audio';
import { Search, Check, Clock, MapPin, Coins, Sparkles, Filter, X } from 'lucide-react';

interface CritterpediaViewProps {
  caughtList: string[];
  donatedList: string[];
  onToggleCaught: (critterId: string) => void;
  onToggleDonated: (critterId: string) => void;
  userHemisphere: 'Norte' | 'Sur';
  soundEnabled: boolean;
}

export const CritterpediaView: React.FC<CritterpediaViewProps> = ({
  caughtList,
  donatedList,
  onToggleCaught,
  onToggleDonated,
  userHemisphere,
  soundEnabled
}) => {
  const [activeCategory, setActiveCategory] = useState<CritterCategory>('fish');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uncaught' | 'undonated' | 'caught' | 'donated'>('all');
  const [availableNowOnly, setAvailableNowOnly] = useState(false);
  const [selectedCritter, setSelectedCritter] = useState<Critter | null>(null);

  // Current system month (1-12) and current hour (0-23)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentHour = currentDate.getHours();     // 0-23

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Check availability
  const isAvailableThisMonth = (critter: Critter, month: number = currentMonth) => {
    const months = userHemisphere === 'Norte' ? critter.monthsNorth : critter.monthsSouth;
    return months.includes(month);
  };

  const isAvailableRightNow = (critter: Critter) => {
    return isAvailableThisMonth(critter, currentMonth) && critter.timeHours.includes(currentHour);
  };

  const isLeavingThisMonth = (critter: Critter) => {
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    return isAvailableThisMonth(critter, currentMonth) && !isAvailableThisMonth(critter, nextMonth);
  };

  const isNewThisMonth = (critter: Critter) => {
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    return isAvailableThisMonth(critter, currentMonth) && !isAvailableThisMonth(critter, prevMonth);
  };

  // Filter critters
  const filteredCritters = useMemo(() => {
    return CRITTERS_DATA.filter((c) => {
      if (c.category !== activeCategory) return false;

      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const isCaught = caughtList.includes(c.id);
      const isDonated = donatedList.includes(c.id);

      if (statusFilter === 'uncaught' && isCaught) return false;
      if (statusFilter === 'caught' && !isCaught) return false;
      if (statusFilter === 'undonated' && isDonated) return false;
      if (statusFilter === 'donated' && !isDonated) return false;

      if (availableNowOnly && !isAvailableRightNow(c)) return false;

      return true;
    });
  }, [activeCategory, searchQuery, statusFilter, availableNowOnly, caughtList, donatedList, userHemisphere, currentMonth, currentHour]);

  // Overall category progress
  const categoryCritters = CRITTERS_DATA.filter((c) => c.category === activeCategory);
  const totalInCategory = categoryCritters.length;
  const caughtInCategory = categoryCritters.filter((c) => caughtList.includes(c.id)).length;
  const donatedInCategory = categoryCritters.filter((c) => donatedList.includes(c.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Capturopedia Insular</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Registro oficial de especímenes de pesca, cacería de insectos y buceo marino. Hemisferio: <span className="font-semibold text-[#3C342C]">{userHemisphere}</span>.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F0] border border-[#E4D8C8] rounded-xl">
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveCategory('fish');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'fish'
                ? 'bg-[#3E8F9F] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🐟 Peces
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveCategory('bug');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'bug'
                ? 'bg-[#489D6C] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🦋 Bichos
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveCategory('sea');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'sea'
                ? 'bg-[#4A5568] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🤿 Criaturas Marinas
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
            Progreso de Capturas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#3C342C] tabular-nums">
              {caughtInCategory} / {totalInCategory}
            </span>
            <span className="text-xs text-[#489D6C] font-semibold tabular-nums">
              {Math.round((caughtInCategory / (totalInCategory || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#E4D8C8]/60 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#489D6C] h-full rounded-full transition-all duration-300"
              style={{ width: `${(caughtInCategory / (totalInCategory || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
            Donaciones al Museo
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#3C342C] tabular-nums">
              {donatedInCategory} / {totalInCategory}
            </span>
            <span className="text-xs text-[#C86343] font-semibold tabular-nums">
              {Math.round((donatedInCategory / (totalInCategory || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#E4D8C8]/60 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#C86343] h-full rounded-full transition-all duration-300"
              style={{ width: `${(donatedInCategory / (totalInCategory || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-xs text-[#5C534A] space-y-1">
          <div className="flex items-center justify-between">
            <span>Mes actual:</span>
            <span className="font-bold text-[#3C342C]">{monthNames[currentMonth - 1]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hora de la isla:</span>
            <span className="font-bold text-[#3C342C] tabular-nums">{currentHour}:00 hrs</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7A6F64] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por espécimen o hábitat..."
            className="w-full pl-9 pr-4 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Available Right Now Toggle */}
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setAvailableNowOnly(!availableNowOnly);
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
              availableNowOnly
                ? 'bg-[#E2F0E7] border-[#489D6C] text-[#489D6C]'
                : 'bg-[#FCFAF6] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Disponible Ahora</span>
          </button>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          >
            <option value="all">Todos los estados</option>
            <option value="uncaught">Pendientes de atrapar</option>
            <option value="caught">Ya capturados</option>
            <option value="undonated">No donados al museo</option>
            <option value="donated">Donados a Sócrates</option>
          </select>
        </div>
      </div>

      {/* Critters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCritters.map((critter) => {
          const isCaught = caughtList.includes(critter.id);
          const isDonated = donatedList.includes(critter.id);
          const activeNow = isAvailableRightNow(critter);
          const leavingSoon = isLeavingThisMonth(critter);
          const isNew = isNewThisMonth(critter);

          return (
            <div
              key={critter.id}
              className={`bg-[#FCFAF6] border rounded-2xl p-4 shadow-xs transition-all flex flex-col justify-between space-y-3 ${
                isCaught ? 'border-[#BDDCB8]' : 'border-[#E4D8C8]'
              } hover:border-[#D2C4B1]`}
            >
              {/* Card Top: Title & Badges */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => {
                      if (soundEnabled) playSound('pop');
                      setSelectedCritter(critter);
                    }}
                    className="cursor-pointer group"
                  >
                    <h3 className="text-sm font-bold text-[#3C342C] group-hover:text-[#489D6C] transition-colors">
                      {critter.nameSpanish}
                    </h3>
                    <p className="text-[11px] text-[#7A6F64]">{critter.name}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {activeNow && (
                      <span className="text-[10px] font-bold text-[#489D6C] bg-[#E2F0E7] px-2 py-0.5 rounded-full">
                        Ahora
                      </span>
                    )}
                    {leavingSoon && (
                      <span className="text-[10px] font-bold text-[#C86343] bg-[#FAEEE8] px-2 py-0.5 rounded-full">
                        ¡Se va este mes!
                      </span>
                    )}
                    {isNew && (
                      <span className="text-[10px] font-bold text-[#3E8F9F] bg-[#EBF5F7] px-2 py-0.5 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-3 space-y-1 text-xs text-[#5C534A]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6F64] text-[11px]">Ubicación:</span>
                    <span className="font-medium text-[#3C342C] truncate max-w-[130px]">{critter.location}</span>
                  </div>
                  {critter.shadow && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6F64] text-[11px]">Sombra:</span>
                      <span className="font-medium text-[#3C342C]">{critter.shadow}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6F64] text-[11px]">Horario:</span>
                    <span className="font-medium text-[#3C342C]">{critter.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E4D8C8]/60">
                    <span className="text-[#7A6F64] text-[11px]">Precio Mini Nook:</span>
                    <span className="font-bold text-[#489D6C] tabular-nums">
                      {critter.price.toLocaleString()} bayas
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Caught & Donated */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4D8C8]/60 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playSound(isCaught ? 'pop' : 'fanfare');
                    onToggleCaught(critter.id);
                  }}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isCaught
                      ? 'bg-[#489D6C] border-[#489D6C] text-[#FAF6F0] font-semibold'
                      : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCaught ? 'Atrapado' : 'Atrapar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playSound(isDonated ? 'pop' : 'bell');
                    onToggleDonated(critter.id);
                  }}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isDonated
                      ? 'bg-[#C86343] border-[#C86343] text-[#FAF6F0] font-semibold'
                      : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
                  }`}
                >
                  <span>🏛️</span>
                  <span>{isDonated ? 'Donado' : 'Donar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCritters.length === 0 && (
        <div className="p-12 text-center bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl">
          <p className="text-sm font-semibold text-[#3C342C]">No se encontraron especímenes con los filtros seleccionados.</p>
          <p className="text-xs text-[#7A6F64] mt-1">Prueba cambiando la categoría o desactivando "Disponible Ahora".</p>
        </div>
      )}

      {/* DETAIL MODAL FOR CRITTER */}
      {selectedCritter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-lg w-full shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#E4D8C8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64]">
                  Ficha de la Capturopedia
                </span>
                <h3 className="text-xl font-bold text-[#3C342C]">{selectedCritter.nameSpanish}</h3>
                <p className="text-xs text-[#7A6F64]">{selectedCritter.name}</p>
              </div>
              <button
                onClick={() => setSelectedCritter(null)}
                className="p-1 text-[#7A6F64] hover:text-[#3C342C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                <span className="text-[#7A6F64] block text-[10px] uppercase font-bold">Hábitat / Lugar</span>
                <p className="font-semibold text-[#3C342C] mt-0.5">{selectedCritter.location}</p>
              </div>

              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                <span className="text-[#7A6F64] block text-[10px] uppercase font-bold">Horario de Actividad</span>
                <p className="font-semibold text-[#3C342C] mt-0.5">{selectedCritter.time}</p>
              </div>

              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                <span className="text-[#7A6F64] block text-[10px] uppercase font-bold">Precio Mini Nook</span>
                <p className="font-bold text-[#489D6C] mt-0.5 tabular-nums">
                  {selectedCritter.price.toLocaleString()} bayas
                </p>
              </div>

              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8]">
                <span className="text-[#7A6F64] block text-[10px] uppercase font-bold">
                  Precio Kamilo / CJ (1.5x)
                </span>
                <p className="font-bold text-[#C86343] mt-0.5 tabular-nums">
                  {selectedCritter.flickCjPrice.toLocaleString()} bayas
                </p>
              </div>
            </div>

            {/* Calendar Grid of Months Available */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64] block mb-2">
                Meses Activos (Hemisferio {userHemisphere})
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center">
                {monthNames.map((m, idx) => {
                  const mNum = idx + 1;
                  const active = isAvailableThisMonth(selectedCritter, mNum);
                  const isCurrent = mNum === currentMonth;

                  return (
                    <div
                      key={m}
                      className={`p-1.5 rounded-lg text-[10px] font-semibold border ${
                        active
                          ? 'bg-[#489D6C] text-[#FAF6F0] border-[#489D6C]'
                          : 'bg-[#FCFAF6] text-[#A89C8F] border-[#E4D8C8]/60'
                      } ${isCurrent ? 'ring-2 ring-[#C86343]' : ''}`}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E4D8C8]">
              <button
                type="button"
                onClick={() => setSelectedCritter(null)}
                className="px-4 py-2 bg-[#3C342C] text-[#FAF6F0] rounded-xl text-xs font-semibold cursor-pointer"
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
