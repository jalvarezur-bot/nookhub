import React from 'react';
import {
  Home,
  Contact,
  Users,
  Compass,
  BookOpen,
  ShoppingBag,
  Image as ImageIcon
} from 'lucide-react';
import { NavTab } from './Header';
import { playSound } from '../utils/audio';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  soundEnabled: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled
}) => {
  const items: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'pasaporte', label: 'Pasaporte', icon: Contact },
    { id: 'vecinos', label: 'Vecinos', icon: Users },
    { id: 'capturopedia', label: 'Bichos', icon: Compass },
    { id: 'wiki', label: 'Wiki', icon: BookOpen },
    { id: 'catalogo', label: 'Catálogo', icon: ShoppingBag },
    { id: 'galeria', label: 'Fotos', icon: ImageIcon }
  ];

  const handleSelect = (tab: NavTab) => {
    if (soundEnabled) playSound('pop');
    setActiveTab(tab);
  };

  return (
    <nav
      aria-label="Navegación Móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#E4D8C8] px-2 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[48px] ${
                isActive
                  ? 'text-[#489D6C] font-semibold scale-105'
                  : 'text-[#7A6F64] hover:text-[#3C342C] active:scale-95'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#E2F0E7] text-[#489D6C]' : 'hover:bg-[#F0E8DC]'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
