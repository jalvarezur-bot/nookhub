import React from 'react';
import { SPECIAL_VISITORS, CALENDAR_EVENTS } from '../data/events';
import { VILLAGERS_DATA } from '../data/villagers';
import { ResidentState, Villager } from '../types';
import { VillagerAvatar } from './VillagerAvatar';
import { Bell, Cake, Calendar, Sparkles, X, Compass, ExternalLink } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  residents: ResidentState[];
  onOpenWikiDetail: (villager: Villager) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  residents,
  onOpenWikiDetail
}) => {
  if (!isOpen) return null;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Find today's birthdays
  const todayBirthdays = VILLAGERS_DATA.filter(
    (v) => v.birthday.month === currentMonth && v.birthday.day === currentDay
  );

  // Find this month's upcoming birthdays
  const monthBirthdays = VILLAGERS_DATA.filter(
    (v) => v.birthday.month === currentMonth && v.birthday.day > currentDay
  ).slice(0, 6);

  // Check which resident has birthdays soon
  const myResidentIds = residents.map((r) => r.villagerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F0E8DC] border-b border-[#E4D8C8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C86343] text-[#FAF6F0] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#3C342C]">Notificaciones & Calendario Insular</h3>
              <p className="text-xs text-[#7A6F64]">Cumpleaños, eventos especiales y visitas de personajes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A6F64] hover:text-[#3C342C] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#3C342C]">
          {/* Section 1: Today's Birthdays */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cake className="w-4 h-4 text-[#E6B84A]" />
              <h4 className="font-bold text-[#3C342C] text-sm">Cumpleaños de Hoy ({currentDay}/{currentMonth})</h4>
            </div>

            {todayBirthdays.length > 0 ? (
              <div className="space-y-2">
                {todayBirthdays.map((v) => {
                  const isMyResident = myResidentIds.includes(v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        onClose();
                        onOpenWikiDetail(v);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isMyResident
                          ? 'bg-[#E2F0E7] border-[#489D6C]'
                          : 'bg-[#FCFAF6] border-[#E4D8C8] hover:bg-[#F0E8DC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <VillagerAvatar villager={v} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#3C342C]">{v.nameSpanish}</span>
                            {isMyResident && (
                              <span className="text-[10px] font-bold text-[#489D6C] bg-white px-2 py-0.5 rounded-full border border-[#BDDCB8]">
                                ¡Tu vecino!
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A6F64]">
                            {v.speciesSpanish} · Gustos: {v.favoriteColors.join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-[#489D6C] font-semibold flex items-center gap-1">
                        Ver Ficha <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] text-[#7A6F64]">
                Ningún aldeano canónico cumple años hoy. ¡Mira los que vienen en los próximos días!
              </div>
            )}
          </div>

          {/* Section 2: Upcoming Birthdays */}
          {monthBirthdays.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E4D8C8]">
              <h5 className="font-bold text-[#7A6F64] text-[10px] uppercase tracking-wider">
                Próximos en este mes
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {monthBirthdays.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onClose();
                      onOpenWikiDetail(v);
                    }}
                    className="p-2.5 bg-[#FCFAF6] hover:bg-[#F0E8DC] rounded-xl border border-[#E4D8C8] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[#3C342C] truncate">{v.nameSpanish}</span>
                      <span className="text-[10px] text-[#7A6F64]">({v.speciesSpanish})</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#489D6C] tabular-nums shrink-0">
                      {v.birthday.display}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Seasonal Events Calendar */}
          <div className="space-y-3 pt-2 border-t border-[#E4D8C8]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3E8F9F]" />
              <h4 className="font-bold text-[#3C342C] text-sm">Grandes Eventos del Calendario</h4>
            </div>

            <div className="space-y-2">
              {CALENDAR_EVENTS.map((event) => (
                <div key={event.id} className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3C342C]">{event.title}</span>
                    <span className="text-[10px] text-[#7A6F64] font-medium">{event.schedule}</span>
                  </div>
                  <p className="text-[11px] text-[#5C534A] leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Special Visitors Guide */}
          <div className="space-y-3 pt-2 border-t border-[#E4D8C8]">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#489D6C]" />
              <h4 className="font-bold text-[#3C342C] text-sm">Horario de Visitas de Personajes</h4>
            </div>

            <div className="space-y-2">
              {SPECIAL_VISITORS.map((v) => (
                <div key={v.id} className="p-3 bg-[#FCFAF6] rounded-xl border border-[#E4D8C8] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3C342C]">{v.name}</span>
                    <span className="text-[10px] text-[#489D6C] font-semibold">{v.schedule}</span>
                  </div>
                  <p className="text-[11px] text-[#5C534A] leading-relaxed">{v.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F0E8DC] border-t border-[#E4D8C8] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#3C342C] text-[#FAF6F0] rounded-xl text-xs font-semibold cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
