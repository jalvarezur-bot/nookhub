import React, { useState } from 'react';
import { IslandPassport, ResidentState, Critter, Villager } from '../types';
import { VILLAGERS_DATA } from '../data/villagers';
import { CRITTERS_DATA } from '../data/critters';
import { SPECIAL_VISITORS, CALENDAR_EVENTS } from '../data/events';
import { playSound } from '../utils/audio';
import { VillagerAvatar } from './VillagerAvatar';
import { Calendar, Cake, Check, Clock, Sun, Sparkles, Compass, AlertCircle, ArrowRight, Music, Star, Award } from 'lucide-react';
import { PROJECT_K_TASKS } from '../data/projectK';

interface HomeDashboardProps {
  passport: IslandPassport;
  residents: ResidentState[];
  dailyTasks: { id: string; label: string; done: boolean; icon: string }[];
  onToggleDailyTask: (id: string) => void;
  caughtList: string[];
  donatedList: string[];
  onToggleCaught: (id: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenWikiDetail: (villager: Villager) => void;
  soundEnabled: boolean;
  projectKCompleted?: string[];
  onOpenProjectK?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  passport,
  residents,
  dailyTasks,
  onToggleDailyTask,
  caughtList,
  donatedList,
  onToggleCaught,
  onNavigateTab,
  onOpenWikiDetail,
  soundEnabled,
  projectKCompleted = [],
  onOpenProjectK
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentDay = currentDate.getDate();        // 1-31
  const currentHour = currentDate.getHours();      // 0-23
  const currentDayOfWeek = currentDate.getDay();   // 0 = Sunday, 6 = Saturday

  // Day name & formatted date in Spanish
  const dateFormatted = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate current season for hemisphere
  const getSeason = (month: number, hemisphere: 'Norte' | 'Sur') => {
    if (hemisphere === 'Norte') {
      if (month >= 3 && month <= 5) return { name: 'Primavera', icon: '🌸', desc: 'Brisa tibia y flores silvestres' };
      if (month >= 6 && month <= 8) return { name: 'Verano', icon: '☀️', desc: 'Tiburones y escarabajos dorados' };
      if (month >= 9 && month <= 11) return { name: 'Otoño', icon: '🍂', desc: 'Setas, piñas y hojas de arce' };
      return { name: 'Invierno', icon: '❄️', desc: 'Copos de nieve y muñecos Copito' };
    } else {
      if (month >= 9 && month <= 11) return { name: 'Primavera', icon: '🌸', desc: 'Brisa tibia y flores silvestres' };
      if (month >= 12 || month <= 2) return { name: 'Verano', icon: '☀️', desc: 'Tiburones y escarabajos dorados' };
      if (month >= 3 && month <= 5) return { name: 'Otoño', icon: '🍂', desc: 'Setas, piñas y hojas de arce' };
      return { name: 'Invierno', icon: '❄️', desc: 'Copos de nieve y muñecos Copito' };
    }
  };

  const season = getSeason(currentMonth, passport.hemisphere);

  // Today's birthdays across all villagers
  const todayBirthdays = VILLAGERS_DATA.filter(
    (v) => v.birthday.month === currentMonth && v.birthday.day === currentDay
  );

  // Check if any island resident has a birthday today
  const residentBirthdays = residents
    .map((r) => VILLAGERS_DATA.find((v) => v.id === r.villagerId))
    .filter((v): v is Villager => Boolean(v && v.birthday.month === currentMonth && v.birthday.day === currentDay));

  // Upcoming birthdays this month
  const upcomingBirthdays = VILLAGERS_DATA.filter((v) => {
    return v.birthday.month === currentMonth && v.birthday.day >= currentDay && v.birthday.day <= currentDay + 7;
  }).slice(0, 4);

  // Available critters right now
  const availableCrittersNow = CRITTERS_DATA.filter((c) => {
    const months = passport.hemisphere === 'Norte' ? c.monthsNorth : c.monthsSouth;
    return months.includes(currentMonth) && c.timeHours.includes(currentHour);
  });

  const unCaughtCrittersNow = availableCrittersNow.filter((c) => !caughtList.includes(c.id)).slice(0, 6);

  // Daily task completed count
  const completedTasks = dailyTasks.filter((t) => t.done).length;

  // Predict default special visitor based on day
  const getExpectedVisitor = () => {
    if (currentDayOfWeek === 0) return SPECIAL_VISITORS.find((v) => v.id === 'daisy_mae');
    if (currentDayOfWeek === 6) return SPECIAL_VISITORS.find((v) => v.id === 'kk_slider');
    return null;
  };

  const expectedVisitor = getExpectedVisitor();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Island Welcome Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E4D8C8] bg-[#FAF6F0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#489D6C]">
              <span>{season.icon} {season.name} en el Hemisferio {passport.hemisphere}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{dateFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#3C342C]">
              ¡Buenos días, {passport.islandRep}!
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6F64] max-w-xl leading-relaxed">
              La brisa en <strong className="text-[#3C342C]">{passport.islandName}</strong> trae noticias frescas. {season.desc}. Tienes {10 - residents.length === 0 ? 'todas tus parcelas ocupadas con tus 10 vecinos' : `${residents.length} vecinos y ${10 - residents.length} parcelas disponibles`}.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('pasaporte')}
              className="px-4 py-2.5 rounded-xl border border-[#E4D8C8] bg-[#FCFAF6] hover:bg-[#F0E8DC] text-xs font-semibold text-[#3C342C] transition-colors cursor-pointer"
            >
              Ver Pasaporte
            </button>
            <button
              onClick={() => onNavigateTab('capturopedia')}
              className="px-5 py-2.5 rounded-xl bg-[#489D6C] hover:bg-[#3D855B] text-xs font-bold text-[#FAF6F0] shadow-xs transition-colors cursor-pointer"
            >
              Capturopedia ({caughtList.length}/28)
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S BIRTHDAY ALERT (High priority notification) */}
      {(todayBirthdays.length > 0 || residentBirthdays.length > 0) && (
        <div className="bg-[#FAF6F0] border-2 border-[#E6B84A] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E6B84A] text-[#FAF6F0] flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              🎂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#C86343] tracking-wider">
                  ¡Cumpleaños de Hoy!
                </span>
                {residentBirthdays.length > 0 && (
                  <span className="text-[10px] font-bold bg-[#C86343] text-white px-2 py-0.5 rounded-full">
                    ¡Vecino de tu Isla!
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-[#3C342C] mt-0.5">
                Hoy celebra su día:{' '}
                {todayBirthdays.map((v) => `${v.nameSpanish} (${v.speciesSpanish})`).join(', ')}
              </h2>
              <p className="text-xs text-[#7A6F64]">
                ¡No olvides visitarle en su casa con un regalo envuelto para recibir los puntos máximos de amistad!
              </p>
            </div>
          </div>

          {todayBirthdays[0] && (
            <button
              onClick={() => onOpenWikiDetail(todayBirthdays[0])}
              className="px-4 py-2 text-xs font-bold text-[#3C342C] bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl hover:bg-[#F0E8DC] transition-colors whitespace-nowrap cursor-pointer"
            >
              Ver Gustos de {todayBirthdays[0].nameSpanish}
            </button>
          )}
        </div>
      )}

      {/* PROYECTO K: K.K. SLIDER CHECKLIST CARD */}
      <div className="bg-gradient-to-r from-[#2B2621] via-[#3C342C] to-[#2B2621] text-[#FAF6F0] rounded-3xl p-5 sm:p-6 shadow-md border border-[#E4D8C8]/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E6B84A] text-[#2B2621] flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <Music className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6B84A] bg-[#FAF6F0]/10 px-2 py-0.5 rounded-full">
                Meta Principal del Juego
              </span>
              <span className="text-xs text-[#FAF6F0]/70 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#E6B84A] fill-[#E6B84A]" />
                3 Estrellas (★★★)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#FAF6F0] tracking-tight">
              Proyecto K: Tareas Necesarias para Traer a Totakeke
            </h3>
            <p className="text-xs text-[#FAF6F0]/80 max-w-xl">
              Lista oficial de requisitos de Tom Nook y Canela para desbloquear el concierto histórico y la app de Obras Públicas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto relative z-10">
          <div className="bg-[#FAF6F0]/10 border border-[#FAF6F0]/15 rounded-2xl px-4 py-2.5 text-right sm:min-w-[170px]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#FAF6F0]/80">Progreso:</span>
              <span className="text-[#E6B84A] font-bold tabular-nums">
                {projectKCompleted.length} / {PROJECT_K_TASKS.length} ({Math.round((projectKCompleted.length / PROJECT_K_TASKS.length) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#FAF6F0]/20 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-[#E6B84A] to-[#489D6C] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.round((projectKCompleted.length / PROJECT_K_TASKS.length) * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playSound('stamp');
              if (onOpenProjectK) onOpenProjectK();
            }}
            className="px-5 py-3 rounded-2xl bg-[#E6B84A] hover:bg-[#D5A73E] text-[#2B2621] text-xs font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver Lista Oficial</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT: Daily Tasks & Visitors vs Critters Now */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Checklist & Island Visitor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Island Checklist */}
          <div className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
              <div>
                <h3 className="text-base font-bold text-[#3C342C]">Rutina Diaria de la Isla</h3>
                <p className="text-xs text-[#7A6F64]">Se reinicia automáticamente cada día a las 5:00 AM</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#489D6C] tabular-nums">
                  {completedTasks} de {dailyTasks.length} completadas
                </span>
                <div className="w-28 bg-[#E4D8C8]/60 h-2 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-[#489D6C] h-full rounded-full transition-all duration-300"
                    style={{ width: `${(completedTasks / dailyTasks.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dailyTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playSound(task.done ? 'pop' : 'bell');
                    onToggleDailyTask(task.id);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    task.done
                      ? 'bg-[#E2F0E7]/60 border-[#BDDCB8] text-[#5C534A]'
                      : 'bg-[#FAF6F0] border-[#E4D8C8] hover:border-[#D2C4B1] text-[#3C342C]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      task.done
                        ? 'bg-[#489D6C] border-[#489D6C] text-white'
                        : 'border-[#D2C4B1] bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs leading-snug ${task.done ? 'line-through text-[#7A6F64]' : 'font-medium'}`}>
                    {task.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visitor of the Day */}
          <div className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#489D6C]" />
                <h3 className="text-base font-bold text-[#3C342C]">Visitas Especiales en tu Isla</h3>
              </div>
              <span className="text-xs text-[#7A6F64]">Guía de personajes errantes</span>
            </div>

            {expectedVisitor ? (
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#489D6C]">¡Visita Programada Hoy!</span>
                  <span className="text-[11px] text-[#7A6F64]">{expectedVisitor.schedule}</span>
                </div>
                <h4 className="text-base font-bold text-[#3C342C]">{expectedVisitor.name}</h4>
                <p className="text-xs text-[#5C534A] leading-relaxed">{expectedVisitor.purpose}</p>
                <div className="text-[11px] text-[#825E3E] font-medium bg-[#F0E8DC] p-2 rounded-lg mt-1">
                  💡 {expectedVisitor.tip}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8] text-xs text-[#5C534A] space-y-2">
                <p>
                  De lunes a viernes, uno de los visitantes errantes llega a tu isla: <strong>Ladino</strong> (en la playa secreta), <strong>Kamilo</strong> (compra bichos x1.5), <strong>CJ</strong> (compra peces x1.5), <strong>Gulliver</strong> (en la orilla), <strong>Gandulio</strong>, <strong>Betunio</strong> o <strong>Alcatifa</strong>. Y si la noche está despejada, ¡busca a <strong>Estela</strong> entre las 19:00 y las 4:00!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Catch Right Now & Upcoming Events */}
        <div className="space-y-6">
          {/* Disponibles para capturar ahora */}
          <div className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
              <div>
                <h3 className="text-base font-bold text-[#3C342C]">Disponible Ahora</h3>
                <p className="text-xs text-[#7A6F64]">Especímenes activos a las {currentHour}:00 hrs</p>
              </div>
              <button
                onClick={() => onNavigateTab('capturopedia')}
                className="text-xs text-[#489D6C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {unCaughtCrittersNow.map((critter) => (
                <div
                  key={critter.id}
                  className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#3C342C] truncate">{critter.nameSpanish}</span>
                      <span className="text-[10px] text-[#7A6F64]">
                        {critter.category === 'fish' ? '🐟' : critter.category === 'bug' ? '🦋' : '🤿'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6F64] truncate">{critter.location}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (soundEnabled) playSound('fanfare');
                      onToggleCaught(critter.id);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#489D6C] bg-[#E2F0E7] hover:bg-[#489D6C] hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Atrapar
                  </button>
                </div>
              ))}

              {unCaughtCrittersNow.length === 0 && (
                <div className="p-4 text-center text-xs text-[#7A6F64]">
                  ¡Has capturado todos los especímenes activos a esta hora! Revisa más tarde o explora otras categorías.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Birthdays This Month */}
          <div className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-[#E6B84A]" />
                <h3 className="text-base font-bold text-[#3C342C]">Próximos Cumpleaños</h3>
              </div>
              <span className="text-xs text-[#7A6F64]">Esta semana</span>
            </div>

            <div className="space-y-2 text-xs">
              {upcomingBirthdays.map((v) => (
                <div
                  key={v.id}
                  onClick={() => onOpenWikiDetail(v)}
                  className="p-2.5 bg-[#FAF6F0] hover:bg-[#F0E8DC] rounded-xl border border-[#E4D8C8]/60 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VillagerAvatar villager={v} size="sm" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#3C342C] truncate">{v.nameSpanish}</p>
                      <p className="text-[10px] text-[#7A6F64]">{v.speciesSpanish}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#489D6C] shrink-0 tabular-nums">
                    {v.birthday.display}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
