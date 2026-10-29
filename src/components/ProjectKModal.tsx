import React, { useState } from 'react';
import { PROJECT_K_TASKS, ProjectKTask } from '../data/projectK';
import { playSound } from '../utils/audio';
import {
  Sparkles,
  Check,
  Star,
  Music,
  MapPin,
  ChevronRight,
  Award,
  HelpCircle,
  X,
  Palmtree,
  MessageSquareQuote,
  Flame,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectKModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  soundEnabled: boolean;
}

export const ProjectKModal: React.FC<ProjectKModalProps> = ({
  isOpen,
  onClose,
  completedTasks,
  onToggleTask,
  soundEnabled
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  if (!isOpen) return null;

  const totalTasks = PROJECT_K_TASKS.length;
  const completedCount = completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const phases = [
    { num: 1, title: 'Fase 1: Asentamiento' },
    { num: 2, title: 'Fase 2: Acampada y Vecinos' },
    { num: 3, title: 'Fase 3: 3 Estrellas (★★★)' },
    { num: 4, title: 'Fase 4: El Concierto' },
  ];

  const filteredTasks = PROJECT_K_TASKS.filter((task) => {
    if (selectedPhase !== 'all' && task.phase !== selectedPhase) return false;
    const isDone = completedTasks.includes(task.id);
    if (filterMode === 'pending' && isDone) return false;
    if (filterMode === 'completed' && !isDone) return false;
    return true;
  });

  const handleTaskClick = (task: ProjectKTask) => {
    const isAlreadyDone = completedTasks.includes(task.id);
    if (soundEnabled) {
      playSound(isAlreadyDone ? 'pop' : 'stamp');
    }
    onToggleTask(task.id);

    // If this completed the very last task, celebrate with confetti
    if (!isAlreadyDone && completedCount + 1 === totalTasks) {
      if (soundEnabled) playSound('fanfare');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const getNpcBadge = (npc: ProjectKTask['gameNpc']) => {
    switch (npc) {
      case 'Tom Nook':
        return 'bg-[#7B583E] text-[#FAF6F0]';
      case 'Canela':
        return 'bg-[#E5AA38] text-[#FAF6F0]';
      case 'Tendo y Nendo':
        return 'bg-[#489D6C] text-[#FAF6F0]';
      case 'Sócrates':
        return 'bg-[#504068] text-[#FAF6F0]';
      default:
        return 'bg-[#3C342C] text-[#FAF6F0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3C342C]/40 backdrop-blur-xs">
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in">
        {/* Modal Top Banner (Nintendo & K.K. Slider aesthetic) */}
        <div className="bg-gradient-to-r from-[#2B2621] via-[#3C342C] to-[#2B2621] text-[#FAF6F0] p-5 sm:p-6 border-b border-[#E4D8C8] relative overflow-hidden">
          {/* Subtle decorative vinyl/guitar accents */}
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full border-4 border-[#FAF6F0]/10 pointer-events-none" />
          <div className="absolute right-12 top-6 w-20 h-20 rounded-full border-2 border-[#FAF6F0]/5 pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E6B84A] text-[#2B2621] flex items-center justify-center shadow-md shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6B84A] bg-[#FAF6F0]/10 px-2.5 py-0.5 rounded-full">
                    Proyecto K · Nook Inc.
                  </span>
                  <span className="text-xs text-[#FAF6F0]/70 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#E6B84A] fill-[#E6B84A]" />
                    Meta: 3 Estrellas (★★★)
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#FAF6F0] mt-1 font-heading">
                  Guía Oficial para Obtener a Totakeke (K.K. Slider)
                </h2>
                <p className="text-xs text-[#FAF6F0]/80 mt-1 max-w-xl">
                  La lista de objetivos exactos de Animal Crossing: New Horizons para cumplir los requisitos de Tom Nook y Canela, celebrar el concierto inaugural y desbloquear Obras Públicas.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (soundEnabled) playSound('pop');
                onClose();
              }}
              className="p-2 text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-[#FAF6F0]/10 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-5 bg-[#FAF6F0]/10 p-3.5 rounded-2xl border border-[#FAF6F0]/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#FAF6F0]">
                <Award className="w-4 h-4 text-[#E6B84A]" />
                Progreso General del Proyecto K
              </span>
              <span className="text-[#E6B84A] font-bold tabular-nums">
                {completedCount} de {totalTasks} tareas ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#FAF6F0]/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#E6B84A] to-[#489D6C] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <p className="text-[11px] text-[#A6E3B8] font-semibold text-center pt-0.5">
                🎉 ¡Felicidades! Has cumplido todos los requisitos oficiales. Totakeke tocará en tu isla cada sábado.
              </p>
            )}
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="px-4 sm:px-6 py-3 bg-[#F0E8DC] border-b border-[#E4D8C8] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                if (soundEnabled) playSound('pop');
                setSelectedPhase('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                selectedPhase === 'all'
                  ? 'bg-[#3C342C] text-[#FAF6F0] shadow-2xs'
                  : 'bg-[#FAF6F0] text-[#7A6F64] hover:text-[#3C342C]'
              }`}
            >
              Todas las fases ({totalTasks})
            </button>
            {phases.map((p) => {
              const phaseTasks = PROJECT_K_TASKS.filter((t) => t.phase === p.num);
              const phaseDone = phaseTasks.filter((t) => completedTasks.includes(t.id)).length;
              return (
                <button
                  key={p.num}
                  onClick={() => {
                    if (soundEnabled) playSound('pop');
                    setSelectedPhase(p.num);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    selectedPhase === p.num
                      ? 'bg-[#3C342C] text-[#FAF6F0] shadow-2xs'
                      : 'bg-[#FAF6F0] text-[#7A6F64] hover:text-[#3C342C]'
                  }`}
                >
                  {p.title} ({phaseDone}/{phaseTasks.length})
                </button>
              );
            })}
          </div>

          {/* Status filter: All, Pending, Completed */}
          <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#E4D8C8] shrink-0 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-[#489D6C] text-[#FAF6F0]' : 'text-[#7A6F64]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'pending' ? 'bg-[#489D6C] text-[#FAF6F0]' : 'text-[#7A6F64]'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'completed' ? 'bg-[#489D6C] text-[#FAF6F0]' : 'text-[#7A6F64]'
              }`}
            >
              Listas
            </button>
          </div>
        </div>

        {/* Task List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7A6F64]">
              No hay tareas en esta vista. ¡Cambia el filtro o selecciona otra fase!
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer relative group flex items-start gap-4 ${
                    isDone
                      ? 'bg-[#EAF3EC] border-[#A6D4B2] shadow-2xs'
                      : 'bg-[#FCFAF6] border-[#E4D8C8] hover:border-[#489D6C] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {/* Custom Styled AC Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-[#489D6C] border-[#489D6C] text-[#FAF6F0]'
                        : 'border-[#C8BAA7] bg-[#FAF6F0] group-hover:border-[#489D6C]'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getNpcBadge(task.gameNpc)}`}>
                        {task.gameNpc}
                      </span>
                      <span className="text-[11px] font-medium text-[#7A6F64]">
                        {task.phaseTitle.split(':')[0]}
                      </span>
                      {task.pointsContribution && (
                        <span className="text-[10px] text-[#489D6C] font-semibold bg-[#E2F0E7] px-2 py-0.5 rounded-full">
                          {task.pointsContribution}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        isDone ? 'text-[#2D6645] line-through decoration-2 opacity-85' : 'text-[#3C342C]'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="text-xs text-[#5C534A] leading-relaxed">
                      {task.description}
                    </p>

                    {/* Exact In-Game Requirement Detail */}
                    <div className="bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E4D8C8]/80 text-[11px] text-[#3C342C] space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="font-bold text-[#7A6F64]">Requisito del juego:</span>
                        <span>{task.requirementDetail}</span>
                      </div>
                      {task.isabelletip && (
                        <div className="flex items-start gap-1.5 text-[#B05234] italic pt-1 border-t border-[#E4D8C8]/60">
                          <MessageSquareQuote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Consejo de Canela: "{task.isabelletip}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Reward Box: What Unlocks with Totakeke */}
          <div className="mt-6 bg-[#FCFAF6] border-2 border-dashed border-[#D2C4B1] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3C342C]">
              <Sparkles className="w-4 h-4 text-[#E6B84A]" />
              <span>¿Qué desbloqueas al completar el Proyecto K y traer a Totakeke?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5C534A]">
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]">
                <p className="font-bold text-[#3C342C] flex items-center gap-1.5">
                  🚜 App Obras Públicas (Island Designer)
                </p>
                <p className="text-[11px] text-[#7A6F64] mt-1">
                  Permiso para terraformar la isla: crear y demoler acantilados, redirigir ríos y cascadas, y colocar caminos de adoquines, madera y piedra.
                </p>
              </div>
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]">
                <p className="font-bold text-[#3C342C] flex items-center gap-1.5">
                  🎸 Conciertos Semanales de K.K. Slider
                </p>
                <p className="text-[11px] text-[#7A6F64] mt-1">
                  Totakeke visitará la plaza todos los sábados. A partir de las 18:00 hrs puedes pedirle cualquier canción de su repertorio para obtener su disco gratis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F0E8DC] border-t border-[#E4D8C8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7A6F64] text-center sm:text-left">
            Tus marcas de verificación se guardan automáticamente y se sincronizan en tu cuenta de Google.
          </p>
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold rounded-xl bg-[#3C342C] hover:bg-[#2B2621] text-[#FAF6F0] transition-colors cursor-pointer"
          >
            Entendido, volver a la isla
          </button>
        </div>
      </div>
    </div>
  );
};
